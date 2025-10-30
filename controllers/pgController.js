import PG from "../models/pgModel.js";

export const addPG = async (req, res) => {
  try {
    const pgData = req.body;
    const newPG = new PG(pgData);
    await newPG.save();
    res.status(201).json({ message: "PG added successfully", pg: newPG });
  } catch (error) {
    console.error("Error adding PG:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
