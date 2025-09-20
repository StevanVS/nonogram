# Development

Iniciar el modo de desarrollo en App
```shell
cd app
npm start
```

Iniciar el modo de desarrollo en Api
```shell
cd api
npm run dev
```

# Production

Iniciar todos los contenedores en producción
```shell
docker compose up -d --build
```

Ingresar a mongodb mediente consola
```shell
docker exec -ti nonogram-mongodb mongosh nonogram -u stevan -p root --authenticationDatabase admin
```
