import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import boardRoutes from "./modules/boards/board.routes";
import levelRoutes from "./modules/levels/level.routes";

export default class App {
  public express;

  constructor() {
    this.express = express();
  }

  async init(port: number | string) {
    this.mountMiddlewares();
    this.mountRoutes();

    this.express.listen(port, () => {
      console.log(`Server listening in port ${port}`);
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
    this.express.use("/boards", boardRoutes);
    this.express.use("/levels", levelRoutes);
    // this.express.use("/auth", auth);
    // this.express.use("/boards", board);
    // this.express.use("/game", game);
    // this.express.use("/levels", levels);
    // this.express.use("/users", users);
  }
}
