import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { json } from "body-parser";
import cookieParser from "cookie-parser";

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
        origin: ["http://localhost:4200"],
        credentials: true,
        allowedHeaders: ["Authorization", "Content-Type"],
      }),
    );
    this.express.use(cookieParser());
  }

  private mountRoutes() {
    this.express.use("/auth", require("./routes/auth/routes"));
    this.express.use("/boards", require("./routes/boards/routes"));
    this.express.use("/game", require("./routes/game/routes"));
    this.express.use("/levels", require("./routes/levels/routes"));
    this.express.use("/users", require("./routes/users/routes"));
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
