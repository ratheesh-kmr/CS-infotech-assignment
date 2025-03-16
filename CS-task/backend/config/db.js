const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/projectdb", {  
      useNewUrlParser: true,  
      useUnifiedTopology: true  
    });
    console.log("✅ MongoDB Connected to projectdb Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
