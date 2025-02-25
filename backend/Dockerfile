# STAGE 1
FROM node:18-alpine AS build

WORKDIR /backend

COPY package*.json ./

RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run build



# Stage 2
FROM node:18-alpine

WORKDIR /backend

COPY --from=build /backend/* ./

RUN pwd
RUN ls ./ | grep dist
RUN ls ./dist


RUN npx prisma generate

EXPOSE 3000

CMD ["npm","run","start"]