require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("../models/admin"); // Admin model

// Database connection
const MONGO_URI = "mongodb://127.0.0.1:27017/projectdb";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createAdmin = async () => {
  try {
    // Ensure MongoDB connection
    await mongoose.connection.asPromise();

    const hashedPassword = await bcrypt.hash("ratheesh", 10);

    const adminExists = await Admin.findOne({ email: "ratheeshkmr2020@gmail.com" });
    if (adminExists) {
      console.log("Admin already exists");
    } else {
      const admin = new Admin({
        name: "Ratheesh kumar",
        email: "ratheeshkmr2020@gmail.com",
        password: hashedPassword,
        role: "Super Admin",
        contact: "+91 9597970123",
        joinedDate: new Date().toISOString().split('T')[0], // Current Date in YYYY-MM-DD
      });

      await admin.save();
      console.log("Admin created successfully with additional details.");
    }
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

createAdmin();
