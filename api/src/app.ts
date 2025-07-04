import express, { json } from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import cookieParser from "cookie-parser";
import routes from "./routes/routes";

export default class App {
  public express;
  public mongoClient: MongoClient;

  constructor(mongoClient: MongoClient) {
    this.express = express();
    this.mongoClient = mongoClient;
  }

  async init(port: number | string) {
    await this.testDatabase();
    this.mountMiddlewares();
    this.mountRoutes();

    this.express.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  }

  private mountMiddlewares() {
    this.express.use(json());
    this.express.use(
      cors({
        origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
        credentials: true,
        allowedHeaders: ["Authorization", "Content-Type"],
      })
    );
    this.express.use(cookieParser());
    this.express.disable("x-powered-by");
  }

  private mountRoutes() {
    this.express.use(routes);
  }

  private async testDatabase() {
    try {
      await this.mongoClient.connect();
      console.log("Conexión a la base de datos exitosa.");
    } catch (e) {
      console.error(e);
    }
  }
}
