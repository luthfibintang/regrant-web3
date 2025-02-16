// backend/routes/authRoutes.js
import express from "express";
import {
  connectWallet,
  disconnectWallet,
} from "../controllers/authController.js";

const router = express.Router();

// POST /auth/connect - Connect wallet and verify signature
router.post("/connect", connectWallet);

// POST /auth/disconnect - Disconnect wallet
router.post("/disconnect", disconnectWallet);

export default router;
