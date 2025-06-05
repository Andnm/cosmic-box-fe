import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Send,
  X,
  MessageSquare,
  MoreHorizontal,
  Star,
  Calendar,
} from "lucide-react";
import LetterModal from "../components/ui/LetterModal";
import ChatModal from "../components/ui/ChatModal";
import { useNavigate } from "react-router-dom";

const Inbox = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("received");
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const tabs = [
    { id: "received", label: "THƯ ĐÃ NHẬN", color: "bg-blue-500" },
    { id: "notifications", label: "THÔNG BÁO", color: "bg-pink-500" },
    { id: "chat", label: "TRÒ CHUYỆN", color: "bg-purple-600" },
  ];

  const letters = [
    {
      id: 1,
      type: "received",
      title: "CHATBOX 1",
      preview: "User1: Chào bạn",
      date: "01/09",
      senderColors: ["bg-pink-400", "bg-blue-400"],
    },
    {
      id: 2,
      type: "received",
      title: "CHATBOX 2",
      preview: "User1: Rất vui được làm quen với bạn",
      date: "09/03",
      senderColors: ["bg-pink-400", "bg-blue-400"],
    },
    {
      id: 3,
      type: "received",
      title: "CHATBOX 3",
      preview: "User1: Chào bạn",
      date: "08/02",
      senderColors: ["bg-pink-400", "bg-purple-600"],
    },
  ];

  const notifications = [
    {
      id: 1,
      date: "01/09/2026",
      message: "Một người dùng khác đã gửi yêu cầu kết nối với bạn.",
      hasActions: true,
    },
    {
      id: 2,
      date: "17/07/2026",
      message: "Yêu cầu kết nối của bạn đã được đồng ý.",
      hasActions: false,
    },
    {
      id: 3,
      date: "15/07/2026",
      message: "Yêu cầu kết nối của bạn bị từ chối.",
      hasActions: false,
    },
  ];

  const archiveLetters = [
    {
      id: 1,
      senderName: "Nguyễn Văn A",
      lastMessage: {
        text: "Bạn có khỏe không?",
        sender: "them",
        time: "10:30 AM",
      },
      lastMessageTime: "10:30 AM",
      unreadCount: 2,
      isOnline: true,
      date: "05/06/2025",
    },
  ];

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    setShowModal(true);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const getNotificationNumber = (tabId) => {
    if (tabId === "received") return 1;
    if (tabId === "notifications") return 1;
    return 0;
  };

  const handleAcceptConnection = () => {
    setShowModal(false);
    navigate("/connect-payment");
  };

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  // Thêm hàm đóng modal chat
  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-8" {...fadeInUp}>
          <h1 className="text-3xl font-bold text-cosmic-purple mb-8">
            HỘP THƯ
          </h1>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-wrap justify-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-t-2xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? `${tab.color} text-white shadow-lg`
                    : "bg-white/10 text-cosmic-purple hover:bg-white/20"
                }`}
              >
                {getNotificationNumber(tab.id) > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {getNotificationNumber(tab.id)}
                    </span>
                  </div>
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 min-h-[600px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {activeTab === "received" && (
            <div className="space-y-4">
              {letters.map((letter, index) => (
                <motion.div
                  key={letter.id}
                  className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30 cursor-pointer hover:bg-white/30 transition-all duration-300"
                  onClick={() => handleLetterClick(letter)}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        {letter.senderColors.map((color, idx) => (
                          <div
                            key={idx}
                            className={`w-8 h-8 ${color} rounded-full`}
                          >
                            <Star className="w-full h-full p-1 text-white" />
                          </div>
                        ))}
                      </div>
                      <div>
                        <h3 className="font-semibold text-cosmic-purple">
                          {letter.title}
                        </h3>
                        <p className="text-cosmic-purple/70 text-sm">
                          {letter.preview}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-cosmic-purple/60 text-sm">
                        {letter.date}
                      </span>
                      <MoreHorizontal
                        className="text-cosmic-purple/50"
                        size={20}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="text-cosmic-purple" size={16} />
                        <span className="text-cosmic-purple/70 text-sm">
                          {notification.date}
                        </span>
                      </div>
                      <p className="text-cosmic-purple">
                        {notification.message}
                      </p>
                    </div>
                    {notification.hasActions && (
                      <div className="flex space-x-2 ml-4">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm transition-colors duration-300">
                          Chấp nhận
                        </button>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm transition-colors duration-300">
                          Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "chat" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archiveLetters.map((letter, index) => (
                <motion.div
                  key={letter.id}
                  className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 aspect-[4/3] p-6 cursor-pointer hover:bg-white/30 transition-all duration-300 relative group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Nút 3 chấm */}
                  <div className="absolute top-3 right-3 opacity-100 transition-opacity">
                    <div className="relative">
                      <button
                        className="p-1 rounded-full hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMenu(
                            selectedMenu === letter.id ? null : letter.id
                          );
                        }}
                      >
                        <MoreHorizontal className="text-white/70" size={20} />
                      </button>

                      {/* Dropdown menu */}
                      {selectedMenu === letter.id && (
                        <motion.div
                          className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg z-10 border border-white/10"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <div className="py-1">
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Xử lý xóa trò chuyện
                                console.log("Xóa trò chuyện", letter.id);
                                setSelectedMenu(null);
                              }}
                            >
                              <span>Xóa trò chuyện</span>
                            </button>
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Xử lý tắt thông báo
                                console.log("Tắt thông báo", letter.id);
                                setSelectedMenu(null);
                              }}
                            >
                              <span>Tắt thông báo</span>
                            </button>
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Xử lý báo cáo người dùng
                                console.log("Báo cáo người dùng", letter.id);
                                setSelectedMenu(null);
                              }}
                            >
                              <span>Báo cáo người dùng</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Nội dung chat */}
                  <div
                    className="h-full flex flex-col justify-between"
                    onClick={() =>
                      handleChatClick({
                        id: letter.id,
                        title: `CHATBOX ${letter.id}`,
                        date: letter.date,
                      })
                    }
                  >
                    {/* Phần trên: Avatar và tên */}
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {letter.senderName?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">
                          {letter.senderName || `Người dùng ${letter.id}`}
                        </p>
                        <p className="text-sm text-white/60">
                          {letter.lastMessageTime || letter.date}
                        </p>
                      </div>
                    </div>

                    {/* Phần giữa: Tin nhắn mới nhất */}
                    <div className="flex-1 my-3 overflow-hidden">
                      <div className="bg-white/10 rounded-lg p-3 h-full">
                        <p className="text-white/80 text-sm line-clamp-3">
                          {letter.lastMessage ? (
                            <>
                              <span className="font-medium text-white/90">
                                {letter.lastMessage.sender === "me"
                                  ? "Bạn: "
                                  : `${
                                      letter.senderName?.split(" ")[0] ||
                                      "Người dùng"
                                    }: `}
                              </span>
                              {letter.lastMessage.text}
                            </>
                          ) : (
                            "Chưa có tin nhắn nào"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Phần dưới: Thông tin phụ */}
                    <div className="flex justify-between items-center">
                      <p className="text-cosmic-purple/70 text-xs">
                        {letter.unreadCount > 0 ? (
                          <span className="bg-red-500 text-white rounded-full px-2 py-1">
                            {letter.unreadCount} tin nhắn mới
                          </span>
                        ) : (
                          letter.date
                        )}
                      </p>
                      {letter.isOnline && (
                        <span className="flex items-center text-xs text-green-400">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                          Online
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {showModal && selectedLetter && (
        <LetterModal
          letter={selectedLetter}
          onClose={() => setShowModal(false)}
          onAccept={handleAcceptConnection}
        />
      )}

      {selectedChat && (
        <ChatModal chat={selectedChat} onClose={handleCloseChat} />
      )}
    </div>
  );
};

export default Inbox;
