import { MongoClient } from "mongodb";

const mongodbUrl = process.env.MONGODB_URL || "";
const mongoClient = new MongoClient(mongodbUrl);

const db = mongoClient.db();

export default db;
export { mongoClient };
