import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, LogOut, Settings, Menu, X } from "lucide-react";
import logoCosmicBox from "../../assets/images/logo-cosmic.png";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { path: "/write", label: "VIẾT THƯ", active: "write" },
    { path: "/inbox", label: "HÒM THƯ", active: "inbox" },
    { path: "/archive", label: "LƯU TRỮ", active: "archive" },
  ];

  const getActiveTab = () => {
    if (location.pathname.includes("write")) return "write";
    if (location.pathname.includes("inbox")) return "inbox";
    if (location.pathname.includes("archive")) return "archive";
    return "";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setShowNotifications(false);

    switch (notification.relatedType) {
      case "letter":
        navigate("/inbox");
        break;
      case "connection_request":
        navigate("/connections");
        break;
      case "conversation":
        navigate("/chat");
        break;
      default:
        break;
    }
  };

  if (!isAuthenticated) {
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
            <span className="text-white font-bold text-xl hidden sm:block">
              CosmicBox
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/auth"
              className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full hover:bg-white/20 transition-all duration-300"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-br from-blue-800 via-purple-800 to-fuchsia-800 text-white py-4 px-6 relative overflow-visible">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/" className="relative flex items-center space-x-2">
          <div className="relative">
            <img
              src={logoCosmicBox}
              alt="CosmicBox Logo"
              className="w-14 h-14 rounded-full object-cover"
            />
          </div>
          <span className="text-white font-bold text-xl hidden sm:block">
            CosmicBox
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex bg-white/10 backdrop-blur-sm rounded-full p-1">
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

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.div>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className="absolute right-0 top-12 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 z-[999] overflow-hidden"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    maxHeight: "400px",
                    transform: "translateX(-50%)",
                    right: "50%",
                  }}
                >
                  <div className="p-4 border-b border-cosmic-purple/20">
                    <h3 className="font-semibold text-cosmic-purple">
                      Thông báo
                    </h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-cosmic-purple/60">
                        Không có thông báo nào
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-cosmic-purple/10 cursor-pointer hover:bg-cosmic-purple/5 transition-colors ${
                            !notification.isRead ? "bg-blue-50/50" : ""
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                !notification.isRead
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-cosmic-purple text-sm truncate">
                                {notification.title}
                              </h4>
                              <p className="text-cosmic-purple/70 text-xs mt-1 line-clamp-2">
                                {notification.content}
                              </p>
                              <span className="text-cosmic-purple/50 text-xs">
                                {new Date(
                                  notification.timestamp
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 5 && (
                    <div className="p-3 text-center border-t border-cosmic-purple/20">
                      <button
                        className="text-cosmic-purple text-sm font-medium hover:underline"
                        onClick={() => setShowNotifications(false)}
                      >
                        Xem tất cả thông báo
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            >
              <User size={20} />
              <span className="text-sm font-medium">{user?.username}</span>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  className="absolute right-0 top-12 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 z-50 overflow-hidden"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-2">
                    {/* <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-cosmic-purple/10 transition-colors text-cosmic-purple"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} />
                      <span>Trang cá nhân</span>
                    </Link> */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-red-600"
                    >
                      <LogOut size={16} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-white/30 z-40"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 rounded-xl transition-colors ${
                    getActiveTab() === item.active
                      ? "bg-cosmic-purple text-white"
                      : "text-cosmic-purple hover:bg-cosmic-purple/10"
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-cosmic-purple/20 pt-2 mt-4">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-cosmic-purple font-medium truncate">
                    {user?.username}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        setShowMobileMenu(false);
                      }}
                      className="relative p-2 rounded-full bg-cosmic-purple/10 text-cosmic-purple"
                    >
                      <Bell size={16} />
                      {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </div>
                      )}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-full bg-red-100 text-red-600"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close dropdowns when clicking outside */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
