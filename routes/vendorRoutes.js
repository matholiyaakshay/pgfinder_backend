import express from "express";
import PG from "../models/pgModel.js";
import { updateVendor } from "../controllers/vendorController.js";

const router = express.Router();

// Vendor Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await PG.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (vendor.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

  if (!vendor.verified) {
    return res.status(403).json({ message: "Your profile is not verified yet. Please wait for admin approval." });
  }

    res.json({
      message: "Login successful",
      vendor,
    });
  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update/:id", updateVendor);

export default router;
