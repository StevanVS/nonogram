FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY ./package*.json .
RUN npm install

COPY . .

RUN npm run build


# Etapa de producción
FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=build /usr/src/app/build ./build

CMD ["npm", "start"]