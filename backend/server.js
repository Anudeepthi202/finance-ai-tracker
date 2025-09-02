import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();
console.log("Private Key Loaded?", process.env.FIREBASE_PRIVATE_KEY ? "Yes" : "No");


const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);

// Start server with async MongoDB connection
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI); // connect to MongoDB
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Mongo Error:", err);
    process.exit(1); // stop server if DB fails
  }
}

startServer();
