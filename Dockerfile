FROM node:18-alpine3.15 AS base

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 8018

CMD ["node", "dist/index.js"]
