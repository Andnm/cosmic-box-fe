export const timeOfPosting = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Vừa xong";

  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  if (diffHours < 24) return `${diffHours} giờ trước`;

  if (diffDays === 1) return "Hôm qua";

  if (diffDays <= 7) return `${diffDays} ngày trước`;

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const getRelativeTime = (date) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now - targetDate) / 1000);

  if (diffInSeconds < 60) return "Vừa xong";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

  return timeOfPosting(date);
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, direction = "asc") => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (direction === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideInVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
};

export const scaleVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
};

export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return defaultValue;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Error removing from localStorage:", error);
    return false;
  }
};

export const getRandomColor = () => {
  const colors = [
    "bg-pink-400",
    "bg-blue-400",
    "bg-purple-400",
    "bg-indigo-400",
    "bg-cyan-400",
    "bg-teal-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-orange-400",
    "bg-red-400",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const highlightText = (text, searchTerm) => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
};

export const createApiUrl = (endpoint, params = {}) => {
  const url = new URL(
    endpoint,
    process.env.REACT_APP_API_BASE_URL || "http://localhost:3001"
  );
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.message || "Đã xảy ra lỗi từ server";
  } else if (error.request) {
    return "Không thể kết nối đến server";
  } else {
    return "Đã xảy ra lỗi không xác định";
  }
};
