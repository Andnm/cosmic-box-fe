import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Send, X, MessageSquare, Loader2 } from "lucide-react";
import { chatAPI } from "../../services/api";
import socketService from "../../config/socket";
import { useAuth } from "../../context/AuthContext";

const ChatModal = ({ chat: initialChat, onClose }) => {
  const { user } = useAuth(); 
  const currentUserId = user?._id; 
  const [message, setMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(initialChat);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch conversations
  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId]);

  // Load messages for selected chat
  useEffect(() => {
    if (selectedChat?.conversationId) {
      fetchMessages(selectedChat.conversationId);
      joinConversation(selectedChat.conversationId);
    }

    return () => {
      if (selectedChat?.conversationId) {
        leaveConversation(selectedChat.conversationId);
      }
    };
  }, [selectedChat?.conversationId]);

  // Socket event listeners
  useEffect(() => {
    socketService.onNewMessage(handleNewMessage);
    socketService.onUserTyping(handleUserTyping);
    socketService.onMessageRead(handleMessageRead);

    return () => {
      socketService.off("newMessage", handleNewMessage);
      socketService.off("userTyping", handleUserTyping);
      socketService.off("messageRead", handleMessageRead);
    };
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat?.conversationId]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getConversations();
      const conversations = response.data.conversations || response.data;

      const transformedChats = conversations.map((conv) => {
        // Find the other participant (not current user)
        const otherParticipant = conv.participants?.find((p) => {
          const participantId = p.userId?._id || p.userId;
          const isCurrentUser =
            participantId &&
            participantId.toString() === currentUserId?.toString();
          return !isCurrentUser;
        });

        // Safe access to participant data
        const participantUser = otherParticipant?.userId;
        const participantName =
          typeof participantUser === "string"
            ? "Người dùng" // If participantUser is just an ID
            : participantUser?.username ||
              participantUser?.email?.split("@")[0] ||
              "Người dùng";

        // Calculate unread count
        const lastMessageSenderId =
          conv.lastMessage?.senderId?._id || conv.lastMessage?.senderId;
        const unreadCount =
          conv.lastMessage?.isRead === false &&
          lastMessageSenderId?.toString() !== currentUserId?.toString()
            ? 1
            : 0;

        const result = {
          id: conv._id,
          conversationId: conv._id,
          title: participantName,
          lastMessage: conv.lastMessage?.content || "Chưa có tin nhắn",
          unread: unreadCount,
          participants: conv.participants || [],
          requestId: conv.requestId,
          updatedAt: conv.updatedAt || conv.createdAt,
          chatboxName: conv.chatboxName,
          isActive: conv.isActive !== false,
        };

        return result;
      });

      setChats(transformedChats);

      // If initial chat provided and exists in list, select it
      if (initialChat) {
        const matchingChat = transformedChats.find(
          (chat) =>
            chat.conversationId === initialChat.conversationId ||
            chat.id === initialChat.id
        );
        if (matchingChat) {
          setSelectedChat(matchingChat);
        } else if (transformedChats.length > 0) {
          setSelectedChat(transformedChats[0]);
        }
      } else if (!selectedChat && transformedChats.length > 0) {
        setSelectedChat(transformedChats[0]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setError("Không thể tải danh sách cuộc trò chuyện");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId, page = 1) => {
    try {
      const response = await chatAPI.getMessages(conversationId, {
        page,
        limit: 50,
      });
      const fetchedMessages = response.data.messages || response.data;

      const transformedMessages = fetchedMessages.map((msg) => {
        const senderId = msg.senderId?._id || msg.senderId;
        const isMyMessage = senderId?.toString() === currentUserId?.toString();

        return {
          id: msg._id,
          text: msg.content,
          sender: isMyMessage ? "me" : "them",
          senderName: msg.senderId?.username || "Người dùng",
          time: formatTime(msg.createdAt),
          isRead: msg.isRead,
          createdAt: msg.createdAt,
        };
      });

      setMessages((prev) => ({
        ...prev,
        [conversationId]: transformedMessages,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Không thể tải tin nhắn");
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat?.conversationId || sendingMessage) {
      return;
    }

    setSendingMessage(true);
    try {
      const response = await chatAPI.sendMessage(selectedChat.conversationId, {
        content: message.trim(),
      });

      const newMessage = response.data.data;
      const transformedMessage = {
        id: newMessage._id,
        text: newMessage.content,
        sender: "me",
        senderName: newMessage.senderId.username,
        time: formatTime(newMessage.createdAt),
        isRead: newMessage.isRead,
        createdAt: newMessage.createdAt,
      };

      // Add message to local state
      // setMessages((prev) => ({
      //   ...prev,
      //   [selectedChat.conversationId]: [
      //     ...(prev[selectedChat.conversationId] || []),
      //     transformedMessage,
      //   ],
      // }));

      // Update chat list
      setChats((prev) =>
        prev.map((chat) =>
          chat.conversationId === selectedChat.conversationId
            ? { ...chat, lastMessage: message.trim(), unread: 0 }
            : chat
        )
      );

      setMessage("");
      stopTyping();
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Không thể gửi tin nhắn");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleChatSelect = async (chat) => {
    if (selectedChat?.conversationId) {
      leaveConversation(selectedChat.conversationId);
    }

    setSelectedChat(chat);

    // Mark messages as read
    try {
      await chatAPI.markAsRead(chat.conversationId);
      setChats((prev) =>
        prev.map((c) =>
          c.conversationId === chat.conversationId ? { ...c, unread: 0 } : c
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const joinConversation = (conversationId) => {
    socketService.joinConversation(conversationId);
  };

  const leaveConversation = (conversationId) => {
    socketService.leaveConversation(conversationId);
  };

  const handleNewMessage = (newMessage) => {
    const transformedMessage = {
      id: newMessage._id,
      text: newMessage.content,
      sender: newMessage.senderId?._id === currentUserId ? "me" : "them",
      senderName: newMessage.senderId?.username || "Người dùng",
      time: formatTime(newMessage.createdAt),
      isRead: newMessage.isRead,
      createdAt: newMessage.createdAt,
    };

    setMessages((prev) => ({
      ...prev,
      [newMessage.conversationId]: [
        ...(prev[newMessage.conversationId] || []),
        transformedMessage,
      ],
    }));

    // Update chat list
    setChats((prev) =>
      prev.map((chat) =>
        chat.conversationId === newMessage.conversationId
          ? {
              ...chat,
              lastMessage: newMessage.content,
              unread:
                newMessage.senderId?._id !== currentUserId
                  ? chat.unread + 1
                  : 0,
            }
          : chat
      )
    );
  };

  const handleUserTyping = ({ userId, username, isTyping, conversationId }) => {
    if (userId === currentUserId) return;

    setTypingUsers((prev) => ({
      ...prev,
      [conversationId]: isTyping ? { userId, username } : null,
    }));
  };

  const handleMessageRead = ({ messageId, readBy }) => {
    if (readBy === currentUserId) return;

    setMessages((prev) => {
      const updatedMessages = {};
      Object.keys(prev).forEach((convId) => {
        updatedMessages[convId] = prev[convId].map((msg) =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        );
      });
      return updatedMessages;
    });
  };

  const startTyping = () => {
    if (selectedChat?.conversationId) {
      socketService.sendTyping(selectedChat.conversationId, true);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 3000);
    }
  };

  const stopTyping = () => {
    if (selectedChat?.conversationId) {
      socketService.sendTyping(selectedChat.conversationId, false);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    startTyping();
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";

    try {
      return new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentMessages = selectedChat?.conversationId
    ? messages[selectedChat.conversationId] || []
    : [];

  const isTyping =
    selectedChat?.conversationId && typingUsers[selectedChat.conversationId];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-xl rounded-3xl border border-white/20 w-full max-w-6xl h-[90vh] overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            aria-label="Close modal"
          >
            <X className="text-white/80 hover:text-white" size={20} />
          </button>

          {error && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl px-4 py-2 z-40">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="flex h-full">
            {/* Chat List */}
            <div className="w-1/3 border-r border-white/10 bg-gradient-to-b from-indigo-900/20 to-transparent p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                  >
                    <ChevronLeft size={20} className="text-white/80" />
                  </button>
                  <h3 className="font-bold text-xl text-white">
                    Danh sách chat
                  </h3>
                </div>
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <MessageSquare size={16} className="text-purple-400" />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-white/60" />
                </div>
              ) : (
                <div className="space-y-2">
                  {chats.map((chat) => (
                    <motion.div
                      key={chat.id}
                      className={`relative p-3 rounded-xl cursor-pointer transition-all ${
                        selectedChat?.id === chat.id
                          ? "bg-gradient-to-r from-purple-500/30 to-transparent border border-purple-500/30"
                          : "hover:bg-white/10"
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {(chat.title || "U").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {chat.unread > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {chat.unread}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">
                            {"Ai đó"}
                          </p>
                          <p className="text-sm text-white/60 truncate">
                            {chat.lastMessage || "Chưa có tin nhắn"}
                          </p>
                        </div>
                        <div className="text-xs text-white/40">
                          {chat.updatedAt ? formatTime(chat.updatedAt) : ""}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className="w-2/3 flex flex-col bg-gradient-to-b from-purple-900/20 to-transparent">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {(selectedChat.title || "U").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-white">
                          {"Ai đó"}
                        </p>
                        <p className="text-sm text-white/60 flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                          Đang hoạt động
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
                    <div className="space-y-4">
                      {currentMessages.map((msg, index) => (
                        <motion.div
                          key={index}
                          className={`flex ${
                            msg.sender === "me"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="max-w-xs lg:max-w-md">
                            <div
                              className={`inline-block p-3 rounded-2xl ${
                                msg.sender === "me"
                                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                                  : "bg-white/10 text-white"
                              }`}
                            >
                              {msg.text}
                            </div>
                            <p
                              className={`text-xs mt-1 flex items-center ${
                                msg.sender === "me"
                                  ? "text-white/50 justify-end"
                                  : "text-white/40"
                              }`}
                            >
                              <span>{msg.time}</span>
                              {msg.sender === "me" && (
                                <span className="ml-2">
                                  {msg.isRead ? "✓✓" : "✓"}
                                </span>
                              )}
                            </p>
                          </div>
                        </motion.div>
                      ))}

                      {/* Typing indicator */}
                      {isTyping && (
                        <motion.div
                          className="flex justify-start"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="bg-white/10 text-white p-3 rounded-2xl">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-white/10">
                    <div className="flex items-center space-x-3">
                      <textarea
                        value={message}
                        onChange={handleMessageChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/40 resize-none max-h-32"
                        rows="1"
                        disabled={sendingMessage}
                        onBlur={stopTyping}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || sendingMessage}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sendingMessage ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <Send size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center p-6 max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare size={32} className="text-white/40" />
                    </div>
                    <h3 className="text-xl font-medium text-white/80 mb-2">
                      Chọn một cuộc trò chuyện
                    </h3>
                    <p className="text-white/50">
                      Nhấn vào bất kỳ cuộc trò chuyện nào trong danh sách để bắt
                      đầu chat
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ChatModal;
