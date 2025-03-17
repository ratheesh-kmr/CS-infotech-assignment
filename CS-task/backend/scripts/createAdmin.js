require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("../models/admin"); //  Admin model 

// database connection

const MONGO_URI = "mongodb://127.0.0.1:27017/projectdb";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createAdmin = async () => {
  try {
    // To Ensure MongoDB connection 
    await mongoose.connection.asPromise();

    const hashedPassword = await bcrypt.hash("ROMANRATHEESHrk5", 10);

    const adminExists = await Admin.findOne({ email: "ratheeshkmr2024@gmail.com" });
    if (adminExists) {
      console.log("Admin already exists");
    } else {
      const admin = new Admin({ email: "ratheeshkmr2024@gmail.com", password: hashedPassword });
      await admin.save();
      console.log("Admin created successfully");
    }
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

createAdmin();
