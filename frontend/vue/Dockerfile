FROM node:18 as f-file-loader
WORKDIR /data
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY tsconfig.app.json .
COPY env.d.ts .
COPY vite.config.ts .

FROM node:18 as f-dependencyfetcher
WORKDIR /build
COPY --from=f-file-loader /data .
RUN npm install

FROM f-dependencyfetcher as f-build-files
WORKDIR /build
RUN mkdir src
COPY src ./src
COPY index.html .
COPY public ./public

# Prod builds
FROM f-build-files as f-prod

ARG BASE_URL
ARG API_URL
ARG AUTH_URL
ARG CLIENT_ID

ENV VITE_BASE_URL=$BASE_URL
ENV VITE_API_URL=$API_URL
ENV VITE_AUTH_URL=$AUTH_URL
ENV VITE_CLIENT_ID=$CLIENT_ID
RUN npm run build

FROM nginx:1.27.3 as frontend
COPY docker/remote.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=f-prod /build/dist /usr/share/nginx/html

EXPOSE 80