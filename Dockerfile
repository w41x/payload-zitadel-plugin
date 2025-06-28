# syntax = docker/dockerfile:1.7-labs

FROM node:24.3.0-alpine3.22 AS node-base
LABEL name='node base build'
# enable corepack
RUN corepack enable

FROM node-base AS plugin
LABEL name='plugin build'
# load all plugin files
COPY --chown=node --exclude=dev . .
# install node modules for plugin
RUN pnpm install
# build plugin
RUN pnpm prepublishOnly

FROM node-base AS payload-base
LABEL name='plugin test base build'
# set user and load plugin build
USER node
WORKDIR /home/node/workspace
COPY --chown=node --from=plugin dist dist
COPY --chown=node --from=plugin package.json .
# set working directory for test environment and copy the dev files
WORKDIR dev
COPY --chown=node --exclude=node_modules dev .
# install node modules for test environment
RUN pnpm install
# set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_OPTIONS --no-deprecation
ENV PATH  /home/node/workspace/dev/node_modules/.bin:$PATH
# set internal port
EXPOSE 3000

FROM payload-base as payload-dev
LABEL name='plugin test development build'
ENV NODE_ENV development
CMD pnpm dev

FROM payload-base AS payload-prod
LABEL name='plugin test production build'
ENV NODE_ENV production
CMD pnpm build && pnpm start

FROM mongo:8.0.10-noble AS db
LABEL name='db build'
# database admin user
ENV MONGO_INITDB_ROOT_USERNAME=root
ENV MONGO_INITDB_ROOT_PASSWORD=secret
# set internal port
EXPOSE 27017