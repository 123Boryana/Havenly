import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import { DATABASE } from "./config.js";
import authRoutes from "./routes/auth.js";
import adRoutes from "./routes/ad.js";

const app = express();

// db
mongoose.set("strictQuery", false);
mongoose
  .connect(DATABASE)
  .then(() => console.log("db_connected"))
  .catch((err) => console.log(err));

  app.get("/", (req, res) => {
    console.log("Root route accessed");
    res.json({ message: "Backend is running!" });
  });

// middlewares
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use(cors({
  origin: "https://havenly-git-main-boryana-projects-ta330183.vercel.app"
}));
// routes middleware
app.use("/api", authRoutes);
app.use("/api", adRoutes);

const PORT = process.env.PORT || 8000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));