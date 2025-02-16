import { useState, useEffect } from "react";
import UploadImage from "../components/UploadImage";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AddItem = () => {
  const [userAddress, setUserAddress] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [rentalFee, setRentalFee] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch wallet address when the component mounts
  useEffect(() => {
    const fetchWalletAddress = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          setUserAddress(accounts.length > 0 ? accounts[0] : null);
        } catch (error) {
          console.error("Error fetching wallet address:", error);
        }
      }
    };
    fetchWalletAddress();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const listingData = {
      ownerAddress: userAddress,
      itemName,
      itemDescription,
      rentalFee,
      depositAmount,
      uploadedImages,
    };

    try {
      const response = await fetch("http://localhost:5000/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      });

      if (response.ok) {
        console.log("Listing created successfully!");
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create listing");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error submitting listing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar with Wallet Address */}
      <Sidebar walletAddress={userAddress} />

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">List an Item for Rent</h1>
        <p className="text-gray-600 mt-2">
          Share your item with others and earn rental income. Ensure the item is
          in good condition and provide accurate details.
        </p>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Upload Images Component */}
          <UploadImage onUpload={setUploadedImages} maxImages={5} />

          {/* Item Name */}
          <input
            type="text"
            placeholder="Item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="border p-2 rounded-lg w-full"
            required
          />

          {/* Item Description */}
          <textarea
            placeholder="Item Description"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            className="border p-2 rounded-lg w-full"
            rows="4"
            required
          ></textarea>

          {/* Rental Fee */}
          <input
            type="number"
            placeholder="Rental Fee (in ETH) per day"
            value={rentalFee}
            onChange={(e) => setRentalFee(e.target.value)}
            className="border p-2 rounded-lg w-full"
            required
          />

          {/* Deposit Amount */}
          <input
            type="number"
            placeholder="Deposit Amount (in ETH)"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="border p-2 rounded-lg w-full"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-primary hover:bg-hover active:bg-green-800 text-white px-6 py-3 rounded-lg w-full font-semibold"
            disabled={loading}
          >
            {loading ? "Submitting..." : "List Item for Rent"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddItem;
