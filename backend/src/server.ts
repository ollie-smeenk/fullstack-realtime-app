import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import passport from "./auth.js";
import authRoutes from "./routes/authRoutes.js";
import { PrismaClient } from "@prisma/client";
import { createServer } from "http";
import { Server } from "socket.io";
import { startPolling } from "./sockets.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "http://localhost:3000", // optional
      "https://fullstack-realtime-app-ollie.vercel.app", // your Vercel frontend
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("🚀 Backend server is running!");
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

startPolling(io);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));

