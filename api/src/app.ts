import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { json } from "body-parser";

export default class App {
  public express;
  public mongoClient: MongoClient;

  constructor(mongoClient: MongoClient) {
    this.express = express();
    this.mongoClient = mongoClient;
  }

  async init(port: number | string) {
    await this.testDatabase();
    this.mountMiddleares();
    this.mountRoutes();

    this.express.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  }

  private mountMiddleares() {
    this.express.use(json());
    this.express.use(cors());
  }

  private mountRoutes() {
    this.express.use("/boards", require("./routes/boards/routes"));
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
