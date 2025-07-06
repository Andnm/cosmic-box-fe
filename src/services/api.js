import api from "../config/api";

// Users API
export const usersAPI = {
  getMyProfile: () => api.get("/users/profile"),
  updateMyProfile: (data) => api.put(`/users/profile`, data),
  upgradeVip: () => api.post("/users/upgrade-vip"),
  getMembership: () => api.get("/users/membership"),
  getPaymentHistory: () => api.get("/users/payment-history"),
};

// Letters API
export const lettersAPI = {
  create: (content, status = "draft") =>
    api.post("/letters", { content, status }),
  getMyLetters: (params = {}) => api.get("/letters/my", { params }),
  getReceivedLetters: (params = {}) => api.get("/letters/received", { params }),
  archive: (letterId) => api.put(`/letters/${letterId}/archive`),
  deleteDraft: (letterId) => api.delete(`/letters/${letterId}`),
};

// api/connections.js
export const connectionsAPI = {
  getUsers: (params = {}) => api.get("/connections/users", { params }),
  createRequest: (data) => api.post("/connections/requests", data),
  getMyRequests: (params = {}) => api.get("/connections/requests", { params }),
  respondToRequest: (requestId, data) =>
    api.put(`/connections/requests/${requestId}/respond`, data), // ← Changed to accept data object
};

// Chat API
export const chatAPI = {
  getConversations: () => api.get("/chat/conversations"),
  getMessages: (conversationId, params = {}) =>
    api.get(`/chat/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId, data) =>
    api.post(`/chat/conversations/${conversationId}/messages`, data),
  markAsRead: (conversationId) =>
    api.put(`/chat/conversations/${conversationId}/read`),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params = {}) => api.get("/notifications", { params }),
  markAsRead: (notificationId) =>
    api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
  delete: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

// Payments API
export const paymentsAPI = {
  getMyPayments: (params = {}) => api.get("/payments", { params }),
  getPaymentStatus: (requestId) =>
    api.get(`/payments/request/${requestId}/status`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getPendingLetters: (params = {}) =>
    api.get("/admin/letters/pending", { params }),
  getAllLetters: (params = {}) => api.get("/admin/letters", { params }),
  reviewLetter: (letterId, data) =>
    api.put(`/admin/letters/${letterId}/review`, data),
  getPayments: (params = {}) => api.get("/admin/payments", { params }),
  getAllUsers: (params = {}) => api.get("/admin/users", { params }),
};
