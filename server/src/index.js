import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://mer-nchat.vercel.app",
            "https://mernchat-flax.vercel.app"
        ],
        credentials: true,
    })
);

// API Routes - THESE MUST COME BEFORE THE CATCH-ALL
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend in production if built locally, else serve API status
if (process.env.NODE_ENV === "production") {
    const clientDistPath = path.join(__dirname, "../../client/dist");
    if (fs.existsSync(clientDistPath)) {
        app.use(express.static(clientDistPath));
        app.get("*", (req, res) => {
            res.sendFile(path.join(clientDistPath, "index.html"));
        });
    } else {
        app.get("/", (req, res) => {
            res.json({ message: "MERN Chat API Server is running successfully." });
        });
    }
}

server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
});
