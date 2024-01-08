# syntax=docker/dockerfile:1

# If you need help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=21.5.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-slim as base

# Set working directory for all build stages.
WORKDIR /app

# Set the default values for environment variables that are used in all stages.
ENV DATABASE_URL=file:/app/data/db.sqlite

# Install necessary apt packages needed in all stages.
RUN --mount=type=cache,target=/var/cache/apt \
    apt-get update && \
    apt-get install -y openssl

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

# Copy prisma files into the image to be able to generate the client.
COPY prisma prisma

# Generate prisma files.
RUN npx prisma generate

# Copy the rest of the source files into the image.
COPY . .

# Migrate the database.
RUN npx prisma migrate deploy

# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

# Use production node environment by default.
ENV NODE_ENV=production

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the entrypoint script into the image.
COPY entrypoint.sh .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /app/node_modules node_modules
COPY --from=build /app/node_modules/.prisma node_modules/.prisma
COPY --from=build /app/prisma prisma
COPY --from=build /app/build build

# Hide update notifications from npm.
RUN npm config set update-notifier false

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
ENTRYPOINT [ "/app/entrypoint.sh" ]