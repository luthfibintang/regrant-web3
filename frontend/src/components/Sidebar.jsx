import { FiMessageSquare, FiBookmark } from "react-icons/fi";
import { FaThLarge } from "react-icons/fa";
import { PiHandshakeThin } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ walletAddress }) => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    // Clear wallet address and redirect to home page
    navigate("/");
  };

  return (
    <aside className="w-64 h-screen bg-gray-100 p-5">
      <div className="text-2xl font-bold text-green-600 flex items-center mb-8">
        <img src="/regrant-logo.svg" alt="Regrant Logo" className="h-8 mr-2" />
        Regrant
      </div>

      <nav className="flex flex-col space-y-4">
        {/* Dashboard Navigation */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center space-x-2 p-2 bg-gray-200 rounded-lg w-full text-left cursor-pointer"
        >
          <FaThLarge />
          <span>Dashboard</span>
        </button>

        {/* Messages */}
        <button
          onClick={() => navigate("/messages")}
          className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg w-full text-left cursor-pointer"
        >
          <FiMessageSquare />
          <span>Messages</span>
        </button>

        {/* Deals Log */}
        <div className="flex flex-col">
          <button
            onClick={() => navigate("/deals")}
            className="flex items-center space-x-2 p-2 rounded-lg w-full text-left"
          >
            <PiHandshakeThin />
            <span className="text-gray-500">Deals Log</span>
          </button>
          <div className="ml-6 space-y-2">
            <button
              onClick={() => navigate("/my-requests")}
              className="block text-gray-600 hover:text-black w-full text-left cursor-pointer"
            >
              My Requests
            </button>
            <button
              onClick={() => navigate("/my-rent-item")}
              className="block text-gray-600 hover:text-black w-full text-left cursor-pointer"
            >
              My Rent Item
            </button>
          </div>
        </div>

        {/* Bookmarks */}
        <button
          onClick={() => navigate("/bookmarks")}
          className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-200 rounded-lg w-full text-left"
        >
          <FiBookmark />
          <span>Your Bookmarks</span>
        </button>
      </nav>

      {/* User Info */}
      <div className="mt-10 flex items-center space-x-2">
        <img
          src="/user-avatar.jpg"
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-semibold">
          {walletAddress ? walletAddress.slice(0, 10) + "..." : "Not connected"}
        </span>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
