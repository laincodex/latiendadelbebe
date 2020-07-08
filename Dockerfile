FROM node:lts-alpine
WORKDIR /app
COPY dist/ .
COPY docker.package.json ./package.json
RUN npm install
COPY cron.sh /etc/cron.d/tienda.sh
CMD ["node", "app.js"]
EXPOSE 80:5000