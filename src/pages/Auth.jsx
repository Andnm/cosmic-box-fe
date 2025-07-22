import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Star,
  Sparkles,
  Heart,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  ChevronLeft,
  Loader,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    phone: "",
  });

  const { login, register } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return false;
    }

    if (!isLogin) {
      if (!formData.username) {
        setError("Vui lòng nhập tên người dùng");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      let result;

      if (isLogin) {
        result = await login(formData.email, formData.password);

      } else {
        result = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        });
      }

      if (result.success) {
        addNotification({
          type: "success",
          title: isLogin ? "Đăng nhập thành công!" : "Đăng ký thành công!",
          content: `Chào mừng ${result.user.username} đến với CosmicBox`,
        });
        if (result.user.roleName === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      phone: "",
    });
    setError("");
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div className="text-center mb-12" {...fadeInUp}>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-cosmic-purple hover:text-purple-600 transition-colors mb-8"
          >
            <ChevronLeft size={24} />
            <span className="font-medium">Quay về trang chủ</span>
          </Link>

          <h1 className="text-5xl font-bold text-cosmic-purple mb-6 pearl-jean-style">
            {isLogin ? "CHÀO BẠN!" : "THAM GIA CÙNG CHÚNG MÌNH!"}
          </h1>
          <p className="text-cosmic-purple/80 text-lg max-w-2xl mx-auto">
            {isLogin
              ? "Chào mừng bạn đến với vũ trụ của chúng mình. Đăng nhập để bắt đầu nhé."
              : "Tạo tài khoản để bắt đầu hành trình chia sẻ cảm xúc cùng CosmicBox"}
          </p>
        </motion.div>

        <motion.div
          className="relative bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-cosmic-purple/30 overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            backgroundImage:
              "linear-gradient(rgba(74, 27, 92, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 27, 92, 0.05) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          {/* Animated decorations - keeping original code */}
          <motion.div
            className="absolute top-8 right-8 flex items-center space-x-2"
            animate={{
              y: [-5, 5, -5],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="w-4 h-4 bg-pink-500 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Star className="text-blue-600 fill-current" size={32} />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-8 flex items-center space-x-2"
            animate={{
              x: [-3, 3, -3],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="w-6 h-6 bg-purple-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="w-3 h-3 bg-pink-400 rounded-full"
              animate={{
                y: [-2, 2, -2],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </motion.div>

          {/* Other decorative elements - keeping original */}
          <motion.div
            className="absolute top-20 left-16 w-2 h-2 bg-yellow-400 rounded-full opacity-70"
            animate={{
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              scale: [0.5, 1, 0.5],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          <motion.div
            className="absolute bottom-20 right-20 w-3 h-3 bg-blue-400 rounded-full opacity-60"
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          <motion.div
            className="absolute top-1/2 left-12"
            animate={{
              rotate: [0, 180, 360],
              y: [-8, 8, -8],
            }}
            transition={{ duration: 7, repeat: Infinity }}
          >
            <Sparkles className="text-pink-300 opacity-40" size={16} />
          </motion.div>

          <motion.div
            className="absolute top-1/3 right-1/4"
            animate={{
              x: [-6, 6, -6],
              rotate: [0, -180, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{ duration: 4.5, repeat: Infinity }}
          >
            <Heart
              className="text-pink-300 fill-current opacity-50"
              size={18}
            />
          </motion.div>

          <div className="relative z-10 max-w-md mx-auto">
            {/* Toggle buttons */}
            <div className="flex bg-white/20 backdrop-blur-sm rounded-full p-1 mb-8 border border-white/30">
              <motion.button
                className={`flex-1 py-3 px-6 rounded-full font-medium transition-all duration-300 relative ${
                  isLogin ? "text-cosmic-purple" : "text-white"
                }`}
                onClick={() => !isLogin && toggleAuthMode()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLogin && (
                  <motion.div
                    layoutId="authToggle"
                    className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Đăng nhập</span>
              </motion.button>

              <motion.button
                className={`flex-1 py-3 px-6 rounded-full font-medium transition-all duration-300 relative ${
                  !isLogin ? "text-cosmic-purple" : "text-white"
                }`}
                onClick={() => isLogin && toggleAuthMode()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {!isLogin && (
                  <motion.div
                    layoutId="authToggle"
                    className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Đăng ký</span>
              </motion.button>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-800 text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? "login" : "register"}
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0, x: isLogin ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 50 : -50 }}
                transition={{ duration: 0.3 }}
              >
                {!isLogin && (
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cosmic-purple/60"
                        size={20}
                      />
                      <input
                        type="text"
                        name="username"
                        placeholder="Tên người dùng"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl py-4 pl-12 pr-4 text-cosmic-purple placeholder-cosmic-purple/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}

                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cosmic-purple/60"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl py-4 pl-12 pr-4 text-cosmic-purple placeholder-cosmic-purple/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                {!isLogin && (
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cosmic-purple/60"
                        size={20}
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Số điện thoại"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl py-4 pl-12 pr-4 text-cosmic-purple placeholder-cosmic-purple/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </motion.div>
                )}

                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cosmic-purple/60"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl py-4 pl-12 pr-12 text-cosmic-purple placeholder-cosmic-purple/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cosmic-purple/60 hover:text-cosmic-purple transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {!isLogin && (
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cosmic-purple/60"
                        size={20}
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Xác nhận mật khẩu"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl py-4 pl-12 pr-12 text-cosmic-purple placeholder-cosmic-purple/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                        required={!isLogin}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cosmic-purple/60 hover:text-cosmic-purple transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {isLogin && (
                  <div className="text-right">
                    <Link
                      to="/forgot-password"
                      className="text-cosmic-purple/70 hover:text-cosmic-purple text-sm transition-colors"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      <span>
                        {isLogin ? "ĐANG ĐĂNG NHẬP..." : "ĐANG ĐĂNG KÝ..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>

                {!isLogin && (
                  <motion.p
                    className="text-cosmic-purple/60 text-sm text-center leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Bằng việc đăng ký, bạn đồng ý với{" "}
                    <Link
                      to="/#"
                      className="text-cosmic-purple hover:underline"
                    >
                      Điều khoản sử dụng
                    </Link>{" "}
                    và{" "}
                    <Link
                      to="/#"
                      className="text-cosmic-purple hover:underline"
                    >
                      Chính sách bảo mật
                    </Link>{" "}
                    của chúng tôi.
                  </motion.p>
                )}
              </motion.form>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-8 border border-white/30">
            <h3 className="text-2xl font-bold text-cosmic-purple mb-4 flex items-center justify-center gap-2">
              <Sparkles className="text-yellow-400 fill-current" size={24} />
              Tại sao chọn CosmicBox?
              <Sparkles className="text-yellow-400 fill-current" size={24} />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-cosmic-purple/80">
              <div className="flex flex-col items-center space-y-2">
                <Heart className="text-pink-500 fill-current" size={32} />
                <p className="font-medium">Ẩn danh an toàn</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Star className="text-yellow-400 fill-current" size={32} />
                <p className="font-medium">Kết nối chân thật</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Sparkles className="text-purple-500" size={32} />
                <p className="font-medium">Trải nghiệm độc đáo</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
