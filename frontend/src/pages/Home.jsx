// src/pages/Home.jsx
import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import regrantlogo from "/regrant-logo.svg";

const Home = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or another web3 wallet.");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Message to sign
      const message = "Welcome to Regrant";
      const signature = await signer.signMessage(message);

      // Send the signed message to the backend
      const response = await axios.post("http://localhost:5000/auth/connect", {
        address,
        signature,
      });

      if (response.data.success) {
        setWalletAddress(address); // Successfully authenticated
        navigate("/dashboard", { state: { walletAddress: address } }); // Pass wallet address to Dashboard
      } else {
        alert("Authentication failed");
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="flex flex-col items-center">
        <img src={regrantlogo} className="h-28 m-5" alt="Regrant Logo" />
        <h1 className="text-2xl font-semibold m-3">
          Connect to Wallet to Use <span className="text-primary">Regrant</span>
        </h1>

        {walletAddress ? (
          <p className="text-lg text-green-500">Connected: {walletAddress}</p>
        ) : (
          <button
            className="bg-primary px-4 py-2 rounded-lg text-white cursor-pointer hover:bg-hover font-semibold"
            onClick={connectWallet}
            disabled={loading}
          >
            {loading ? "Connecting..." : "Connect to Wallet"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
