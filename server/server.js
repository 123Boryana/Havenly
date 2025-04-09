import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import adRoutes from "./routes/ad.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// db
const DATABASE_URL = process.env.DATABASE || "mongodb://localhost:27017/havenly";
mongoose.set("strictQuery", false);
mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("db_connected"))
  .catch((err) => console.log("DB connection error:", err));

// middlewares
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (origin === "http://localhost:3000" || origin === "http://localhost:5173") {
      return callback(null, true);
    }

    if (origin.endsWith("boryanas-projects-1a330183.vercel.app")) {
      return callback(null, true);
    }

    
    console.log(`CORS error: Origin ${origin} not allowed`);
    return callback(new Error("Not allowed by CORS"));
  }
}));

// Root route to test the server
app.get("/", (req, res) => {
  console.log("Root route accessed");
  res.json({ message: "Backend is running!" });
});

// routes middleware
app.use("/api", authRoutes);
app.use("/api", adRoutes);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));