import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ItemCard from "../components/ItemCard";

const Dashboard = () => {
  const location = useLocation();
  const walletAddress = location.state?.walletAddress; // Get wallet address from state
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // Store fetched items
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch items from the backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/listings"); // Adjust URL if needed
        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await response.json();
        setItems(data); // Update state with fetched items
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="flex">
      <Sidebar walletAddress={walletAddress} />
      <main className="flex-1 p-6">
        <h1 className="text-4xl font-bold">Offer, lend, borrow.</h1>
        <p className="text-gray-600 mt-2">
          Discover what you desire in a whole new way!
        </p>

        <div className="mt-6 flex space-x-3">
          <input
            type="text"
            placeholder="Search an item"
            className="border p-2 rounded-lg w-7/8"
          />
          <button className="border px-3 py-2 rounded-lg cursor-pointer border-primary text-primary">
            Search
          </button>
          <button
            className="border px-3 py-2 rounded-lg bg-primary hover:bg-hover text-white cursor-pointer"
            onClick={() => navigate("/add-item")}
          >
            Add Item
          </button>
        </div>

        {/* Loading & Error Handling */}
        {loading && <p className="text-center mt-4">Loading items...</p>}
        {error && <p className="text-center mt-4 text-red-500">{error}</p>}

        {/* Display Items */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {items.length > 0 ? (
            items.map((item) => <ItemCard key={item._id} item={item} />)
          ) : (
            <p className="text-center col-span-4">No items available</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
