import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const host = process.env.MONDODB_HOST || "";
    const user = process.env.MONGODB_USER || "";
    const pass = process.env.MONGODB_PASS || "";
    const dbName = process.env.MONGODB_DBNAME || "";

    const mongodbUrl = `mongodb://${host}:27017/${dbName}`;

    await mongoose.connect(mongodbUrl, {
      auth: { username: user, password: pass },
      authSource: "admin",
      connectTimeoutMS: 10000,
    });
    
    console.log("Connected de DB");
  } catch (error) {
    console.error("Failed to connect do DB", error);
    process.exit(1);
  }
};
