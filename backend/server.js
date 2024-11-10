// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require("./authRoutes");
app.use("/api/auth", authRoutes);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
mongoose.connect(process.env.MONGO_URI, clientOptions)
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(error => console.error("MongoDB connection error:", error));

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});