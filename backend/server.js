require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const Session = require("./models/Session");
const World = require("./models/World");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// serve frontend (adjust path if needed)
app.use(express.static(path.join(__dirname, "..", "frontend")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// POST /api/session – save completed Pomodoro + update world
app.post("/api/session", async (req, res) => {
  try {
    const { duration, category } = req.body;

    const session = await Session.create({ duration, category });

    // simple world logic: 1 session = 1 tree, every 4 = 1 building, streak-ish = stars
    let world = await World.findOne();
    if (!world) world = await World.create({});

    world.trees += 1;

    if (world.trees % 4 === 0) {
      world.buildings += 1;
    }

    // very simple “star” rule: every 8 sessions
    const totalSessions = await Session.countDocuments();
    if (totalSessions % 8 === 0) {
      world.stars += 1;
    }

    await world.save();

    res.status(201).json({ session, world });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving session" });
  }
});

// GET /api/stats – data for dashboard charts
app.get("/api/stats", async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: 1 });

    // weekly counts (last 7 days)
    const now = new Date();
    const weekDays = [];
    const weekCounts = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);

      const dayLabel = day.toLocaleDateString("en-US", { weekday: "short" });
      weekDays.push(dayLabel);

      const start = new Date(day);
      start.setHours(0, 0, 0, 0);
      const end = new Date(day);
      end.setHours(23, 59, 59, 999);

      const count = sessions.filter(
        s => s.createdAt >= start && s.createdAt <= end
      ).length;

      weekCounts.push(count);
    }

    // category breakdown
    const categories = {};
    sessions.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + 1;
    });

    res.json({ weekDays, weekCounts, categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// GET /api/world – world state for gamified page
app.get("/api/world", async (req, res) => {
  try {
    let world = await World.findOne();
    if (!world) world = await World.create({});
    res.json(world);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching world" });
  }
});

// fallback to index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
