// src/pages/Dashboard.jsx
import Sidebar from "../components/Sidebar";
import ItemCard from "../components/ItemCard";

const items = [
  {
    name: "Bor mini",
    distance: "100m",
    type: "Borrow",
    image: "/placeholder.jpg",
  },
  {
    name: "Solder",
    distance: "100m",
    type: "Borrow",
    image: "/placeholder.jpg",
  },
  {
    name: "Laptop stand",
    distance: "100m",
    type: "Gift",
    image: "/placeholder.jpg",
  },
  {
    name: "Gergaji tangan",
    distance: "500m",
    type: "Borrow",
    image: "/placeholder.jpg",
  },
];

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-4xl font-bold">Offer, lend, borrow.</h1>
        <p className="text-gray-600 mt-2">
          Discover what you desire in a whole new way!
        </p>

        <div className="mt-6 flex space-x-3">
          <input
            type="text"
            placeholder="Search an item"
            className="border p-2 rounded-lg w-1/3"
          />
          <button className="border px-3 py-2 rounded-lg">
            Item Label: All
          </button>
          <button className="border px-3 py-2 rounded-lg">Distance: All</button>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          {items.map((item, index) => (
            <ItemCard key={index} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
