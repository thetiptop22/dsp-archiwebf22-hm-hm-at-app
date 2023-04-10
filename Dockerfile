FROM node:latest

RUN mkdir /app
WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build
