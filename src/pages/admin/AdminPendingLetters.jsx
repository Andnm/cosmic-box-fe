import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Check, 
  X, 
  Clock, 
  User,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';

const AdminPendingLetters = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchPendingLetters();
  }, [pagination.currentPage]);

  const fetchPendingLetters = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPendingLetters({
        page: pagination.currentPage,
        limit: 10
      });
      
      setLetters(response.data.letters);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error fetching pending letters:', error);
      addNotification({
        type: 'error',
        title: 'Lỗi',
        content: 'Không thể tải danh sách thư chờ duyệt'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (letterId, status) => {
    try {
      setReviewLoading(true);
      
      await adminAPI.reviewLetter(letterId, {
        status,
        note: reviewNote
      });

      addNotification({
        type: 'success',
        title: status === 'approved' ? 'Đã duyệt thư' : 'Đã từ chối thư',
        content: `Thư đã được ${status === 'approved' ? 'phê duyệt' : 'từ chối'} thành công`
      });

      // Refresh the list
      fetchPendingLetters();
      setSelectedLetter(null);
      setReviewNote('');
    } catch (error) {
      console.error('Error reviewing letter:', error);
      addNotification({
        type: 'error',
        title: 'Lỗi',
        content: 'Không thể xem xét thư'
      });
    } finally {
      setReviewLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Thư chờ duyệt</h1>
          <p className="text-white/70">Có {pagination.total} thư đang chờ xem xét</p>
        </div>
      </motion.div>

      {/* Letters List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {letters.map((letter, index) => (
              <motion.div
                key={letter._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 cursor-pointer transition-all hover:bg-white/20 ${
                  selectedLetter?._id === letter._id ? 'ring-2 ring-purple-400' : ''
                }`}
                onClick={() => setSelectedLetter(letter)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="text-white" size={18} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{letter.senderId?.username}</p>
                      <p className="text-white/60 text-sm">{letter.senderId?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <Clock size={16} />
                    <span className="text-sm">Chờ duyệt</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-white/80 text-sm line-clamp-3">
                    {letter.content}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>{formatDate(letter.createdAt)}</span>
                  <div className="flex items-center space-x-1">
                    <MessageSquare size={14} />
                    <span>{letter.content.length} ký tự</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-lg bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <span className="text-white px-4 py-2">
                Trang {pagination.currentPage} / {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 rounded-lg bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Review Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 sticky top-24">
            {selectedLetter ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Chi tiết thư</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-white/70 text-sm">Người gửi:</label>
                    <p className="text-white font-medium">{selectedLetter.senderId?.username}</p>
                  </div>
                  
                  <div>
                    <label className="text-white/70 text-sm">Email:</label>
                    <p className="text-white">{selectedLetter.senderId?.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-white/70 text-sm">Ngày tạo:</label>
                    <p className="text-white">{formatDate(selectedLetter.createdAt)}</p>
                  </div>
                  
                  <div>
                    <label className="text-white/70 text-sm">Nội dung:</label>
                    <div className="bg-white/10 rounded-lg p-4 mt-2 max-h-40 overflow-y-auto">
                      <p className="text-white text-sm leading-relaxed">{selectedLetter.content}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-white/70 text-sm block mb-2">Ghi chú (tuỳ chọn):</label>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Thêm ghi chú về quyết định của bạn..."
                    className="w-full bg-white/10 border border-white/30 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleReview(selectedLetter._id, 'approved')}
                    disabled={reviewLoading}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Check size={18} />
                    <span>Phê duyệt</span>
                  </button>
                  
                  <button
                    onClick={() => handleReview(selectedLetter._id, 'rejected')}
                    disabled={reviewLoading}
                    className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <X size={18} />
                    <span>Từ chối</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-white/60 py-12">
                <Eye size={48} className="mx-auto mb-4 opacity-50" />
                <p>Chọn một thư để xem chi tiết và xem xét</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPendingLetters;