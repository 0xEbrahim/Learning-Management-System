FROM node AS development

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .

RUN npx prisma generate


CMD [ "npm","run","dev" ]


FROM node AS build

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build


FROM node AS production

WORKDIR /app

COPY package*.json .

RUN npm i --only=production

COPY --from=build /app/dist ./dist

COPY . .

RUN npx prisma generate

CMD [ "npm","run","start" ]
