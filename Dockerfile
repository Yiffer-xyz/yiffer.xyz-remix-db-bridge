FROM node:18-alpine3.15 AS base

COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

COPY . .

RUN yarn

RUN yarn build

EXPOSE 8018

CMD ["node", "dist/index.js"]
