require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
app.use(express.json());
app.use(cors());
connectDB();

// ROUTES
const uploadRoutes = require("./routes/uploadRoutes");
const fileRoutes = require("./routes/fileRoutes")
const agentRoutes = require("./routes/agentRoutes");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/adminRoutes")
const Record = require('./models/record');  

//API END POINTS

app.use("/api/auth", authRoutes);
app.use("/agents", agentRoutes);
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files
app.use("/api", uploadRoutes); // Register file upload API
app.use("/api", fileRoutes);
app.use('/api/admin', adminRoutes); 
app.delete('/api/records', async (req, res) => {
  try {
    await Record.deleteMany({});
    res.json({ message: 'All records cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get("/", (req, res) => {
  res.send("API Running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

