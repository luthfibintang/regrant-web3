// src/components/Card.jsx
import { FiMapPin } from "react-icons/fi";
import { FaGift } from "react-icons/fa";

const Card = ({ item }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-32 object-cover rounded-md mb-3"
      />
      <h3 className="text-lg font-semibold">{item.name}</h3>
      <div className="flex items-center text-gray-600 text-sm">
        <FiMapPin className="mr-1" />
        {item.distance}
      </div>
      <span
        className={`text-sm font-semibold ${
          item.type === "Gift" ? "text-green-600" : "text-blue-600"
        }`}
      >
        {item.type === "Gift" ? <FaGift className="inline mr-1" /> : "🔄"}{" "}
        {item.type}
      </span>
    </div>
  );
};

export default Card;
