# syntax=docker/dockerfile:1.7-labs
# Use custom version of the dockerfile spec to be able to use the --exclude flag.
# https://docs.docker.com/reference/dockerfile/#copy---exclude
# TODO revert to 1.7 when it is released.

# If you need help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG ALPINE_VERSION=3

################################################################################
# Use alpine image for base image for all stages.
FROM alpine:${ALPINE_VERSION} as nodejs

ARG NODE_VERSION=21
ARG NPM_VERSION=10
ARG TRAEFIK_VERSION=2

# Set working directory for all build stages.
WORKDIR /app

# Install nodejs
RUN apk add "nodejs-current>${NODE_VERSION}"

################################################################################
# Create a stage for installing production dependecies.
FROM nodejs as deps

# Install npm
RUN apk add "npm>${NPM_VERSION}"

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=packages/home-station/package.json,target=packages/home-station/package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm -w home-station ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps as build

# Set the commit hash to be displayed in the "About" page.
ARG COMMIT_HASH=unknown
ENV COMMIT_HASH=${COMMIT_HASH}

# Copy the rest of the source files into the image.
COPY packages/home-station packages/home-station
COPY package*.json .

# Download additional development dependencies before building.
RUN --mount=type=cache,target=/root/.npm \
    npm -w home-station ci

# Create the SvelteKit Types (https://github.com/sveltejs/kit/issues/5390) and run the build script.
RUN npx -w home-station svelte-kit sync && PUBLIC_CONTAINERIZED=true npm -w home-station run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM nodejs as final

# Install traefik
RUN apk add "traefik>${TRAEFIK_VERSION}"

# Use production node environment by default.
ENV NODE_ENV=production

# Set the origin for POST form submissions.
# https://kit.svelte.dev/docs/adapter-node#environment-variables-origin-protocolheader-hostheader-and-port-header
ENV ORIGIN=http://localhost:3000

# Copy the production dependencies from the deps stage.
COPY --from=deps /app/node_modules node_modules
# Copy the db migration files from the build stage.
COPY --from=build /app/packages/home-station/drizzle drizzle
# Copy the build output from the build stage.
COPY --from=build /app/packages/home-station/build build
# Copy the traefik static configuration file.
# The file ends with yaml, not yml on purpose. This is to override the default alpine traefik config.
COPY docker/traefik.yml /etc/traefik/traefik.yaml
# Copy the command script to run the application.
COPY docker/command.sh /app/command.sh

# 80: HTTP, 443: HTTPS
EXPOSE 80 443

# Run the application.
CMD [ "sh", "/app/command.sh" ]
