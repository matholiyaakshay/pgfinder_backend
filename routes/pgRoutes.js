import express from "express";
import multer from "multer";
import path from "path";
import PG from "../models/pgModel.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Add new PG
router.post("/add", upload.array("images"), async (req, res) => {
  try {
    const {
      ownerName,
      email,
      password,
      phone,
      whatsapp,
      pgName,
      address,
      locationURL,
      city,
      area,
      rent,
      rentType,
      pgType,
      capacity,
      availableSeats,
      facilities,
      description,
    } = req.body;

    const newPG = new PG({
      ownerName,
      email,
      password,
      phone,
      whatsapp,
      pgName,
      address,
      locationURL,
      city,
      area,
      rent,
      rentType,
      pgType,
      capacity: JSON.parse(capacity || "[]"),
      availableSeats,
      facilities: JSON.parse(facilities || "[]"),
      description,
      images: req.files.map((file) => `/uploads/${file.filename}`),
      verified: false,
    });

    await newPG.save();
    res.status(201).json({ success: true, message: "PG added successfully!" });
  } catch (err) {
    console.error("❌ Error adding PG:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Get all PGs (only verified shown publicly)
router.get("/", async (req, res) => {
  try {
    const pgs = await PG.find({ verified: true });
    res.json(pgs);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Get single PG by ID
router.get("/:id", async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) {
      return res.status(404).json({ success: false, message: "PG not found" });
    }
    res.json(pg);
  } catch (err) {
    console.error("❌ Error fetching PG details:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
