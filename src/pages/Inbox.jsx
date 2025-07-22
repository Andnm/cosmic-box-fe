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
import RejectionModal from "../components/ui/RejectionModal";
import { useNavigate } from "react-router-dom";
import {
  lettersAPI,
  notificationsAPI,
  connectionsAPI,
  chatAPI,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const Inbox = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("received");
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [pendingRejection, setPendingRejection] = useState(null);

  // API related states
  const [receivedLetters, setReceivedLetters] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notificationsError, setNotificationsError] = useState(null);
  const [chatError, setChatError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });
  const [notificationsPagination, setNotificationsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const tabs = [
    { id: "received", label: "THƯ ĐÃ NHẬN", color: "bg-blue-500" },
    { id: "notifications", label: "THÔNG BÁO", color: "bg-pink-500" },
    { id: "chat", label: "TRÒ CHUYỆN", color: "bg-purple-600" },
  ];


  // Fetch conversations from API
  const fetchConversations = async () => {
    try {
      setChatLoading(true);
      setChatError(null);

      const response = await chatAPI.getConversations();
      setConversations(response.data.conversations || response.data);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setChatError("Không thể tải cuộc trò chuyện. Vui lòng thử lại sau.");
    } finally {
      setChatLoading(false);
    }
  };

  // Fetch notifications from API
  const fetchNotifications = async (page = 1, limit = 10) => {
    try {
      setNotificationsLoading(true);
      setNotificationsError(null);

      const response = await notificationsAPI.getAll({ page, limit });

      setNotifications(response.data.notifications || response.data);
      setNotificationsPagination({
        currentPage: response.data.currentPage || page,
        totalPages: response.data.totalPages || 1,
        total: response.data.total || response.data.length,
      });
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotificationsError("Không thể tải thông báo. Vui lòng thử lại sau.");
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Fetch connection requests to check status
  const fetchConnectionRequests = async () => {
    try {
      const response = await connectionsAPI.getMyRequests({ type: "received" });
      setConnectionRequests(response.data.requests || response.data);
    } catch (err) {
      console.error("Error fetching connection requests:", err);
    }
  };

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

  // Load data when component mounts or when switching tabs
  useEffect(() => {
    if (activeTab === "received") {
      fetchReceivedLetters();
    } else if (activeTab === "notifications") {
      fetchNotifications();
      fetchConnectionRequests(); // Also fetch connection requests to check status
    } else if (activeTab === "chat") {
      fetchConversations();
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

  // Transform notification data for display
  const transformNotificationData = (apiNotification) => {
    // Check if this is a connection request notification
    const isConnectionRequest =
      apiNotification.type === "connection_request" &&
      apiNotification.relatedType === "connection_request";

    // Find the related connection request to check its status
    const relatedRequest = isConnectionRequest
      ? connectionRequests.find((req) => req._id === apiNotification.relatedId)
      : null;

    // Show actions only if it's a connection request with pending status
    const hasActions =
      isConnectionRequest &&
      relatedRequest &&
      relatedRequest.status === "pending" &&
      relatedRequest.isPaid === true;

    // Use connection request message if available and it's a connection request
    let displayMessage = apiNotification.content || apiNotification.title;
    if (apiNotification.connectionRequest) {
      if (apiNotification.type === "connection_request") {
        displayMessage = apiNotification.connectionRequest.message;
      } else if (
        apiNotification.type === "request_rejected" &&
        apiNotification.connectionRequest.rejectionReason
      ) {
        displayMessage = `Lý do từ chối: ${apiNotification.connectionRequest.rejectionReason}`;
      }
    }

    return {
      id: apiNotification._id,
      date: formatDisplayDate(apiNotification.createdAt),
      title: apiNotification.title,
      message: displayMessage,
      type: apiNotification.type,
      isRead: apiNotification.isRead,
      relatedId: apiNotification.relatedId,
      relatedType: apiNotification.relatedType,
      hasActions,
      createdAt: apiNotification.createdAt,
      connectionRequestStatus: relatedRequest?.status || null,
      connectionRequest: apiNotification.connectionRequest,
    };
  };

  // Format date for notifications (more detailed)
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Transform API data to match component structure
  const transformLetterData = (apiLetter) => ({
    id: apiLetter._id,
    type: "received",
    title: `THƯ TỪ người nào đó`,
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

  const handleLoadMoreNotifications = () => {
    if (
      notificationsPagination.currentPage < notificationsPagination.totalPages
    ) {
      fetchNotifications(notificationsPagination.currentPage + 1);
    }
  };

  // Handle notification actions
  const handleNotificationAction = async (
    notificationId,
    relatedId,
    action
  ) => {
    try {
      if (action === "reject") {
        // Show rejection modal instead of direct rejection
        const notification = notifications.find((n) => n.id === notificationId);
        const senderName =
          "Ai đó";

        setPendingRejection({ notificationId, relatedId, senderName });
        setShowRejectionModal(true);
        return;
      }

      // Handle accept directly
      await connectionsAPI.respondToRequest(relatedId, { status: "accepted" });

      // Mark notification as read
      await notificationsAPI.markAsRead(notificationId);

      // Refresh both notifications and connection requests
      await Promise.all([fetchNotifications(), fetchConnectionRequests()]);

      console.log("Đã chấp nhận yêu cầu kết nối thành công");
    } catch (error) {
      console.error("Error handling notification action:", error);
      const errorMessage =
        error.response?.data?.error || "Không thể xử lý yêu cầu";
      alert(errorMessage);
    }
  };

  // Handle rejection with reason
  const handleRejectionConfirm = async (rejectionReason) => {
    try {
      const { notificationId, relatedId } = pendingRejection;

      await connectionsAPI.respondToRequest(relatedId, {
        status: "rejected",
        rejectionReason,
      });

      // Mark notification as read
      await notificationsAPI.markAsRead(notificationId);

      // Refresh both notifications and connection requests
      await Promise.all([fetchNotifications(), fetchConnectionRequests()]);

      console.log("Đã từ chối yêu cầu kết nối thành công");
    } catch (error) {
      console.error("Error rejecting request:", error);
      const errorMessage =
        error.response?.data?.error || "Không thể từ chối yêu cầu";
      alert(errorMessage);
      throw error; // Re-throw to let modal handle it
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const getNotificationNumber = (tabId) => {
    if (tabId === "received")
      return receivedLetters.length > 0 ? receivedLetters.length : 0;
    if (tabId === "notifications") {
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      return unreadCount > 0 ? unreadCount : 0;
    }
    if (tabId === "chat") {
      const unreadCount = conversations.reduce(
        (total, conv) => total + conv.unreadCount,
        0
      );
      return unreadCount > 0 ? unreadCount : 0;
    }
    return 0;
  };

  const transformConversationData = (apiConversation) => {
    // Find the other participant (not current user)
    const otherParticipant = apiConversation.participants?.find(
      (p) => p.userId._id !== currentUserId // You'll need to get current user ID
    );

    // Calculate unread count from last message
    const unreadCount =
      apiConversation.lastMessage?.isRead === false &&
        apiConversation.lastMessage?.senderId !== currentUserId
        ? 1
        : 0;

    return {
      id: apiConversation._id,
      conversationId: apiConversation._id,
      senderName: "Ai đó",
      chatboxName: apiConversation.chatboxName,
      lastMessage: apiConversation.lastMessage
        ? {
          text: apiConversation.lastMessage.content,
          sender:
            apiConversation.lastMessage.senderId._id === currentUserId
              ? "me"
              : "they",
          time: formatTime(apiConversation.lastMessage.createdAt),
          isRead: apiConversation.lastMessage.isRead,
        }
        : null,
      lastMessageTime: apiConversation.lastMessage
        ? formatTime(apiConversation.lastMessage.createdAt)
        : formatTime(apiConversation.createdAt),
      unreadCount,
      isOnline: false, // You can implement online status later
      date: formatDate(apiConversation.updatedAt),
      participants: apiConversation.participants,
      requestId: apiConversation.requestId,
      isActive: apiConversation.isActive,
    };
  };

  // Format time for chat messages
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get current user ID (you'll need to implement this based on your auth system)
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {

    setCurrentUserId(user?._id);
  }, []);

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
                className={`relative px-6 py-3 rounded-t-2xl font-medium transition-all duration-300 ${activeTab === tab.id
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
              {notificationsLoading && (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-cosmic-purple" />
                  <span className="ml-2 text-cosmic-purple">
                    Đang tải thông báo...
                  </span>
                </div>
              )}

              {notificationsError && (
                <div className="text-center py-8">
                  <p className="text-red-400 mb-4">{notificationsError}</p>
                  <button
                    onClick={() => fetchNotifications()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-300"
                  >
                    Thử lại
                  </button>
                </div>
              )}

              {!notificationsLoading &&
                !notificationsError &&
                notifications.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-cosmic-purple/70">
                      Bạn chưa có thông báo nào.
                    </p>
                  </div>
                )}

              {!notificationsLoading &&
                !notificationsError &&
                notifications.length > 0 && (
                  <>
                    {notifications.map((apiNotification, index) => {
                      const notification =
                        transformNotificationData(apiNotification);
                      return (
                        <motion.div
                          key={notification.id}
                          className={`bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30 cursor-pointer hover:bg-white/30 transition-all duration-300 ${!notification.isRead
                              ? "ring-2 ring-blue-400/50"
                              : ""
                            }`}
                          onClick={() =>
                            !notification.isRead &&
                            handleMarkAsRead(notification.id)
                          }
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Calendar
                                  className="text-cosmic-purple"
                                  size={16}
                                />
                                <span className="text-cosmic-purple/70 text-sm">
                                  {notification.date}
                                </span>
                                {!notification.isRead && (
                                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                    Mới
                                  </span>
                                )}
                              </div>
                              <h4 className="font-semibold text-cosmic-purple mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-cosmic-purple/80">
                                {notification.message}
                              </p>

                              {/* Show connection request status if available */}
                              {notification.connectionRequestStatus &&
                                notification.type === "connection_request" && (
                                  <div className="mt-2">
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${notification.connectionRequestStatus ===
                                          "accepted"
                                          ? "bg-green-100 text-green-700"
                                          : notification.connectionRequestStatus ===
                                            "rejected"
                                            ? "bg-red-100 text-red-700"
                                            : notification.connectionRequestStatus ===
                                              "pending"
                                              ? "bg-yellow-100 text-yellow-700"
                                              : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                      {notification.connectionRequestStatus ===
                                        "accepted"
                                        ? "Đã chấp nhận"
                                        : notification.connectionRequestStatus ===
                                          "rejected"
                                          ? "Đã từ chối"
                                          : notification.connectionRequestStatus ===
                                            "pending"
                                            ? "Đang chờ phản hồi"
                                            : notification.connectionRequestStatus}
                                    </span>
                                  </div>
                                )}

                              {/* Show notification type badge */}
                              {!notification.connectionRequestStatus && (
                                <div className="mt-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${notification.type === "connection_request"
                                        ? "bg-green-100 text-green-700"
                                        : notification.type ===
                                          "request_accepted"
                                          ? "bg-blue-100 text-blue-700"
                                          : notification.type ===
                                            "request_rejected"
                                            ? "bg-red-100 text-red-700"
                                            : notification.type === "new_letter"
                                              ? "bg-purple-100 text-purple-700"
                                              : "bg-gray-100 text-gray-700"
                                      }`}
                                  >
                                    {notification.type === "connection_request"
                                      ? "Yêu cầu kết nối"
                                      : notification.type === "request_accepted"
                                        ? "Chấp nhận kết nối"
                                        : notification.type === "request_rejected"
                                          ? "Từ chối kết nối"
                                          : notification.type === "new_letter"
                                            ? "Thư mới"
                                            : notification.type === "new_message"
                                              ? "Tin nhắn mới"
                                              : notification.type === "letter_approved"
                                                ? "Thư được duyệt"
                                                : notification.type === "letter_rejected"
                                                  ? "Thư bị từ chối"
                                                  : "Thông báo"}
                                  </span>
                                </div>
                              )}
                            </div>
                            {notification.hasActions && (
                              <div className="flex space-x-2 ml-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNotificationAction(
                                      notification.id,
                                      notification.relatedId,
                                      "accept"
                                    );
                                  }}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm transition-colors duration-300 disabled:opacity-50"
                                  disabled={notificationsLoading}
                                >
                                  Chấp nhận
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNotificationAction(
                                      notification.id,
                                      notification.relatedId,
                                      "reject"
                                    );
                                  }}
                                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm transition-colors duration-300 disabled:opacity-50"
                                  disabled={notificationsLoading}
                                >
                                  Từ chối
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Load More Notifications Button */}
                    {notificationsPagination.currentPage <
                      notificationsPagination.totalPages && (
                        <div className="text-center py-4">
                          <button
                            onClick={handleLoadMoreNotifications}
                            disabled={notificationsLoading}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors duration-300 disabled:opacity-50"
                          >
                            {notificationsLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                                Đang tải...
                              </>
                            ) : (
                              "Tải thêm thông báo"
                            )}
                          </button>
                        </div>
                      )}

                    {/* Mark all as read button */}
                    {notifications.some((n) => !n.isRead) && (
                      <div className="text-center py-4">
                        <button
                          onClick={async () => {
                            try {
                              await notificationsAPI.markAllAsRead();
                              // Refresh notifications to get updated data
                              await fetchNotifications();
                            } catch (error) {
                              console.error(
                                "Error marking all as read:",
                                error
                              );
                            }
                          }}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full transition-colors duration-300 text-sm disabled:opacity-50"
                          disabled={notificationsLoading}
                        >
                          Đánh dấu tất cả đã đọc
                        </button>
                      </div>
                    )}

                    {/* Pagination Info */}
                    <div className="text-center text-cosmic-purple/60 text-sm">
                      Hiển thị {notifications.length} /{" "}
                      {notificationsPagination.total} thông báo
                    </div>
                  </>
                )}
            </div>
          )}

          {activeTab === "chat" && (
            <div className="space-y-4">
              {chatLoading && (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-cosmic-purple" />
                  <span className="ml-2 text-cosmic-purple">
                    Đang tải cuộc trò chuyện...
                  </span>
                </div>
              )}

              {chatError && (
                <div className="text-center py-8">
                  <p className="text-red-400 mb-4">{chatError}</p>
                  <button
                    onClick={() => fetchConversations()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-300"
                  >
                    Thử lại
                  </button>
                </div>
              )}

              {!chatLoading && !chatError && conversations.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-cosmic-purple/70">
                    Bạn chưa có cuộc trò chuyện nào.
                  </p>
                </div>
              )}

              {!chatLoading && !chatError && conversations.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {conversations.map((apiConversation, index) => {
                    const conversation =
                      transformConversationData(apiConversation);
                    return (
                      <motion.div
                        key={conversation.id}
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
                                  selectedMenu === conversation.id
                                    ? null
                                    : conversation.id
                                );
                              }}
                            >
                              <MoreHorizontal
                                className="text-white/70"
                                size={20}
                              />
                            </button>

                            {selectedMenu === conversation.id && (
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
                                      console.log(
                                        "Xóa trò chuyện",
                                        conversation.id
                                      );
                                      setSelectedMenu(null);
                                    }}
                                  >
                                    <span>Xóa trò chuyện</span>
                                  </button>
                                  <button
                                    className="flex items-center w-full px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log(
                                        "Tắt thông báo",
                                        conversation.id
                                      );
                                      setSelectedMenu(null);
                                    }}
                                  >
                                    <span>Tắt thông báo</span>
                                  </button>
                                  <button
                                    className="flex items-center w-full px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log(
                                        "Báo cáo người dùng",
                                        conversation.id
                                      );
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
                          onClick={() => handleChatClick(conversation)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center relative">
                              <span className="text-white font-medium">
                                {(conversation.senderName || "Ai đó")
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                              {conversation.unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    {conversation.unreadCount}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white truncate">
                                {"Ai đó"}
                              </p>
                              <p className="text-sm text-white/60">
                                {conversation.lastMessageTime ||
                                  conversation.date}
                              </p>
                            </div>
                          </div>

                          <div className="flex-1 my-3 overflow-hidden">
                            <div className="bg-white/10 rounded-lg p-3 h-full">
                              <p className="text-white/80 text-sm line-clamp-3">
                                {conversation.lastMessage ? (
                                  <>
                                    <span className="font-medium text-white/90">

                                      {conversation.lastMessage.sender === "me"
                                        ? "Bạn: "
                                        : `${conversation.senderName?.split(
                                          " "
                                        )[0] || "Ai đó"
                                        }: `}
                                    </span>
                                    {conversation.lastMessage.text}
                                  </>
                                ) : (
                                  "Chưa có tin nhắn nào"
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-cosmic-purple/70 text-xs">
                              {conversation.unreadCount > 0 ? (
                                <span className="bg-red-500 text-white rounded-full px-2 py-1">
                                  {conversation.unreadCount} tin nhắn mới
                                </span>
                              ) : (
                                conversation.date
                              )}
                            </p>
                            {conversation.isOnline && (
                              <span className="flex items-center text-xs text-green-400">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                                Online
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
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

      <RejectionModal
        isOpen={showRejectionModal}
        onClose={() => {
          setShowRejectionModal(false);
          setPendingRejection(null);
        }}
        onConfirm={handleRejectionConfirm}
        senderName={pendingRejection?.senderName}
      />
    </div>
  );
};

export default Inbox;
