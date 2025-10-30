import express from "express";
import jwt from "jsonwebtoken";
import PG from "../models/pgModel.js"; // use your model file
const router = express.Router();

// ✅ Static admin credentials
const ADMIN_EMAIL = "admin@pgfinder.com";
const ADMIN_PASSWORD = "123456"; // You can change it later

// 🟢 Admin Login API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, "adminsecret", { expiresIn: "2h" });
    return res.json({ success: true, token });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
});

// Middleware to check admin token
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    jwt.verify(token, "adminsecret");
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// 🟢 Fetch all vendors (PG owners) pending verification
router.get("/vendors", authenticateAdmin, async (req, res) => {
  try {
    const vendors = await PG.find();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendors", error });
  }
});

// 🟢 Fetch unverified PGs
router.get("/pgs/pending", authenticateAdmin, async (req, res) => {
  try {
    const pending = await PG.find({ verified: false });
    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending PGs", error });
  }
});

// 🟢 Verify a PG by ID
router.post("/pgs/:id/verify", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await PG.findByIdAndUpdate(
      id,
      { $set: { verified: true } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "PG not found" });
    res.json({ success: true, pg: updated });
  } catch (error) {
    res.status(500).json({ message: "Error verifying PG", error });
  }
});

export default router;
