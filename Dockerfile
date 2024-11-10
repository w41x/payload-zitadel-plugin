# syntax = docker/dockerfile:1.4.1
FROM denoland/deno:2.0.5 AS payload
LABEL name='api build'
# set user and working directory and copy all project files
USER deno
WORKDIR /home/deno/workspace
COPY --chown=deno . .
# set working directory for test environment
WORKDIR /home/node/workspace/dev
# install deno module for test environment
RUN deno install
# set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
# set internal port
EXPOSE 3000
# start test environment
CMD deno task dev

FROM mongo:8.0.3-noble as db
LABEL name='db build'
# database admin user
ENV MONGO_INITDB_ROOT_USERNAME=root
ENV MONGO_INITDB_ROOT_PASSWORD=secret
# set internal port
EXPOSE 27017