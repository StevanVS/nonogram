import App from "./app";
import { mongoClient } from "./config/mongodb";

const port = process.env.API_PORT || 3050;

new App(mongoClient).init(port);
