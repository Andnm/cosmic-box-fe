import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logoCosmicBox from "../../assets/images/logo-cosmic.png";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: "/write", label: "VIẾT THƯ", active: "write" },
    { path: "/inbox", label: "HỘP THƯ", active: "inbox" },
    { path: "/archive", label: "LƯU TRỮ", active: "archive" },
  ];

  const getActiveTab = () => {
    if (location.pathname.includes("write")) return "write";
    if (location.pathname.includes("inbox")) return "inbox";
    if (location.pathname.includes("archive")) return "archive";
    return "";
  };

  return (
    <header className="bg-gradient-to-br from-blue-800 via-purple-800 to-fuchsia-800 text-white py-4 px-6 relative overflow-hidden">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/" className="relative flex items-center space-x-2">
          <div className="relative">
            <img
              src={logoCosmicBox}
              alt="CosmicBox Logo"
              className="w-14 h-14 rounded-full object-cover"
            />
          </div>
          <span className="text-white font-bold text-xl hidden sm:block absolute top-5 left-14">
            CosmicBox
          </span>
        </Link>

        <nav className="flex bg-white/10 backdrop-blur-sm rounded-full p-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative px-4 py-2 text-sm font-medium transition-all duration-300"
            >
              {getActiveTab() === item.active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 ${
                  getActiveTab() === item.active
                    ? "text-cosmic-purple"
                    : "text-white"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
