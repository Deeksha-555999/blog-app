const mongoose = require("mongoose");


const MONGO_URI = "mongodb+srv://deeksha:deeksha1234@deeksha.l1epqsn.mongodb.net/?appName=deeksha";

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  
  }
}

module.exports = connectDB;