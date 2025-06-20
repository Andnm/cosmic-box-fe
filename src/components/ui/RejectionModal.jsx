import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

const RejectionModal = ({ isOpen, onClose, onConfirm, senderName }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(rejectionReason.trim());
      setRejectionReason('');
      onClose();
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRejectionReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl max-w-md w-full mx-4"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/30">
            <div className="flex items-center space-x-3">
              <AlertCircle className="text-red-500" size={24} />
              <h2 className="text-xl font-bold text-gray-800">
                Từ chối yêu cầu kết nối
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100/50 rounded-full transition-colors"
              disabled={loading}
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <p className="text-gray-700 mb-4">
                Bạn đang từ chối yêu cầu kết nối từ{' '}
                <span className="font-semibold text-cosmic-purple">
                  {senderName}
                </span>
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Vui lòng cho biết lý do để người gửi có thể hiểu được quyết định của bạn:
              </p>
              
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ví dụ: Hiện tại tôi chưa sẵn sàng kết nối thêm, hoặc tôi cảm thấy chúng ta không phù hợp..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl resize-none outline-none focus:border-cosmic-purple focus:ring-2 focus:ring-cosmic-purple/20 transition-all"
                maxLength={500}
                disabled={loading}
              />
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-500 text-sm">
                  {rejectionReason.length}/500 ký tự
                </span>
              </div>
            </div>

            {/* Quick reasons */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-2">Lý do nhanh:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Hiện tại chưa sẵn sàng kết nối thêm",
                  "Cảm thấy chúng ta không phù hợp",
                  "Đã có đủ kết nối rồi",
                  "Muốn tập trung vào bản thân"
                ].map((reason, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRejectionReason(reason)}
                    className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                disabled={loading || !rejectionReason.trim()}
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RejectionModal;