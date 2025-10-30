import PG from "../models/pgModel.js";

// ✅ Controller to update vendor details
export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedVendor = await PG.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({
      message: "✅ Vendor data updated successfully!",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error("Error updating vendor:", error);
    res.status(500).json({ message: "❌ Server error while updating vendor" });
  }
};
