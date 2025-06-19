import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Archive, Send, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { lettersAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';

const WriteLetter = () => {
  const [letterContent, setLetterContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  const handleContentChange = (e) => {
    setLetterContent(e.target.value);
    if (error || successMessage) {
      clearMessages();
    }
  };

  const validateContent = () => {
    if (!letterContent.trim()) {
      setError('Vui lòng nhập nội dung thư');
      return false;
    }
    if (letterContent.trim().length < 10) {
      setError('Nội dung thư phải có ít nhất 10 ký tự');
      return false;
    }
    if (letterContent.length > 5000) {
      setError('Nội dung thư không được vượt quá 5000 ký tự');
      return false;
    }
    return true;
  };

  const handleSendLetter = async () => {
    if (!validateContent()) return;

    setLoading(true);
    clearMessages();

    try {
      const response = await lettersAPI.create(letterContent.trim(), 'sent');
      
      setSuccessMessage('Thư của bạn đã được gửi để chờ kiểm duyệt!');
      addNotification({
        type: 'success',
        title: 'Gửi thư thành công!',
        content: 'Thư của bạn đang được admin xem xét và sẽ được gửi đến người khác sau khi được duyệt.'
      });

      // Clear form after successful submission
      setTimeout(() => {
        setLetterContent('');
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Send letter error:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi gửi thư';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.details) {
        errorMessage = error.response.data.details[0]?.msg || errorMessage;
      }
      
      setError(errorMessage);
      addNotification({
        type: 'error',
        title: 'Gửi thư thất bại',
        content: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveArchive = async () => {
    if (!validateContent()) return;

    setLoading(true);
    clearMessages();

    try {
      const response = await lettersAPI.create(letterContent.trim(), 'archived');
      
      setSuccessMessage('Thư đã được lưu trữ!');
      addNotification({
        type: 'success',
        title: 'Lưu trữ thư thành công!',
        content: 'Bạn có thể xem lại thư trong mục lưu trữ.'
      });

      // Navigate to archive after saving
      setTimeout(() => {
        navigate('/archive');
      }, 2000);

    } catch (error) {
      console.error('Save draft error:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi lưu thư';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setError(errorMessage);
      addNotification({
        type: 'error',
        title: 'Lưu thư thất bại',
        content: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const wordCount = letterContent.length;
  const maxLength = 5000;

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

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-300 flex items-center space-x-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl text-green-300 flex items-center space-x-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle size={20} />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

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
            <div className="absolute top-4 right-4 text-cosmic-purple/60 text-sm">
              {wordCount}/{maxLength} ký tự
            </div>
            
            <textarea
              value={letterContent}
              onChange={handleContentChange}
              placeholder=""
              maxLength={maxLength}
              className="w-full h-full min-h-[400px] bg-transparent text-cosmic-purple placeholder-cosmic-purple/50 resize-none outline-none leading-relaxed text-lg pt-8"
              style={{ 
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 24px, rgba(74, 27, 92, 0.1) 24px, rgba(74, 27, 92, 0.1) 25px)',
                lineHeight: '25px'
              }}
              disabled={loading}
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
            onClick={handleSendLetter}
            disabled={loading || !letterContent.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2"
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>ĐANG GỬI...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>GỬI THƯ</span>
              </>
            )}
          </motion.button>

          <motion.button
            onClick={handleSaveArchive}
            disabled={loading || !letterContent.trim()}
            className="bg-pink-500 hover:bg-pink-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2"
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>ĐANG LƯU...</span>
              </>
            ) : (
              <>
                <Archive size={20} />
                <span>LƯU TRỮ</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Tips */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-white/30"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-cosmic-purple mb-4 text-center">
            💡 Gợi ý viết thư
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-cosmic-purple/80 text-sm">
            <div>
              <p className="font-medium mb-2">✨ Chia sẻ cảm xúc:</p>
              <p>Hãy thành thật về những gì bạn đang cảm thấy</p>
            </div>
            <div>
              <p className="font-medium mb-2">🌟 Kể câu chuyện:</p>
              <p>Những trải nghiệm của bạn có thể truyền cảm hứng cho người khác</p>
            </div>
            <div>
              <p className="font-medium mb-2">💝 Gửi lời động viên:</p>
              <p>Những lời tích cực có thể thay đổi cả ngày của ai đó</p>
            </div>
            <div>
              <p className="font-medium mb-2">🤗 Chia sẻ suy nghĩ:</p>
              <p>Những góc nhìn độc đáo của bạn rất có giá trị</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WriteLetter;