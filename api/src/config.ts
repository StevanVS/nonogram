const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

export const CDatabase = {
  url: `mongodb://${DB_HOST}:27017/`,
  username: DB_USER,
  password: DB_PASS,
  dbname: DB_NAME
}

export const { NODE_ENV, JWT_SECRET = "secreto", APP_HOST } = process.env;
