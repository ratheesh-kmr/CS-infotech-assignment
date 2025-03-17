require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Function to generate a permanent token
const generateToken = () => {
  const payload = { app: "MyFullApplication", role: "admin" }; // Customize this payload

  // Generate a token WITHOUT expiry
  const token = jwt.sign(payload, process.env.JWT_SECRET);

  console.log("✅ Permanent JWT Token Generated:");
  console.log(token);

  // Optional: Save the token to a file for future use
  const filePath = path.join(__dirname, "permanentToken.txt");
  fs.writeFileSync(filePath, token);

  console.log(`🔐 Token saved to: ${filePath}`);
};

generateToken();
