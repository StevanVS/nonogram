import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import boardRoutes from "./modules/boards/board.routes";
import levelRoutes from "./modules/levels/level.routes";
import gameRoutes from "./modules/games/game.routes";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import { NODE_ENV, CDatabase } from "./config";
import mongoose from "mongoose";

class App {
  public express;

  constructor() {
    this.express = express();
  }

  async init(port: number | string) {
    await this.connectDB();
    this.mountMiddlewares();
    this.mountRoutes();

    this.express.listen(port, () => {
      console.log("NODE_ENV", NODE_ENV);
      console.log(`Server listening in port ${port}`);
    });
  }

  private mountMiddlewares() {
    this.express.use(json());
    this.express.use(
      cors({
        origin:
          NODE_ENV === "production"
            ? ["http://localhost:8080", "http://127.0.0.1:8080"]
            : ["http://localhost:4200", "http://127.0.0.1:4200"],
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
    this.express.use("/games", gameRoutes);
    this.express.use("/auth", authRoutes);
    this.express.use("/users", userRoutes);
  }

  private async connectDB() {
    try {
      console.log("CDatabase", CDatabase);
      await mongoose.connect(CDatabase.url, {
        autoIndex: NODE_ENV !== "production",
        auth: { username: CDatabase.username, password: CDatabase.password },
        // authSource: "admin",
        dbName: CDatabase.dbname,
      });

      console.log("Connected de DB");
    } catch (error) {
      console.error("Failed to connect do DB", error);
      // process.exit(1);
    }
  }
}

export default new App();
