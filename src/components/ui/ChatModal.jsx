import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Send, X, MessageSquare } from "lucide-react";

const ChatModal = ({ chat: initialChat, onClose }) => {
  const [message, setMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(initialChat);
  const [chats, setChats] = useState([
    { id: 1, title: "Người dùng 1", lastMessage: "Xin chào!", unread: 2 },
    { id: 2, title: "Người dùng 2", lastMessage: "Bạn có khỏe không?", unread: 0 },
    { id: 3, title: "Người dùng 3", lastMessage: "Hẹn gặp lại!", unread: 5 },
  ]);
  
  const [messages, setMessages] = useState({
    1: [
      { id: 1, text: "Xin chào! Bạn khỏe không?", sender: "them", time: "10:30 AM" },
      { id: 2, text: "Mình khỏe, cảm ơn bạn!", sender: "me", time: "10:32 AM" },
    ],
    2: [
      { id: 1, text: "Chào buổi sáng!", sender: "them", time: "09:15 AM" },
      { id: 2, text: "Chúc bạn ngày mới tốt lành", sender: "me", time: "09:20 AM" },
    ],
    3: [
      { id: 1, text: "Hẹn gặp bạn vào 3h chiều nhé", sender: "them", time: "01:45 PM" },
    ],
  });

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: messages[selectedChat.id].length + 1,
        text: message,
        sender: "me",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...prev[selectedChat.id], newMessage]
      }));
      
      // Cập nhật last message trong danh sách chat
      setChats(prev => 
        prev.map(chat => 
          chat.id === selectedChat.id 
            ? { ...chat, lastMessage: message, unread: 0 } 
            : chat
        )
      );
      
      setMessage("");
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    // Reset unread count khi chọn chat
    setChats(prev => 
      prev.map(c => 
        c.id === chat.id 
          ? { ...c, unread: 0 } 
          : c
      )
    );
  };

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
          {/* Nút đóng modal */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            aria-label="Close modal"
          >
            <X className="text-white/80 hover:text-white" size={20} />
          </button>

          <div className="flex h-full">
            {/* Danh sách chat bên trái */}
            <div className="w-1/3 border-r border-white/10 bg-gradient-to-b from-indigo-900/20 to-transparent p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={onClose} 
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                  >
                    <ChevronLeft size={20} className="text-white/80" />
                  </button>
                  <h3 className="font-bold text-xl text-white">Danh sách chat</h3>
                </div>
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <MessageSquare size={16} className="text-purple-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                {chats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    className={`relative p-3 rounded-xl cursor-pointer transition-all ${
                      selectedChat?.id === chat.id
                        ? 'bg-gradient-to-r from-purple-500/30 to-transparent border border-purple-500/30'
                        : 'hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChatSelect(chat)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {chat.title.charAt(0)}
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
                        <p className="font-medium text-white truncate">{chat.title}</p>
                        <p className="text-sm text-white/60 truncate">{chat.lastMessage}</p>
                      </div>
                      <div className="text-xs text-white/40">
                        {messages[chat.id]?.[messages[chat.id].length - 1]?.time || ""}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Nội dung chat bên phải */}
            <div className="w-2/3 flex flex-col bg-gradient-to-b from-purple-900/20 to-transparent">
              {selectedChat ? (
                <>
                  {/* Header chat */}
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {selectedChat.title.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-white">{selectedChat.title}</p>
                        <p className="text-sm text-white/60 flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                          Đang hoạt động
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Nội dung tin nhắn */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
                    <div className="space-y-4">
                      {messages[selectedChat.id]?.map((msg) => (
                        <motion.div
                          key={msg.id}
                          className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
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
                            <p className={`text-xs mt-1 ${
                              msg.sender === "me" ? "text-white/50 text-right" : "text-white/40"
                            }`}>
                              {msg.time}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Input gửi tin nhắn */}
                  <div className="p-4 border-t border-white/10">
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 bg-white/5 backdrop-blur-sm rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/40"
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={20} />
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
                    <h3 className="text-xl font-medium text-white/80 mb-2">Chọn một cuộc trò chuyện</h3>
                    <p className="text-white/50">Nhấn vào bất kỳ cuộc trò chuyện nào trong danh sách để bắt đầu chat</p>
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
