import app from "./app";

const port = process.env.API_PORT || 3050;

app.init(port);
