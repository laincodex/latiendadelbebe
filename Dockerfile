FROM node:lts-alpine
WORKDIR /app
COPY dist .
COPY docker.package.json ./package.json
RUN npm install
CMD ["node", "dist/app.js"]
EXPOSE 80:5000