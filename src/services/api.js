import api from "../config/api";

// Letters API
export const lettersAPI = {
  create: (content, status = "draft") =>
    api.post("/letters", { content, status }),
  getMyLetters: (params = {}) => api.get("/letters/my", { params }),
  getReceivedLetters: (params = {}) => api.get("/letters/received", { params }),
  archive: (letterId) => api.put(`/letters/${letterId}/archive`),
  deleteDraft: (letterId) => api.delete(`/letters/${letterId}`),
};

// Connections API
export const connectionsAPI = {
  getUsers: (params = {}) => api.get("/connections/users", { params }),
  createRequest: (data) => api.post("/connections/requests", data),
  getMyRequests: (params = {}) => api.get("/connections/requests", { params }),
  respondToRequest: (requestId, status) =>
    api.put(`/connections/requests/${requestId}/respond`, { status }),
};

// Chat API
export const chatAPI = {
  getConversations: () => api.get("/chat/conversations"),
  getMessages: (conversationId, params = {}) =>
    api.get(`/chat/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId, content) =>
    api.post(`/chat/conversations/${conversationId}/messages`, { content }),
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
};
