import mongoose from "mongoose";

const pgSchema = new mongoose.Schema(
  {
    ownerName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    pgName: { type: String, required: true },
    address: { type: String, required: true },
    locationURL: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    rent: { type: String, required: true },
    rentType: { type: String, required: true },
    pgType: { type: String, required: true },
    capacity: { type: [String], required: true },
    availableSeats: { type: Number, required: true },
    facilities: { type: [String], required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PG = mongoose.model("PG", pgSchema);
export default PG;
