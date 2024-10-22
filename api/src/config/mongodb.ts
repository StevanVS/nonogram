import { MongoClient } from "mongodb";

const host =process.env.MONDODB_HOST || ''
const user = process.env.MONGODB_USER || ''
const pass = process.env.MONGODB_PASS || ''
const dbName = process.env.MONGODB_DB || ''

const mongodbUrl = `mongodb://${host}:27017/${dbName}`;
const mongoClient = new MongoClient(mongodbUrl, {
  auth: { username: user, password: pass },
  authSource: 'admin',
  connectTimeoutMS: 10000,
});

const db = mongoClient.db();

export default db;
export { mongoClient };
