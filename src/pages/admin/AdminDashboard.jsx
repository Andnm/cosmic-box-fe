import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  CreditCard,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { adminAPI } from '../../services/api'; 

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Tổng số thư',
      value: stats?.totalLetters || 0,
      icon: Mail,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'Thư chờ duyệt',
      value: stats?.pendingLetters || 0,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/20'
    },
    {
      title: 'Thư đã duyệt',
      value: stats?.approvedLetters || 0,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Thư bị từ chối',
      value: stats?.rejectedLetters || 0,
      icon: XCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/20'
    },
    {
      title: 'Tổng thanh toán',
      value: stats?.totalPayments || 0,
      icon: CreditCard,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-500/20'
    },
    {
      title: 'Thanh toán hoàn thành',
      value: stats?.completedPayments || 0,
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/20'
    },
    {
      title: 'Tổng doanh thu',
      value: `${(stats?.totalRevenue || 0).toLocaleString('vi-VN')} đ`,
      icon: DollarSign,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-500/20'
    }
  ];

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
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/70">Tổng quan hệ thống CosmicBox</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className={`w-12 h-1 bg-gradient-to-r ${card.color} rounded-full`}></div>
              </div>
              
              <div>
                <p className="text-white/70 text-sm font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mt-8"
      >
        <h2 className="text-xl font-bold text-white mb-4">Hoạt động gần đây</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats?.pendingLetters || 0}</div>
            <div className="text-white/70 text-sm">Thư cần xem xét</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{stats?.pendingPayments || 0}</div>
            <div className="text-white/70 text-sm">Thanh toán chờ xử lý</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{stats?.totalUsers || 0}</div>
            <div className="text-white/70 text-sm">Người dùng hoạt động</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;