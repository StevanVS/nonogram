import App from "./app";
import { connectDB } from "./config/database";

const port = process.env.API_PORT || 3050;

const server = new App();

connectDB().then(() => {
  server.init(port);
});
