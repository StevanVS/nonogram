Iniciar desarrollo
`docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d`

Ingresar a mongodb mediente consola
`docker exec -ti nonogram-mongodb mongosh nonogram -u stevan -p root --authenticationDatabase admin`