import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Star, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LetterModal = ({ letter, onClose, onAccept }) => {
  const navigate = useNavigate();

  if (!letter) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 50 },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Split content into paragraphs for better display
  const formatContent = (content) => {
    if (!content) return ["Nội dung thư trống"];

    // Split by line breaks and filter empty lines
    const paragraphs = content.split("\n").filter((p) => p.trim() !== "");
    return paragraphs.length > 0 ? paragraphs : [content];
  };

  const contentParagraphs = formatContent(letter.fullContent || letter.preview);

  const handleConnectRequest = () => {
    // Close modal first
    onClose();

    // Navigate to connect payment with receiver info
    navigate("/connect-payment", {
      state: {
        receiver: {
          id: letter.sender?._id,
          username: letter.sender?.username,
          fullLetter: letter,
        },
      },
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-4xl mx-auto max-h-[90vh] overflow-y-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="relative bg-white/95 backdrop-blur-md rounded-[3rem] border-2 border-cosmic-purple/20 shadow-2xl min-h-[70vh] overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(rgba(74, 27, 92, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 27, 92, 0.03) 1px, transparent 1px)",
              backgroundSize: "25px 25px",
            }}
          >
            {/* Animated decorations */}
            <motion.div
              className="absolute top-12 right-16 w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-60"
              animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-24 left-20 w-8 h-8 bg-blue-400 rounded-full opacity-70"
              animate={{ scale: [1, 1.4, 1], x: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 right-24"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <Star
                className="text-yellow-400 fill-current opacity-60"
                size={32}
              />
            </motion.div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg z-10"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center pt-16 pb-8 px-8 border-b border-cosmic-purple/10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Heart className="text-pink-500 fill-current" size={32} />
                  <h2 className="text-3xl font-bold text-cosmic-purple">
                    TÂM THƯ CHIA SẺ
                  </h2>
                  <Heart className="text-pink-500 fill-current" size={32} />
                </div>

                {/* Sender info */}
                <div className="flex items-center justify-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="text-cosmic-purple/70" size={20} />
                    <span className="text-lg font-medium text-cosmic-purple">
                      {letter.sender?.username || "Người gửi ẩn danh"}
                    </span>
                  </div>
                </div>

                {/* Date and title */}
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-sm text-cosmic-purple/70">
                    {letter.sentAt
                      ? formatDisplayDate(letter.sentAt)
                      : letter.date}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Letter content */}
            <div className="px-8 sm:px-16 py-12">
              <motion.div
                className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-[2rem] p-8 sm:p-12 border border-cosmic-purple/10 min-h-[300px] relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 25% 25%, rgba(74, 27, 92, 0.1) 2px, transparent 2px)",
                      backgroundSize: "30px 30px",
                    }}
                  ></div>
                </div>

                <div className="relative z-10 space-y-6 text-cosmic-purple text-lg leading-relaxed">
                  {contentParagraphs.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.2, duration: 0.6 }}
                      className={`${
                        index === 0 ? "text-xl font-semibold text-blue-600" : ""
                      } whitespace-pre-wrap`}
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mt-12 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <motion.button
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 sm:px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl flex items-center justify-center space-x-3"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px -12px rgba(34, 197, 94, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConnectRequest}
                >
                  <Heart className="fill-current" size={20} />
                  <span>Yêu cầu kết nối</span>
                </motion.button>

                <motion.button
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 sm:px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl flex items-center justify-center space-x-3"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                >
                  <span>Đóng thư</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LetterModal;
