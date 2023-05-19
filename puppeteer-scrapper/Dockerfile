
FROM node:18-alpine
ENV NODE_ENV=production



WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

RUN node node_modules/puppeteer/install.js

EXPOSE 3001

CMD ["npm", "start"]