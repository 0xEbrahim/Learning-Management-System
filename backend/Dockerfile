FROM node:hydrogen-alpine3.21

WORKDIR /backend

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm","run","start"]