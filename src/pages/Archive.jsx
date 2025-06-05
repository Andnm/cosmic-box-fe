import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";

const Archive = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);

  const filters = [
    {
      id: "all",
      label: "TẤT CẢ",
      color: "bg-purple-100 text-purple-800 hover:bg-purple-300",
    },
    {
      id: "sent",
      label: "ĐÃ GỬI",
      color: "bg-green-100 text-green-800 hover:bg-green-300",
    },
    {
      id: "saved",
      label: "LƯU TRỮ",
      color: "bg-blue-100 text-blue-800 hover:bg-blue-300",
    },
  ];

  const archiveLetters = [
    {
      id: 1,
      date: "22/10/2026",
      status: "Lưu trữ",
      type: "saved",
      preview: "Hôm nay tôi cảm thấy...",
      content:
        "Hôm nay tôi cảm thấy rất hạnh phúc. Cuộc sống có những khoảnh khắc tuyệt vời mà tôi không thể quên được. Cảm ơn vì đã lắng nghe tôi.",
    },
    {
      id: 2,
      date: "28/09/2026",
      status: "Lưu trữ",
      type: "saved",
      preview: "Những suy nghĩ đêm khuya...",
      content:
        "Những đêm như thế này, tôi thường suy nghĩ về tương lai. Liệu mình có đang đi đúng hướng? Có những lúc tôi cảm thấy lạc lối, nhưng tôi tin rằng mọi thứ sẽ ổn.",
    },
    {
      id: 3,
      date: "31/08/2026",
      status: "Lưu trữ",
      type: "saved",
      preview: "Về những ước mơ...",
      content:
        "Ước mơ của tôi là được sống một cuộc đời ý nghĩa, giúp đỡ những người xung quanh và để lại dấu ấn tích cực trong lòng mọi người.",
    },
    {
      id: 4,
      date: "31/08/2026",
      status: "Đã gửi",
      type: "sent",
      preview: "Lời cảm ơn chân thành...",
      content:
        "Tôi muốn gửi lời cảm ơn chân thành đến tất cả những người đã đồng hành cùng tôi. Các bạn là ánh sáng trong cuộc đời tôi.",
    },
    {
      id: 5,
      date: "28/09/2026",
      status: "Đã gửi",
      type: "sent",
      preview: "Chia sẻ về tình bạn...",
      content:
        "Tình bạn là món quà quý giá nhất mà cuộc sống ban tặng. Những người bạn thật sự sẽ luôn ở bên bạn trong mọi hoàn cảnh.",
    },
    {
      id: 6,
      date: "22/10/2026",
      status: "Đã gửi",
      type: "sent",
      preview: "Về sự biết ơn...",
      content:
        "Mỗi ngày thức dậy là một món quà. Tôi học được cách trân trọng những điều nhỏ bé trong cuộc sống và biết ơn vì tất cả.",
    },
  ];

  const filteredLetters = archiveLetters.filter((letter) => {
    if (activeFilter === "all") return true;
    return letter.type === activeFilter;
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const openModal = (letter) => {
    setSelectedLetter(letter);
  };

  const closeModal = () => {
    setSelectedLetter(null);
  };

  const getStatusColor = (status) => {
    if (status === "Đã gửi") {
      return " text-green-800";
    } else if (status === "Lưu trữ") {
      return " text-blue-800";
    }
    return "text-cosmic-purple/70";
  };

  return (
    <div className="min-h-screen py-8 px-6 mt-6">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-8" {...fadeInUp}>
          <h1 className="text-5xl font-bold text-cosmic-purple mb-4">
            HÒM LƯU TRỮ
          </h1>
          <p className="text-cosmic-purple/80 max-w-2xl mx-auto">
            Một chiếc hòm thư lưu trữ những tâm sự mà bạn đã chia sẽ với
            CosmicBox.
          </p>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    activeFilter === filter.id
                      ? `${filter.color} text-white shadow-lg`
                      : "bg-white/20 text-cosmic-purple hover:bg-white/30"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-cosmic-purple/50" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo ngày..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-cosmic-purple placeholder-cosmic-purple/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredLetters.map((letter, index) => (
            <motion.div
              key={letter.id}
              className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 aspect-square p-6 cursor-pointer hover:bg-white/30 transition-all duration-300 group"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => openModal(letter)}
            >
              <div className="h-full flex flex-col justify-between relative">
                <div className="flex-1 bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-4 group-hover:from-white/20 group-hover:to-white/10 transition-all duration-300 relative overflow-hidden">
                  <div className="w-full h-full bg-grid-pattern opacity-20 absolute inset-0"></div>
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                       
                        <p className="text-cosmic-purple text-sm font-semibold line-clamp-2">
                          {letter.preview}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <p className="text-cosmic-purple font-medium">
                    {letter.date}
                  </p>
                  <p
                    className={`text-sm px-2 py-1 rounded-full font-medium ${getStatusColor(
                      letter.status
                    )}`}
                  >
                    {letter.status}
                  </p>
                </div>

                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-60"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex items-center justify-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300">
            <ChevronLeft className="text-cosmic-purple" size={20} />
          </button>

          <div className="flex space-x-2">
            <div className="w-8 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          </div>

          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300">
            <ChevronRight className="text-cosmic-purple" size={20} />
          </button>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main content */}
              <motion.div
                className="relative bg-white/95 backdrop-blur-md rounded-[3rem] p-16 border-2 border-cosmic-purple/20 shadow-2xl min-h-[60vh] flex items-center justify-center"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(74, 27, 92, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 27, 92, 0.03) 1px, transparent 1px)",
                  backgroundSize: "25px 25px",
                }}
                whileHover={{ scale: 1.02, rotateY: 2, rotateX: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Close button */}
                <button
                  onClick={closeModal}
                  className="absolute top-6 right-6 w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
                >
                  <X size={24} />
                </button>

                <div className="text-center w-full max-w-3xl">
                  {/* Date and status */}
                  <div className="mb-8">
                    <p className="text-2xl font-bold text-cosmic-purple mb-2">
                      {selectedLetter.date}
                    </p>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                        selectedLetter.type === "sent"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {selectedLetter.status}
                    </span>
                  </div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <p className="text-3xl lg:text-4xl font-bold text-blue-600 leading-relaxed">
                      {selectedLetter.content}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Archive;
