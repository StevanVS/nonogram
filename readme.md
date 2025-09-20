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

# DataBase

Iniciar la Base de datos
```shell
docker compose up db -d
```

Ingresar a mongodb mediente consola
```shell
docker exec -ti nonogram-mongodb mongosh nonogram -u <user> -p <password>
```
