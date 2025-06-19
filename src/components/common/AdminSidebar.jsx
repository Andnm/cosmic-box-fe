import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Mail, 
  FileText, 
  CreditCard, 
  Users,
  X,
  Home
} from 'lucide-react';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: BarChart3,
      exact: true
    },
    {
      name: 'Thư chờ duyệt',
      path: '/admin/pending-letters',
      icon: Mail
    },
    {
      name: 'Tất cả thư',
      path: '/admin/letters',
      icon: FileText
    },
    {
      name: 'Thanh toán',
      path: '/admin/payments',
      icon: CreditCard
    },
    {
      name: 'Người dùng',
      path: '/admin/users',
      icon: Users
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-purple-900/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-md border-r border-white/20 z-40 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:top-0 lg:h-full lg:z-auto lg:flex-shrink-0
      `}>
        <div className="flex items-center justify-between p-6 border-b border-white/20 lg:hidden">
          <h2 className="text-xl font-bold text-white">Admin Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="text-white" size={20} />
          </button>
        </div>

        <nav className="p-4 flex flex-col h-full overflow-y-auto">
          <div className="space-y-2">


            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg transition-colors relative
                    ${active 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <Icon size={20} className="relative z-10" />
                  <span className="relative z-10 font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;