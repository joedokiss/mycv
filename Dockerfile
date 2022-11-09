FROM node:16.13.1-alpine AS development
WORKDIR /usr/src/app
COPY package*.json .

COPY . .
RUN npm run build
