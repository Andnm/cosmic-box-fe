import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import socketService from '../config/socket';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, user } = useAuth();
  
  // Dùng useRef để track user trước đó
  const prevUserRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      // Nếu user thay đổi (logout -> login user khác), clear notifications
      if (prevUserRef.current && prevUserRef.current.id !== user?.id) {
        clearNotifications();
      }
      
      prevUserRef.current = user;
      setupSocketListeners();
    } else {
      // Khi logout (isAuthenticated = false), clear notifications
      clearNotifications();
      prevUserRef.current = null;
      cleanupSocketListeners();
    }

    return () => {
      cleanupSocketListeners();
    };
  }, [isAuthenticated, user?.id]);

  const setupSocketListeners = () => {
    socketService.onNewNotification(handleNewNotification);
  };

  const cleanupSocketListeners = () => {
    socketService.off('newNotification', handleNewNotification);
  };

  const handleNewNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.content,
        icon: '/logo192.png'
      });
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      isRead: false,
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, isRead: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    setUnreadCount(0);
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
    requestNotificationPermission
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
