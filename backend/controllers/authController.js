// backend/controllers/authController.js
import { verifyMessage } from "ethers";

// Function to verify the wallet signature
const verifySignature = (address, signature) => {
  try {
    const recoveredAddress = verifyMessage("Welcome to Regrant", signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
};

// Connect wallet endpoint
export const connectWallet = async (req, res) => {
  const { address, signature } = req.body;

  if (!address || !signature) {
    return res
      .status(400)
      .json({ success: false, message: "Address and signature are required" });
  }

  // Verify the signature
  if (verifySignature(address, signature)) {
    res.json({ success: true, address });
  } else {
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
};

// backend/controllers/authController.js
export const disconnectWallet = (req, res) => {
  try {
    res.json({ success: true, message: "Wallet disconnected successfully" });
  } catch (error) {
    console.error("Error disconnecting wallet:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to disconnect wallet" });
  }
};
