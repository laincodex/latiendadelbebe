FROM node:lts-alpine
WORKDIR /app
COPY dist/ .
COPY docker/docker.package.json ./package.json
RUN yarn install
COPY docker/cron.sh /etc/cron.d/cron.sh
COPY docker/entrypoint.sh /entrypoint.sh
ENTRYPOINT /entrypoint.sh
EXPOSE 8080:8080
