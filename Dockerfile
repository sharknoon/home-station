# syntax=docker/dockerfile:1

# If you need help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=21.5.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-slim as base

# Set working directory for all build stages.
WORKDIR /app

################################################################################
# Create a stage for installing production dependecies.
FROM base as deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps as build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .

# Public static environment variable to tell the build that we are running in a container.
ENV PUBLIC_CONTAINERIZED=true

# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

# Use production node environment by default.
ENV NODE_ENV=production

# Set the origin for POST form submissions.
# https://kit.svelte.dev/docs/adapter-node#environment-variables-origin-protocolheader-hostheader-and-port-header
ENV ORIGIN=http://localhost:3000

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /app/node_modules node_modules
COPY --from=build /app/drizzle drizzle
COPY --from=build /app/build build

# Hide update notifications from npm. The latest version of the node image doesn't 
# always ship with the latest version of npm
RUN npm config set update-notifier false

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application. Set the default type to module skip a package.json file with { "type": "module" }.
CMD [ "node", "--experimental-default-type=module",  "./build/index.js" ]