import express from "express";
import {
  createListing,
  getAllListings,
  getListingById,
} from "../controllers/listingController.js";

const router = express.Router();

router.post("/", createListing); // Create listing
router.get("/", getAllListings); // Get all listings
router.get("/:id", getListingById); // Get single listing

export default router;
