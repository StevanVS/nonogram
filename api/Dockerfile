FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY ./package*.json .
RUN npm install

COPY . .

RUN npm run build


# Etapa de producción
FROM node:20-alpine AS production

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /usr/src/app/build ./build

CMD ["npm", "start"]
