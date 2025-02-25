# STAGE 1
FROM node:18-alpine AS build

WORKDIR /backend

COPY package*.json ./

RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["node","dist/server.js"]
