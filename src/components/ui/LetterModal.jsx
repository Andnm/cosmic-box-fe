import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Star } from 'lucide-react';

const LetterModal = ({ letter, onClose, onAccept }) => {
  if (!letter) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 50 }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
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
          className="relative max-w-4xl mx-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
        >

          {/* Main content */}
          <motion.div
            className="relative bg-white/95 backdrop-blur-md rounded-[3rem] border-2 border-cosmic-purple/20 shadow-2xl min-h-[70vh] overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(rgba(74, 27, 92, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 27, 92, 0.03) 1px, transparent 1px)",
              backgroundSize: "25px 25px",
            }}
          >
            {/* Decorative floating elements */}
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
              <Star className="text-yellow-400 fill-current opacity-60" size={32} />
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
                  <h2 className="text-3xl font-bold text-cosmic-purple">YÊU CẦU KẾT NỐI</h2>
                  <Heart className="text-pink-500 fill-current" size={32} />
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-lg text-cosmic-purple/70">{letter.date}</span>
                  <div className="w-2 h-2 bg-cosmic-purple/50 rounded-full"></div>
                  <span className="text-lg font-medium text-cosmic-purple">{letter.title}</span>
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="px-16 py-12">
              <motion.div
                className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-[2rem] p-12 border border-cosmic-purple/10 min-h-[300px] relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: "radial-gradient(circle at 25% 25%, rgba(74, 27, 92, 0.1) 2px, transparent 2px)",
                      backgroundSize: "30px 30px",
                    }}
                  ></div>
                </div>

                <div className="relative z-10 space-y-6 text-cosmic-purple text-lg leading-relaxed">
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-2xl font-semibold text-blue-600"
                  >
                    ✨ Xin chào bạn!
                  </motion.p>
                  
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    Mình đã đọc những chia sẻ của bạn và cảm thấy rất đồng cảm với câu chuyện của bạn. 
                    Những suy nghĩ và cảm xúc mà bạn bày tỏ thật sự chạm đến trái tim mình.
                  </motion.p>
                  
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    Mình tin rằng chúng ta có nhiều điểm chung và có thể hiểu nhau một cách sâu sắc. 
                    Hy vọng chúng mình có thể làm quen và chia sẻ nhiều hơn với nhau trong tương lai.
                  </motion.p>
                  
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                    className="text-xl font-medium text-purple-600"
                  >
                    💫 Rất mong được kết nối cùng bạn!
                  </motion.p>
                </div>

               
              </motion.div>

              {/* Action buttons */}
              <motion.div
                className="flex space-x-6 mt-12 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <motion.button
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl flex items-center space-x-3"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(34, 197, 94, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onAccept}
                >
                  <Heart className="fill-current" size={20} />
                  <span>Chấp nhận kết nối</span>
                </motion.button>
                
                <motion.button
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(107, 114, 128, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                >
                  Từ chối lịch sự
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