# Builds one front-end micro-app. Build context is the repo root.
#   docker build -f docker/app.Dockerfile --build-arg APP=event-creation .
FROM node:22-alpine AS build
ARG APP
ARG VITE_API_URL=http://localhost:4000
ENV VITE_API_URL=$VITE_API_URL
WORKDIR /repo
COPY package.json package-lock.json* ./
COPY apps ./apps
COPY packages ./packages
COPY services/api/package.json ./services/api/package.json
RUN npm install
RUN npm run build -w @community/$APP

FROM nginx:1.27-alpine
ARG APP
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/${APP}/dist /usr/share/nginx/html
EXPOSE 80
