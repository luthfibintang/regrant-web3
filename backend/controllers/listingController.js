import Listing from "../models/ListingModel.js";

// Create a new listing
export const createListing = async (req, res) => {
  try {
    const {
      ownerAddress,
      itemName,
      itemDescription,
      rentalFee,
      depositAmount,
      uploadedImages,
    } = req.body;

    const newListing = new Listing({
      ownerAddress,
      itemName,
      itemDescription,
      rentalFee,
      depositAmount,
      uploadedImages,
    });

    await newListing.save();
    res
      .status(201)
      .json({ message: "Listing created successfully", newListing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all listings
export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get listing by ID
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
