import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Archive } from 'lucide-react';

const WriteLetter = () => {
  const [letterContent, setLetterContent] = useState('');

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-8"
          {...fadeInUp}
        >
          <div className="flex items-center justify-center mb-6 mt-10">
            <Star className="text-pink-400 mr-3" size={32} />
            <h1 className="text-4xl font-bold text-cosmic-purple pearl-jean-style">NGÀY HÔM NAY CỦA BẠN THẾ NÀO?</h1>
          </div>
          <p className="text-cosmic-purple/80 leading-relaxed max-w-2xl mx-auto">
            Chúng mình ở đây để lắng nghe bạn nên đừng ngần ngại chia sẻ với chúng mình nhé!
            Biết đâu câu chuyện của bạn lại chính là thông điệp mà người khác đang cần đó.
          </p>
        </motion.div>

        <motion.div 
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute -top-4 -left-4">
            <Star className="text-pink-400" size={24} />
          </div>
          <div className="absolute -top-2 -right-2">
            <div className="w-4 h-4 bg-blue-400 rounded-full opacity-60"></div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 min-h-[500px] relative">
            <div className="absolute top-4 left-4 text-blue-800 text-sm">
              Tâm sự tại đây...
            </div>
            <textarea
              value={letterContent}
              onChange={(e) => setLetterContent(e.target.value)}
              placeholder=""
              className="w-full h-full min-h-[400px] bg-transparent text-cosmic-purple placeholder-cosmic-purple/50 resize-none outline-none  leading-relaxed text-lg"
              style={{ 
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 24px, rgba(74, 27, 92, 0.1) 24px, rgba(74, 27, 92, 0.1) 25px)',
                lineHeight: '25px'
              }}
            />
          </div>
          
          <div className="absolute -bottom-2 right-4">
            <div className="w-3 h-3 bg-yellow-400 rounded-full opacity-70"></div>
          </div>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
            <motion.button
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>GỬI THƯ</span>
            </motion.button>
            <motion.button
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Archive size={20} />
              <span>LƯU TRỮ</span>
            </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default WriteLetter;