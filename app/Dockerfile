FROM node:20-alpine AS build

WORKDIR /app

COPY ./package*.json .
RUN npm install

COPY . .

RUN npm run build --omit=dev

# Etapa de producción
FROM nginx:alpine

COPY --from=build /app/dist/nonogram-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
