import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Sparkles, Heart, Calendar, Tag } from 'lucide-react';

const ArchiveLetterModal = ({ isOpen, onClose, letter }) => {
  if (!letter) return null;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      rotateX: -15 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      rotateX: 15,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-white/10 backdrop-blur-md rounded-3xl border border-cosmic-purple/30 max-w-2xl w-full max-h-[80vh] overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              backgroundImage: "linear-gradient(rgba(74, 27, 92, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 27, 92, 0.05) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            {/* Floating Decorative Elements */}
            <motion.div 
              className="absolute top-4 right-16 flex items-center space-x-2"
              animate={{ 
                y: [-3, 3, -3],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div 
                className="w-3 h-3 bg-pink-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Star className="text-yellow-400 fill-current" size={20} />
            </motion.div>
            
            <motion.div 
              className="absolute bottom-6 left-6"
              animate={{ 
                x: [-2, 2, -2],
                y: [0, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="text-purple-300 opacity-60" size={16} />
            </motion.div>

            <motion.div 
              className="absolute top-1/3 left-8 w-2 h-2 bg-blue-400 rounded-full opacity-70"
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                y: [-5, 5, -5]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Heart className="text-pink-500 fill-current" size={24} />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-cosmic-purple">Chi tiết thư</h3>
                  <div className="flex items-center space-x-4 text-sm text-cosmic-purple/70 mt-1">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{letter.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tag size={14} />
                      <span>{letter.status}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <motion.button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 text-cosmic-purple"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Letter Content */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-cosmic-purple mb-4 flex items-center gap-2">
                    <Sparkles className="text-purple-400" size={18} />
                    {letter.title}
                  </h4>
                  
                  <div className="text-cosmic-purple/90 leading-relaxed whitespace-pre-line">
                    {letter.content}
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <h5 className="font-medium text-cosmic-purple mb-2">Thông tin</h5>
                    <div className="space-y-2 text-sm text-cosmic-purple/70">
                      <div className="flex justify-between">
                        <span>Ngày tạo:</span>
                        <span>{letter.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trạng thái:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          letter.type === 'sent' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {letter.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Số từ:</span>
                        <span>{letter.wordCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <h5 className="font-medium text-cosmic-purple mb-2">Tags</h5>
                    <div className="flex flex-wrap gap-2">
                      {letter.tags.map((tag, index) => (
                        <motion.span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-xs text-cosmic-purple border border-white/20"
                          whileHover={{ scale: 1.05 }}
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/20 bg-white/5">
              <div className="flex justify-end space-x-3">
                <motion.button
                  onClick={onClose}
                  className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-cosmic-purple hover:bg-white/30 transition-all duration-300 border border-white/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Đóng
                </motion.button>
                <motion.button
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Chỉnh sửa
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArchiveLetterModal;
