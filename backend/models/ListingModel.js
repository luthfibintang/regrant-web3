import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
  ownerAddress: { type: String, required: true }, // Wallet address
  itemName: { type: String, required: true },
  itemDescription: { type: String, required: true },
  rentalFee: { type: Number, required: true }, // ETH per day
  depositAmount: { type: Number, required: true }, // ETH
  uploadedImages: { type: [String], required: true }, // Array of image URLs
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Items", ListingSchema);
