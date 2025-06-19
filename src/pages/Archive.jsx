import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Loader,
  AlertCircle,
  Trash2,
  Archive as ArchiveIcon,
  Star,
  Sparkles,
  Heart,
  Calendar,
  Clock,
  Eye,
  Edit3,
  RefreshCw,
} from "lucide-react";
import { lettersAPI } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useNotifications } from "../context/NotificationContext";
import { timeOfPosting } from "../utils/helpers";

const Archive = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLetters, setTotalLetters] = useState(0);
  const [deleting, setDeleting] = useState(null);
  const [archiving, setArchiving] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const { addNotification } = useNotifications();

  const filters = [
    {
      id: "all",
      label: "TẤT CẢ",
      icon: Star,
      color: "from-purple-500 to-pink-500",
      textColor: "text-purple-800",
      bgColor: "bg-purple-100",
    },
    {
      id: "sent",
      label: "ĐÃ GỬI",
      icon: ArchiveIcon,
      color: "from-green-500 to-emerald-500",
      textColor: "text-green-800",
      bgColor: "bg-green-100",
    },
    // {
    //   id: "draft",
    //   label: "BẢN NHÁP",
    //   icon: Edit3,
    //   color: "from-yellow-500 to-orange-500",
    //   textColor: "text-yellow-800",
    //   bgColor: "bg-yellow-100",
    // },
    {
      id: "archived",
      label: "LƯU TRỮ",
      icon: Heart,
      color: "from-blue-500 to-cyan-500",
      textColor: "text-blue-800",
      bgColor: "bg-blue-100",
    },
  ];

  useEffect(() => {
    fetchLetters();
  }, [activeFilter, currentPage]);

  const fetchLetters = async (showRefresh = false, isFilterChange = false) => {
    if (showRefresh) setRefreshing(true);
    else if (isFilterChange) setFilterLoading(true);
    else setLoading(true);
    setError("");

    try {
      const params = {
        page: currentPage,
        limit: 12,
        ...(activeFilter !== "all" && { status: activeFilter }),
      };

      const response = await lettersAPI.getMyLetters(params);
      setLetters(response.data.letters);
      setTotalPages(response.data.totalPages);
      setTotalLetters(response.data.total);
    } catch (error) {
      console.error("Fetch letters error:", error);
      setError("Không thể tải danh sách thư. Vui lòng thử lại.");
      addNotification({
        type: "error",
        title: "Lỗi tải dữ liệu",
        content: "Không thể tải danh sách thư",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
      setFilterLoading(false);
      setInitialLoad(false); // Set initial load to false after first load
    }
  };

  const handleRefresh = () => {
    fetchLetters(true);
  };

  const handleDeleteDraft = async (letterId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bản nháp này không?"))
      return;

    setDeleting(letterId);
    try {
      await lettersAPI.deleteDraft(letterId);

      addNotification({
        type: "success",
        title: "Xóa thành công",
        content: "Bản nháp đã được xóa",
      });

      // Remove from local state
      setLetters((prev) => prev.filter((letter) => letter._id !== letterId));
      setTotalLetters((prev) => prev - 1);

      // Close modal if this letter was selected
      if (selectedLetter?._id === letterId) {
        setSelectedLetter(null);
      }
    } catch (error) {
      console.error("Delete draft error:", error);
      addNotification({
        type: "error",
        title: "Xóa thất bại",
        content:
          error.response?.data?.error || "Có lỗi xảy ra khi xóa bản nháp",
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleArchiveLetter = async (letterId) => {
    if (!window.confirm("Bạn có muốn lưu trữ thư này không?")) return;

    setArchiving(letterId);
    try {
      await lettersAPI.archive(letterId);

      addNotification({
        type: "success",
        title: "Lưu trữ thành công",
        content: "Thư đã được lưu trữ",
      });

      // Update local state
      setLetters((prev) =>
        prev.map((letter) =>
          letter._id === letterId ? { ...letter, status: "archived" } : letter
        )
      );

      // Update selected letter if it's the same
      if (selectedLetter?._id === letterId) {
        setSelectedLetter((prev) => ({ ...prev, status: "archived" }));
      }
    } catch (error) {
      console.error("Archive letter error:", error);
      addNotification({
        type: "error",
        title: "Lưu trữ thất bại",
        content: error.response?.data?.error || "Có lỗi xảy ra khi lưu trữ thư",
      });
    } finally {
      setArchiving(null);
    }
  };

  const filteredLetters = letters.filter((letter) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const letterDate = new Date(letter.createdAt).toLocaleDateString("vi-VN");
    const letterContent = letter.content.toLowerCase();

    return (
      letterDate.includes(searchLower) || letterContent.includes(searchLower)
    );
  });

  const getStatusDisplay = (letter) => {
    if (letter.status === "sent") {
      return {
        text: "Đã gửi",
        color: "text-green-600",
        bgColor: "bg-green-100",
        icon: ArchiveIcon,
      };
    } else if (letter.status === "archived") {
      return {
        text: "Lưu trữ",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        icon: Heart,
      };
    } else if (letter.status === "draft") {
      return {
        text: "Bản nháp",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        icon: Edit3,
      };
    }

    // Check admin review status for more detailed status
    if (letter.adminReviewStatus === "pending") {
      return {
        text: "Chờ duyệt",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        icon: Clock,
      };
    } else if (letter.adminReviewStatus === "rejected") {
      return {
        text: "Bị từ chối",
        color: "text-red-600",
        bgColor: "bg-red-100",
        icon: X,
      };
    }

    return {
      text: "Không xác định",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      icon: AlertCircle,
    };
  };

  

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
    fetchLetters(false, true);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  if (loading && initialLoad) {
    return <LoadingSpinner message="Đang tải hòm thư của bạn..." />;
  }

  return (
    <div className="min-h-screen py-8 px-6 mt-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div className="text-center mb-12" {...fadeInUp}>
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Star className="text-yellow-400 mr-4" size={40} />
            </motion.div>
            <h1 className="text-6xl font-bold text-cosmic-purple pearl-jean-style">
              HÒM LƯU TRỮ
            </h1>
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="text-pink-400 ml-4" size={36} />
            </motion.div>
          </div>
          <p className="text-cosmic-purple/80 max-w-3xl mx-auto text-lg leading-relaxed">
            Nơi lưu giữ những tâm sự, kỷ niệm và cảm xúc mà bạn đã chia sẻ với
            vũ trụ CosmicBox. Mỗi bức thư đều mang theo một câu chuyện đặc biệt
            của riêng bạn.
          </p>

          {/* Stats */}
          <motion.div
            className="flex items-center justify-center space-x-8 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-cosmic-purple">
                {totalLetters}
              </div>
              <div className="text-cosmic-purple/60 text-sm">Tổng số thư</div>
            </div>
            <div className="w-px h-8 bg-cosmic-purple/30"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cosmic-purple">
                {currentPage}
              </div>
              <div className="text-cosmic-purple/60 text-sm">
                Trang hiện tại
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {filters.map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <motion.button
                    key={filter.id}
                    onClick={() => handleFilterChange(filter.id)}
                    className={`relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                      activeFilter === filter.id
                        ? `bg-gradient-to-r ${filter.color} text-white shadow-lg transform scale-105`
                        : "bg-white/20 backdrop-blur-sm text-cosmic-purple hover:bg-white/30 hover:scale-102"
                    }`}
                    whileHover={{
                      scale: activeFilter === filter.id ? 1.05 : 1.02,
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconComponent size={18} />
                    <span>{filter.label}</span>

                    {activeFilter === filter.id && (
                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded-2xl"
                        layoutId="activeFilter"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Search and Refresh */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-cosmic-purple/50" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm thư..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-12 pr-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-cosmic-purple placeholder-cosmic-purple/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                />
              </div>

              <motion.button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-300 text-cosmic-purple"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw
                  className={`${refreshing ? "animate-spin" : ""}`}
                  size={20}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-8 p-6 bg-red-500/20 border border-red-500/30 rounded-3xl text-red-300 flex items-center space-x-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AlertCircle size={24} />
              <div>
                <h4 className="font-semibold mb-1">Oops! Có lỗi xảy ra</h4>
                <p>{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Letters Grid */}
        {loading || filterLoading ? (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <Loader
                className="animate-spin text-cosmic-purple mx-auto mb-4"
                size={48}
              />
              <p className="text-cosmic-purple/70">Đang tải thư...</p>
            </div>
          </div>
        ) : filteredLetters.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-8xl mb-6">📪</div>
            <h3 className="text-3xl font-bold text-cosmic-purple mb-4">
              {searchTerm ? "Không tìm thấy thư" : "Hòm thư còn trống"}
            </h3>
            <p className="text-cosmic-purple/60 text-lg max-w-md mx-auto">
              {searchTerm
                ? "Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc."
                : "Bạn chưa có thư nào. Hãy bắt đầu viết và chia sẻ câu chuyện của mình!"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredLetters.map((letter, index) => {
              const statusInfo = getStatusDisplay(letter);
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  key={letter._id}
                  className="group relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <motion.div
                    className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 aspect-[3/4] p-6 cursor-pointer overflow-hidden relative"
                    whileHover={{
                      scale: 1.02,
                      rotateY: 5,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    onClick={() => setSelectedLetter(letter)}
                  >
                    {/* Background Pattern */}
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(74, 27, 92, 0.1) 10px, rgba(74, 27, 92, 0.1) 20px)",
                      }}
                    />

                    {/* Decorative Elements */}
                    <motion.div
                      className="absolute top-4 right-4 text-pink-400/60"
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Star size={16} />
                    </motion.div>

                    <motion.div
                      className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-70"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar
                            className="text-cosmic-purple/60"
                            size={14}
                          />
                          <span className="text-cosmic-purple/70 text-xs font-medium">
                            {timeOfPosting(letter.createdAt)}
                          </span>
                        </div>
                        <div
                          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                        >
                          <StatusIcon size={12} />
                          <span>{statusInfo.text}</span>
                        </div>
                      </div>

                      {/* Letter Content Preview */}
                      <div className="flex-1 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-4 border border-white/10 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300">
                        <div className="h-full flex items-center justify-center">
                          <p className="text-cosmic-purple text-sm leading-relaxed line-clamp-4 text-center">
                            {letter.content.length > 100
                              ? `${letter.content.substring(0, 100)}...`
                              : letter.content}
                          </p>
                        </div>
                      </div>

                      {/* Admin Review Note */}
                      {letter.adminReviewNote && (
                        <div className="mt-3 p-2 bg-red-50/80 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-xs">
                            <span className="font-semibold">Admin:</span>{" "}
                            {letter.adminReviewNote}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-1"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                    >
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLetter(letter);
                        }}
                        className="w-7 h-7 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye size={12} />
                      </motion.button>

                      {letter.status === "draft" && (
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDraft(letter._id);
                          }}
                          disabled={deleting === letter._id}
                          className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {deleting === letter._id ? (
                            <Loader className="animate-spin" size={10} />
                          ) : (
                            <Trash2 size={12} />
                          )}
                        </motion.button>
                      )}

                      {letter.status === "sent" &&
                        letter.status !== "archived" && (
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchiveLetter(letter._id);
                            }}
                            disabled={archiving === letter._id}
                            className="w-7 h-7 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {archiving === letter._id ? (
                              <Loader className="animate-spin" size={10} />
                            ) : (
                              <ArchiveIcon size={12} />
                            )}
                          </motion.button>
                        )}
                    </motion.div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="flex items-center justify-center space-x-6 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-cosmic-purple font-medium"
              whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
            >
              <ChevronLeft size={20} />
              <span>Trước</span>
            </motion.button>

            <div className="flex space-x-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <motion.button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-12 h-12 rounded-2xl font-semibold transition-all duration-300 ${
                      pageNum === currentPage
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "bg-white/20 text-cosmic-purple hover:bg-white/30"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-cosmic-purple font-medium"
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            >
              <span>Sau</span>
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Letter Detail Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLetter(null)}
          >
            <motion.div
              className="relative max-w-5xl mx-auto"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4, type: "spring" }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="relative bg-white/95 backdrop-blur-md rounded-[3rem] p-12 border border-white/30 shadow-2xl min-h-[70vh] max-h-[90vh] overflow-y-auto"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(74, 27, 92, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 27, 92, 0.02) 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                {/* Close Button */}
                <motion.button
                  onClick={() => setSelectedLetter(null)}
                  className="absolute top-6 right-6 w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg z-10"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>

                {/* Decorative Elements */}
                <motion.div
                  className="absolute top-12 left-12 text-yellow-400"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Star size={28} />
                </motion.div>

                <motion.div
                  className="absolute bottom-12 right-12 text-pink-400"
                  animate={{
                    y: [-10, 10, -10],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  <Sparkles size={24} />
                </motion.div>

                <motion.div
                  className="absolute top-1/2 left-8 text-purple-400/50"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 45, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Heart size={20} />
                </motion.div>

                {/* Content */}
                <div className="relative z-10 text-center w-full max-w-4xl mx-auto">
                  {/* Header */}
                  <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center justify-center mb-6">
                      {React.createElement(
                        getStatusDisplay(selectedLetter).icon,
                        {
                          className: `${
                            getStatusDisplay(selectedLetter).color
                          } mr-4`,
                          size: 36,
                        }
                      )}
                      <h2 className="text-4xl font-bold text-cosmic-purple">
                        Chi tiết thư
                      </h2>
                    </div>

                    <div className="flex items-center justify-center space-x-6 text-cosmic-purple/70">
                      <div className="flex items-center space-x-2">
                        <Calendar size={18} />
                        <span className="font-medium">
                          {new Date(
                            selectedLetter.createdAt
                          ).toLocaleDateString("vi-VN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="w-px h-6 bg-cosmic-purple/30"></div>
                      <div className="flex items-center space-x-2">
                        <Clock size={18} />
                        <span className="font-medium">
                          {new Date(
                            selectedLetter.createdAt
                          ).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-6 flex justify-center">
                      <div
                        className={`inline-flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold ${
                          getStatusDisplay(selectedLetter).bgColor
                        } ${getStatusDisplay(selectedLetter).color}`}
                      >
                        {React.createElement(
                          getStatusDisplay(selectedLetter).icon,
                          { size: 20 }
                        )}
                        <span>{getStatusDisplay(selectedLetter).text}</span>
                      </div>
                    </div>

                    {/* Send time if available */}
                    {selectedLetter.sentAt && (
                      <motion.div
                        className="mt-4 text-green-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <ArchiveIcon size={16} />
                          <span className="text-sm font-medium">
                            Đã gửi lúc:{" "}
                            {new Date(selectedLetter.sentAt).toLocaleString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Admin Review Note */}
                  {selectedLetter.adminReviewNote && (
                    <motion.div
                      className="mb-8 p-6 bg-red-50 border-l-4 border-red-400 rounded-2xl"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="text-red-500 mt-1" size={20} />
                        <div className="text-left">
                          <h4 className="font-bold text-red-700 mb-2">
                            Ghi chú từ Admin
                          </h4>
                          <p className="text-red-600">
                            {selectedLetter.adminReviewNote}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Letter Content */}
                  <motion.div
                    className="bg-gradient-to-br from-white/30 to-white/10 rounded-3xl p-8 border border-white/20 shadow-inner min-h-[300px] flex items-center justify-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(transparent, transparent 24px, rgba(74, 27, 92, 0.05) 24px, rgba(74, 27, 92, 0.05) 25px)",
                    }}
                  >
                    <div className="w-full">
                      <motion.p
                        className="text-lg lg:text-xl text-cosmic-purple leading-relaxed whitespace-pre-wrap text-left font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      >
                        {selectedLetter.content}
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    className="mt-10 flex justify-center space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {selectedLetter.status === "draft" && (
                      <motion.button
                        onClick={() => {
                          handleDeleteDraft(selectedLetter._id);
                        }}
                        disabled={deleting === selectedLetter._id}
                        className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg disabled:cursor-not-allowed"
                        whileHover={{
                          scale: deleting === selectedLetter._id ? 1 : 1.05,
                        }}
                        whileTap={{
                          scale: deleting === selectedLetter._id ? 1 : 0.95,
                        }}
                      >
                        {deleting === selectedLetter._id ? (
                          <>
                            <Loader className="animate-spin" size={20} />
                            <span>Đang xóa...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 size={20} />
                            <span>Xóa bản nháp</span>
                          </>
                        )}
                      </motion.button>
                    )}

                    {selectedLetter.status === "sent" &&
                      selectedLetter.status !== "archived" && (
                        <motion.button
                          onClick={() => {
                            handleArchiveLetter(selectedLetter._id);
                          }}
                          disabled={archiving === selectedLetter._id}
                          className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg disabled:cursor-not-allowed"
                          whileHover={{
                            scale: archiving === selectedLetter._id ? 1 : 1.05,
                          }}
                          whileTap={{
                            scale: archiving === selectedLetter._id ? 1 : 0.95,
                          }}
                        >
                          {archiving === selectedLetter._id ? (
                            <>
                              <Loader className="animate-spin" size={20} />
                              <span>Đang lưu trữ...</span>
                            </>
                          ) : (
                            <>
                              <ArchiveIcon size={20} />
                              <span>Lưu trữ thư</span>
                            </>
                          )}
                        </motion.button>
                      )}

                  
                  </motion.div>

                  {/* Letter Stats */}
                  <motion.div
                    className="mt-8 pt-6 border-t border-white/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center justify-center space-x-8 text-cosmic-purple/60 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-lg text-cosmic-purple">
                          {selectedLetter.content.length}
                        </div>
                        <div>Ký tự</div>
                      </div>
                      <div className="w-px h-8 bg-cosmic-purple/20"></div>
                      <div className="text-center">
                        <div className="font-semibold text-lg text-cosmic-purple">
                          {selectedLetter.content.split(" ").length}
                        </div>
                        <div>Từ</div>
                      </div>
                      
                    </div>
                  </motion.div>
                </div>

                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-[3rem] pointer-events-none" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Archive;
