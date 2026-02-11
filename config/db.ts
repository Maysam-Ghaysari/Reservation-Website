import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("لطفاً متغیر MONGO_URL را در فایل .env تعریف کنید.");
}

const connectToDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log("DB already connected ✅");
      return mongoose.connections[0].db;
    }

    const conn = await mongoose.connect(MONGO_URL);
    console.log("Connect to DB successfully ✅");
    return conn.connection.db;
  } catch (err) {
    console.error("DB connection error ❌", err);
    throw err;
  }
};

export default connectToDB;
