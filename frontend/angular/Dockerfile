FROM alpine:latest as f-file-loader
WORKDIR /data
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY tsconfig.app.json .
COPY tsconfig.spec.json .
COPY angular.json .

FROM node:20 as f-dependencyfetcher
WORKDIR /build
COPY --from=f-file-loader /data .
RUN npm install

FROM f-dependencyfetcher as f-build-files
WORKDIR /build
COPY src ./src
COPY public ./public

# Prod builds
FROM f-build-files as f-prod

ARG BASE_URL
ARG API_URL
ARG AUTH_URL
ARG CLIENT_ID

ENV BASE_URL=$BASE_URL
ENV API_URL=$API_URL
ENV AUTH_URL=$AUTH_URL
ENV CLIENT_ID=$CLIENT_ID

RUN npm run envvars
RUN npm run build

FROM nginx:1.27.3 as frontend
COPY docker/remote.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=f-prod /build/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80
