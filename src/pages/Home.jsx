import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
} from "lucide-react";

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const dailyMessages = [
    "Ctrl S chưa mà tắt file :)",
    "Hôm nay bạn đã uống đủ nước chưa? 💧",
    "Đừng quên nghỉ giải lao sau mỗi giờ làm việc nhé! ✨",
    "Mỗi ngày là một cơ hội mới để tỏa sáng 🌟",
    "Hãy dành thời gian cho những điều bạn yêu thích ❤️",
    "Thành công bắt đầu từ việc tin tưởng vào bản thân 🚀",
    "Hôm nay hãy làm điều gì đó khiến bạn tự hào! 🌈",
    "Hít thở sâu một chút, mọi chuyện rồi sẽ ổn thôi 🍀",
    "Cười lên nào, bạn đang làm rất tốt rồi đấy! 😄",
    "Chậm lại một chút để cảm nhận cuộc sống 🎧",
    "Không ai là hoàn hảo, bạn chỉ cần cố gắng mỗi ngày 🌱",
    "Ngẩng đầu lên, chỉnh lại vương miện và tiếp tục bước đi 👑",
    "Một tách trà và vài phút thư giãn có thể làm nên điều kỳ diệu ☕",
    "Dù hôm nay có thế nào, bạn vẫn đáng được yêu thương 💛",
    "Đôi khi, nghỉ ngơi cũng là một phần của tiến bộ 🛌",
  ];

  const testimonials = [
    {
      text: "Viết thư cho tôi cũng trông như ý tưởng hoang đường đấy. Cảm ơn Cosmic Box đã hiểu tôi, đây là nơi tôi có thể thoải mái chia sẻ.",
      author: "User A",
    },
    {
      text: "CosmicBox đã giúp tôi kết nối với những người cùng chung suy nghĩ. Thật tuyệt vời khi có nơi để bày tỏ cảm xúc mà không sợ bị phán xét.",
      author: "User B",
    },
    {
      text: "Tôi đã tìm được bình yên trong việc viết thư ẩn danh. Cảm ơn CosmicBox vì đã tạo ra không gian an toàn này.",
      author: "User C",
    },
    {
      text: "Những lá thư tôi nhận được đã động viên tôi rất nhiều trong những ngày khó khăn. CosmicBox thật sự là món quà.",
      author: "User D",
    },
    {
      text: "Viết thư trở thành thói quen hàng ngày của tôi. Nó giúp tôi suy ngẫm và kết nối với chính mình hơn.",
      author: "User E",
    },
    {
      text: "Cảm ơn CosmicBox đã cho tôi cơ hội chia sẻ câu chuyện của mình với thế giới một cách ấm áp và chân thật.",
      author: "User F",
    },
  ];

  const [currentMessage] = useState(() => {
    return dailyMessages[Math.floor(Math.random() * dailyMessages.length)];
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(
        (prev) => (prev + 1) % Math.ceil(testimonials.length / 3)
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev + 1) % Math.ceil(testimonials.length / 3)
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) =>
        (prev - 1 + Math.ceil(testimonials.length / 3)) %
        Math.ceil(testimonials.length / 3)
    );
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full">
      <section className="h-screen flex items-center justify-center px-6 relative">
        <div className="w-full max-w-8xl mx-auto">
          <motion.div
            className="relative bg-white/10 backdrop-blur-md rounded-[4rem] p-20 border border-cosmic-purple/30 overflow-hidden text-center h-[85vh] flex flex-col justify-center"
            {...fadeInUp}
            style={{
              backgroundImage:
                "linear-gradient(rgba(74, 27, 92, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 27, 92, 0.05) 1px, transparent 1px)",
              backgroundSize: "25px 25px",
            }}
          >
            <motion.div
              className="absolute top-16 right-16 flex items-center space-x-4"
              animate={{
                y: [-12, 12, -12],
                rotate: [0, 20, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.div
                className="w-10 h-10 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.6, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Star
                  className="text-blue-800"
                  size={64}
                  style={{ stroke: "#1e40af", strokeWidth: 2 }}
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute bottom-16 left-16 flex items-center space-x-4"
              animate={{
                x: [-8, 8, -8],
                y: [0, -16, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.div
                className="w-12 h-12 bg-blue-600 rounded-full"
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 3.5, repeat: Infinity }}
              />
              <motion.div
                className="w-6 h-6 bg-pink-400 rounded-full"
                animate={{
                  y: [-4, 4, -4],
                  scale: [0.8, 1.3, 0.8],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>

            <motion.div
              className="absolute top-40 left-32 w-5 h-5 bg-yellow-400 rounded-full opacity-80"
              animate={{
                y: [-20, 20, -20],
                x: [-12, 12, -12],
                scale: [0.6, 1.4, 0.6],
              }}
              transition={{ duration: 7, repeat: Infinity }}
            />

            <motion.div
              className="absolute bottom-40 right-40 w-6 h-6 bg-purple-400 rounded-full opacity-70"
              animate={{
                rotate: [0, 360],
                scale: [0.8, 1.8, 0.8],
              }}
              transition={{ duration: 6, repeat: Infinity }}
            />

            <motion.div
              className="absolute top-1/2 left-24"
              animate={{
                rotate: [0, 180, 360],
                y: [-16, 16, -16],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <Star
                className="text-pink-300 fill-current opacity-50"
                size={32}
                style={{ stroke: "#000", strokeWidth: 2 }}
              />
            </motion.div>

            <motion.div
              className="absolute top-1/3 right-1/4"
              animate={{
                x: [-15, 15, -15],
                rotate: [0, -180, 0],
                scale: [0.8, 1.6, 0.8],
              }}
              transition={{ duration: 5.5, repeat: Infinity }}
            >
              <Sparkles className="text-blue-300 opacity-60" size={36} />
            </motion.div>

            <motion.div
              className="absolute bottom-1/3 left-1/3 w-8 h-8 border-4 border-pink-300 rounded-full opacity-50"
              animate={{
                scale: [1, 2, 1],
                rotate: [0, 360],
              }}
              transition={{ duration: 7, repeat: Infinity }}
            />

            <div className="relative z-10">
              <h1 className="text-6xl lg:text-7xl font-bold text-cosmic-purple mb-16 pearl-jean-style leading-tight">
                CHÚNG MÌNH LÀ AI?
              </h1>
              <p className="text-cosmic-purple leading-relaxed text-3xl lg:text-4xl max-w-6xl mx-auto mb-20 font-medium">
                Cosmic Box là hòm thư ẩn danh nơi bạn có thể trút hết tâm tư mà không sợ bị phán xét
              </p>

              <div className="flex flex-col lg:flex-row gap-8 justify-center">
                <Link to="/write" onClick={scrollToTop}>
                  <motion.button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-16 py-6 rounded-full font-bold transition-all duration-300 flex items-center justify-center space-x-4 shadow-2xl text-2xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>VIẾT THƯ NGAY</span>
                    <ArrowRight size={32} />
                  </motion.button>
                </Link>
                <Link to="/auth" onClick={scrollToTop}>
                  <motion.button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-16 py-6 rounded-full font-bold transition-all duration-300 shadow-2xl text-2xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>ĐĂNG NHẬP</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="h-screen flex items-center justify-center px-6 mt-20">
        <div className="w-full max-w-8xl mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-7xl lg:text-7xl font-bold text-cosmic-purple mb-20 pearl-jean-style">
              VIẾT THƯ ĐỂ LÀM GÌ NHỈ?
            </h2>

            <div className="relative max-w-7xl mx-auto">
              <motion.div
                className="bg-gradient-to-br from-purple-600/20 via-pink-500/15 to-blue-600/20 backdrop-blur-md rounded-[4rem] p-24 border border-white/30 relative overflow-hidden min-h-[60vh] flex items-center"
                whileHover={{ scale: 1.02, rotateY: 2 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="absolute top-16 left-20 w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-70"
                  animate={{ y: [-20, 20, -20] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute top-24 right-24 w-12 h-12 bg-blue-400 rounded-full opacity-80"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-20 left-32 w-10 h-10 bg-yellow-400 rounded-full opacity-90"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-28 right-20 w-20 h-20 border-4 border-pink-300 rounded-full opacity-50"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                />

                <motion.div
                  className="absolute top-1/4 left-1/4"
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 8, repeat: Infinity }}
                >
                  <Star
                    className="text-yellow-300 fill-current"
                    size={40}
                    style={{ stroke: "#000", strokeWidth: 2 }}
                  />
                </motion.div>
                <motion.div
                  className="absolute top-3/4 right-1/4"
                  animate={{ y: [-12, 12, -12] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Star
                    className="text-pink-300 fill-current"
                    size={48}
                    style={{ stroke: "#000", strokeWidth: 2 }}
                  />
                </motion.div>
                <motion.div
                  className="absolute top-1/2 right-1/6"
                  animate={{ scale: [1, 1.6, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Star
                    className="text-blue-300 fill-current"
                    size={36}
                    style={{ stroke: "#000", strokeWidth: 2 }}
                  />
                </motion.div>
                <motion.div
                  className="absolute bottom-1/3 left-1/3"
                  animate={{ rotate: [0, -180, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  <Sparkles className="text-purple-300" size={44} />
                </motion.div>

                <div className="relative z-10 text-center w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-5xl lg:text-6xl font-bold text-cosmic-purple mb-12 flex items-center justify-center gap-6 flex-wrap">
                      <Heart className="text-pink-500 fill-current" size={64} />
                      <span>Thế giới của những câu chuyện</span>
                      <Heart className="text-pink-500 fill-current" size={64} />
                    </h3>
                    <p className="text-cosmic-purple/90 leading-relaxed text-2xl lg:text-3xl max-w-6xl mx-auto font-medium">
                      Để giải bày những điều khó nói, và thấy lòng nhẹ hơn một chút
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="h-screen flex items-center justify-center px-6 mt-20">
        <div className="w-full max-w-8xl mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-7xl lg:text-7xl font-bold text-cosmic-purple mb-20 pearl-jean-style">
              THÔNG ĐIỆP HÔM NAY
            </h2>

            <div className="relative max-w-6xl mx-auto">
              <div className="absolute inset-0 transform translate-x-12 translate-y-12 -rotate-2">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 rounded-[4rem] opacity-60"></div>
              </div>

              <div className="absolute inset-0 transform translate-x-6 translate-y-6 rotate-1">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-[4rem] opacity-70"></div>
              </div>

              <motion.div
                className="relative bg-white/95 backdrop-blur-md rounded-[4rem] p-32 border-2 border-cosmic-purple/20 shadow-2xl min-h-[70vh] flex items-center justify-center"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(74, 27, 92, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 27, 92, 0.03) 1px, transparent 1px)",
                  backgroundSize: "25px 25px",
                }}
                whileHover={{ scale: 1.02, rotateY: 3, rotateX: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center">
                  <motion.p
                    className="text-5xl lg:text-6xl font-bold text-blue-600 mb-16"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    {currentMessage}
                  </motion.p>

                  <div className="flex justify-center space-x-6">
                    {[1, 2, 3].map((dot) => (
                      <motion.div
                        key={dot}
                        className="w-6 h-6 bg-purple-400 rounded-full"
                        animate={{ scale: [1, 1.8, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: dot * 0.3,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="h-screen flex items-center justify-center px-6 mt-20">
        <div className="w-full max-w-8xl mx-auto">
          <motion.div
            className="text-center h-full flex flex-col justify-center"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-7xl lg:text-7xl font-bold text-cosmic-purple mb-20 pearl-jean-style">
              VŨ TRỤ CỦA CHÚNG MÌNH
            </h2>

            <div className="relative flex-1 flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6 }}
                >
                  {testimonials
                    .slice(currentTestimonial * 3, currentTestimonial * 3 + 3)
                    .map((testimonial, idx) => (
                      <motion.div
                        key={`${currentTestimonial}-${idx}`}
                        className="bg-white/15 backdrop-blur-md rounded-[2rem] p-16 border border-white/30 min-h-[450px] flex flex-col justify-between relative overflow-hidden group"
                        whileHover={{
                          scale: 1.05,
                          rotateY: 10,
                          boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.3)",
                        }}
                        transition={{ duration: 0.4 }}
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>

                        <div className="absolute top-8 right-8">
                          <motion.div
                            animate={{ rotate: [0, 20, -20, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <Star
                              className="text-yellow-400 fill-current"
                              size={48}
                              style={{ stroke: "#000", strokeWidth: 2 }}
                            />
                          </motion.div>
                        </div>

                        <div className="relative z-10">
                          <div className="flex justify-center mb-10">
                            <div className="flex space-x-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <motion.div
                                  key={star}
                                  whileHover={{ scale: 1.3 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Star
                                    className="text-yellow-400 fill-current"
                                    size={28}
                                    style={{ stroke: "#000", strokeWidth: 2 }}
                                  />
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <p className="text-cosmic-purple text-xl lg:text-2xl text-center leading-relaxed flex-grow flex items-center mb-8 font-medium">
                            "{testimonial.text}"
                          </p>

                          <div className="text-center">
                            <p className="text-cosmic-purple/70 text-lg font-semibold">
                              - {testimonial.author}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center space-x-12 mt-16">
              <motion.button
                onClick={prevTestimonial}
                className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="text-cosmic-purple" size={40} />
              </motion.button>

              <div className="flex space-x-5">
                {Array.from({
                  length: Math.ceil(testimonials.length / 3),
                }).map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`w-6 h-6 rounded-full transition-all duration-300 ${
                      idx === currentTestimonial
                        ? "bg-purple-500 scale-150"
                        : "bg-white/40 hover:bg-white/60"
                    }`}
                    whileHover={{ scale: 1.4 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>

              <motion.button
                onClick={nextTestimonial}
                className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="text-cosmic-purple" size={40} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
