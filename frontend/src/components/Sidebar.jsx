// src/components/Sidebar.jsx
import { FiMessageSquare, FiBookmark } from "react-icons/fi";
import { FaThLarge } from "react-icons/fa";
import { PiHandshakeThin } from "react-icons/pi";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-100 p-5">
      <div className="text-2xl font-bold text-green-600 flex items-center mb-8">
        <img src="/regrant-logo.svg" alt="Regrant Logo" className="h-8 mr-2" />
        Regrant
      </div>

      <nav className="flex flex-col space-y-4">
        <a
          href="#"
          className="flex items-center space-x-2 p-2 bg-gray-200 rounded-lg"
        >
          <FaThLarge />
          <span>Dashboard</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg"
        >
          <FiMessageSquare />
          <span>Messages</span>
        </a>
        <div className="flex flex-col">
          <a
            href="#"
            className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg"
          >
            <PiHandshakeThin />
            <span>Deals Log</span>
          </a>
          <div className="ml-6 space-y-2">
            <a href="#" className="block text-gray-600 hover:text-black">
              My Requests
            </a>
            <a href="#" className="block text-gray-600 hover:text-black">
              My Shares
            </a>
          </div>
        </div>
        <a
          href="#"
          className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-lg"
        >
          <FiBookmark />
          <span>Your Bookmarks</span>
        </a>
      </nav>

      <div className="mt-10 flex items-center space-x-2">
        <img
          src="/user-avatar.jpg"
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-semibold">
          Please make this a user address that is login
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
