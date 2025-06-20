import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Send,
  X,
  MessageSquare,
  MoreHorizontal,
  Star,
  Calendar,
  Loader2,
} from "lucide-react";
import LetterModal from "../components/ui/LetterModal";
import ChatModal from "../components/ui/ChatModal";
import { useNavigate } from "react-router-dom";
import { lettersAPI } from "../services/api"; // Adjust import path as needed

const Inbox = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("received");
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  
  // API related states
  const [receivedLetters, setReceivedLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const tabs = [
    { id: "received", label: "THƯ ĐÃ NHẬN", color: "bg-blue-500" },
    { id: "notifications", label: "THÔNG BÁO", color: "bg-pink-500" },
    { id: "chat", label: "TRÒ CHUYỆN", color: "bg-purple-600" },
  ];

  // Static data for other tabs (notifications and chat)
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

  // Fetch received letters from API
  const fetchReceivedLetters = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await lettersAPI.getReceivedLetters({ page, limit });
      
      setReceivedLetters(response.data.letters);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total,
      });
    } catch (err) {
      console.error("Error fetching received letters:", err);
      setError("Không thể tải thư. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Load received letters when component mounts or when switching to received tab
  useEffect(() => {
    if (activeTab === "received") {
      fetchReceivedLetters();
    }
  }, [activeTab]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  // Transform API data to match component structure
  const transformLetterData = (apiLetter) => ({
    id: apiLetter._id,
    type: "received",
    title: `THƯ TỪ ${apiLetter.senderId?.username || "Người dùng"}`,
    preview: apiLetter.content?.substring(0, 50) + "..." || "Nội dung thư...",
    date: formatDate(apiLetter.sentAt || apiLetter.createdAt),
    senderColors: ["bg-pink-400", "bg-blue-400"], // Default colors
    fullContent: apiLetter.content,
    sender: apiLetter.senderId,
    sentAt: apiLetter.sentAt,
    createdAt: apiLetter.createdAt,
    // Add any other fields that might be useful
    status: apiLetter.status,
    adminReviewStatus: apiLetter.adminReviewStatus,
  });

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    setShowModal(true);
  };

  const handleLoadMore = () => {
    if (pagination.currentPage < pagination.totalPages) {
      fetchReceivedLetters(pagination.currentPage + 1);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const getNotificationNumber = (tabId) => {
    if (tabId === "received") return receivedLetters.length > 0 ? 1 : 0;
    if (tabId === "notifications") return 1;
    return 0;
  };

  const handleAcceptConnection = () => {
    setShowModal(false);
    // Navigation will be handled by LetterModal itself
  };

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-8" {...fadeInUp}>
          <h1 className="text-3xl font-bold text-cosmic-purple mb-8">
            HÒM THƯ
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
              {loading && (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-cosmic-purple" />
                  <span className="ml-2 text-cosmic-purple">Đang tải...</span>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <p className="text-red-400 mb-4">{error}</p>
                  <button
                    onClick={() => fetchReceivedLetters()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-300"
                  >
                    Thử lại
                  </button>
                </div>
              )}

              {!loading && !error && receivedLetters.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-cosmic-purple/70">
                    Bạn chưa có thư nào được nhận.
                  </p>
                </div>
              )}

              {!loading && !error && receivedLetters.length > 0 && (
                <>
                  {receivedLetters.map((apiLetter, index) => {
                    const letter = transformLetterData(apiLetter);
                    return (
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
                    );
                  })}

                  {/* Load More Button */}
                  {pagination.currentPage < pagination.totalPages && (
                    <div className="text-center py-4">
                      <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors duration-300 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                            Đang tải...
                          </>
                        ) : (
                          "Tải thêm"
                        )}
                      </button>
                    </div>
                  )}

                  {/* Pagination Info */}
                  <div className="text-center text-cosmic-purple/60 text-sm">
                    Hiển thị {receivedLetters.length} / {pagination.total} thư
                  </div>
                </>
              )}
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
        />
      )}

      {selectedChat && (
        <ChatModal chat={selectedChat} onClose={handleCloseChat} />
      )}
    </div>
  );
};

export default Inbox;