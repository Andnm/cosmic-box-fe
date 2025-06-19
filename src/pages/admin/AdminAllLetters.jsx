import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Archive,
  Send,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { adminAPI } from '../../services/api';

const AdminAllLetters = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    adminReviewStatus: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchLetters();
  }, [pagination.currentPage, filters]);

  const fetchLetters = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 10,
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await adminAPI.getAllLetters(params);
      console.log("response:", response)
      setLetters(response.data.letters);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error fetching letters:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500/20 text-gray-300';
      case 'sent':
        return 'bg-blue-500/20 text-blue-300';
      case 'archived':
        return 'bg-purple-500/20 text-purple-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getReviewStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'approved':
        return 'bg-green-500/20 text-green-300';
      case 'rejected':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft':
        return <FileText size={16} />;
      case 'sent':
        return <Send size={16} />;
      case 'archived':
        return <Archive size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getReviewStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'approved':
        return <CheckCircle size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
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
          <h1 className="text-3xl font-bold text-white mb-2">Tất cả thư</h1>
          <p className="text-white/70">Quản lý toàn bộ thư trong hệ thống ({pagination.total} thư)</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-white/70 text-sm block mb-2">Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
              <input
                type="text"
                placeholder="Tìm theo nội dung..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full bg-white/10 border border-white/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm block mb-2">Trạng thái thư</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="">Tất cả</option>
              <option value="draft">Bản nháp</option>
              <option value="sent">Đã gửi</option>
              <option value="archived">Lưu trữ</option>
            </select>
          </div>

          <div>
            <label className="text-white/70 text-sm block mb-2">Trạng thái duyệt</label>
            <select
              value={filters.adminReviewStatus}
              onChange={(e) => handleFilterChange('adminReviewStatus', e.target.value)}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="">Tất cả</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ status: '', adminReviewStatus: '', search: '' });
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Filter size={18} />
              <span>Xóa bộ lọc</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Letters List */}
      <div className="space-y-4">
        {letters.map((letter, index) => (
          <motion.div
            key={letter._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-white font-medium">{letter.senderId?.username}</p>
                  <p className="text-white/60 text-sm">{letter.senderId?.email}</p>
                  {letter.receiverId && (
                    <p className="text-white/60 text-sm">→ {letter.receiverId?.username}</p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(letter.status)}`}>
                  {getStatusIcon(letter.status)}
                  <span className="capitalize">{letter.status}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getReviewStatusColor(letter.adminReviewStatus)}`}>
                  {getReviewStatusIcon(letter.adminReviewStatus)}
                  <span className="capitalize">{letter.adminReviewStatus}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-white/80 text-sm line-clamp-2">
                {letter.content}
              </p>
            </div>
            
            <div className="flex items-center justify-between text-sm text-white/60">
              <div className="space-x-4">
                <span>Tạo: {formatDate(letter.createdAt)}</span>
                {letter.sentAt && (
                  <span>Gửi: {formatDate(letter.sentAt)}</span>
                )}
                {letter.adminReviewedAt && (
                  <span>Duyệt: {formatDate(letter.adminReviewedAt)}</span>
                )}
              </div>
              <span>{letter.content.length} ký tự</span>
            </div>
            
            {letter.adminReviewNote && (
              <div className="mt-3 p-3 bg-white/10 rounded-lg">
                <p className="text-white/70 text-sm">
                  <strong>Ghi chú:</strong> {letter.adminReviewNote}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
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

      {letters.length === 0 && (
        <div className="text-center text-white/60 py-12">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p>Không tìm thấy thư nào</p>
        </div>
      )}
    </div>
  );
};

export default AdminAllLetters;