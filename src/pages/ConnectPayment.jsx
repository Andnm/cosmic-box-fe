import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Heart,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Ticket,
  Gift,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { connectionsAPI, usersAPI } from "../services/api";

const ConnectPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const receiverInfo = location.state?.receiver || null;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [paymentLink, setPaymentLink] = useState(null);
  const [userTickets, setUserTickets] = useState(0);
  const [useTicket, setUseTicket] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await usersAPI.getMyProfile();
      setUserTickets(response.data.user.ticket);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const handleSendRequest = async () => {
    if (!message.trim()) {
      setError("Vui lòng nhập lời nhắn để gửi yêu cầu kết nối");
      return;
    }

    if (!receiverInfo?.id) {
      setError("Không tìm thấy thông tin người nhận. Vui lòng thử lại.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await connectionsAPI.createRequest({
        receiverId: receiverInfo.id,
        message: message.trim(),
      });

      setSuccess(true);
      setPaymentLink(response.data.paymentLink?.paymentUrl);

      setTimeout(() => {
        if (response.data.paymentLink?.paymentUrl) {
          window.location.href = response.data.paymentLink.paymentUrl;
        } else {
          navigate("/inbox");
        }
      }, 2000);
    } catch (err) {
      console.error("Error creating connection request:", err);
      setError(
        err.response?.data?.error ||
          "Không thể gửi yêu cầu kết nối. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const quickMessages = [
    "Chào bạn! Mình rất muốn làm quen 🤝",
    "Câu chuyện của bạn thật cảm động ❤️",
    "Hy vọng chúng ta có thể trò chuyện nhiều hơn ✨",
    "Mình cảm thấy chúng ta có nhiều điểm chung 🌟",
    "Rất mong được chia sẻ và lắng nghe từ bạn 💫",
  ];

  if (success) {
    return (
      <div className="min-h-screen py-8 px-6 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-cosmic-purple mb-4">
            Yêu cầu kết nối đã được tạo!
          </h2>
          <p className="text-cosmic-purple/80 mb-6">
            {paymentLink
              ? "Đang chuyển hướng đến trang thanh toán..."
              : "Yêu cầu của bạn đã được gửi thành công!"}
          </p>
          {loading && (
            <Loader2 className="w-8 h-8 animate-spin text-cosmic-purple mx-auto" />
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div className="flex items-center justify-between mb-8" {...fadeInUp}>
          <button className="mr-4">
            <div
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
              onClick={() => navigate("/inbox")}
            >
              <ArrowLeft className="text-cosmic-purple" size={20} />
            </div>
          </button>

          {userTickets > 0 && (
            <motion.div
              className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-md px-4 py-2 rounded-full border border-yellow-400/30"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Ticket className="text-orange-500" size={20} />
              <span className="text-cosmic-purple font-semibold">
                {userTickets} Ticket
              </span>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-12">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold text-cosmic-purple mb-4">
                KẾT NỐI NGƯỜI GỬI THƯ
              </h1>
              <p className="text-cosmic-purple/80 leading-relaxed">
                Để có thể kết nối với trò chuyện với người gửi thư thì bạn cần
                trả phí để gửi cho họ yêu cầu kết nối với bạn nhé!
              </p>

              {receiverInfo && (
                <motion.div
                  className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <User className="text-cosmic-purple" size={20} />
                    <span className="text-cosmic-purple font-medium">
                      Gửi yêu cầu kết nối đến:{" "}
                      {receiverInfo.username || "Người dùng"}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {error && (
              <motion.div
                className="bg-red-100/20 border border-red-300/30 rounded-2xl p-4 flex items-center space-x-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="text-red-400" size={20} />
                <span className="text-red-400">{error}</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="mt-8 bg-blue-50/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/30 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-center">
          <h4 className="text-lg font-semibold text-cosmic-purple mb-2">
            💰 Phí kết nối
          </h4>
          <p className="text-cosmic-purple/80 text-sm mb-3">
            Phí để gửi yêu cầu kết nối là{" "}
            <span className="font-bold text-blue-600">20.000 VNĐ</span>
          </p>
          
          {userTickets > 0 ? (
            <div className="mt-4 p-3 bg-yellow-50/20 rounded-xl border border-yellow-300/30">
              <p className="text-cosmic-purple/80 text-sm font-medium mb-2">
                🎫 Bạn có {userTickets} ticket miễn phí!
              </p>
              <p className="text-cosmic-purple/60 text-xs">
                Sử dụng ticket để gửi yêu cầu kết nối mà không cần thanh toán
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              <p className="text-cosmic-purple/60 text-xs">
                Sau khi gửi yêu cầu, bạn sẽ được chuyển đến trang thanh toán để hoàn
                tất quá trình.
              </p>
              <div className="flex items-center justify-center space-x-2 text-purple-600">
                <Gift size={16} />
                <p className="text-xs font-medium">
                  Nếu yêu cầu bị từ chối, Cosmic Box sẽ tặng bạn 1 ticket miễn phí cho lần sau!
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        className="max-w-4xl mx-auto mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 relative overflow-hidden">
          <motion.div
            className="absolute top-6 right-8 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-60"
            animate={{ y: [-5, 5, -5], rotate: [0, 180, 360] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-6 left-8 w-6 h-6 bg-blue-400 rounded-full opacity-70"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Heart className="text-pink-500 fill-current" size={24} />
              <h3 className="text-2xl font-bold text-cosmic-purple">
                GỬI LỜI CHÀO ĐẾN NGƯỜI NHẬN NHÉ
              </h3>
              <Heart className="text-pink-500 fill-current" size={24} />
            </div>
            <p className="text-cosmic-purple/80">
              Hãy viết vài dòng để giới thiệu bản thân và thể hiện sự chân thành
              của bạn 💫
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-2xl border-2 border-white/30 overflow-hidden focus-within:border-blue-400/50 transition-all duration-300">
            <div className="p-6">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Xin chào! Mình rất đồng cảm với câu chuyện của bạn và hy vọng chúng ta có thể kết nối với nhau. Rất mong được làm quen nhé! 🌟"
                className="w-full h-32 bg-transparent text-cosmic-purple placeholder-cosmic-purple/50 resize-none outline-none text-lg leading-relaxed"
                maxLength={500}
                disabled={loading}
              />
            </div>

            <div className="bg-white/10 px-6 py-4 flex items-center justify-between border-t border-white/20">
              <span className="text-cosmic-purple/60 text-sm">
                {message.length}/500 ký tự
              </span>

              <motion.button
                onClick={handleSendRequest}
                className={`${
                  userTickets > 0 
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600" 
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                } text-white px-6 py-2 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={!loading && !message.trim() ? {} : { scale: 1.05 }}
                whileTap={!loading && !message.trim() ? {} : { scale: 0.95 }}
                disabled={loading || !message.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>ĐANG GỬI...</span>
                  </>
                ) : (
                  <>
                    {userTickets > 0 ? (
                      <>
                        <Ticket size={16} />
                        <span>DÙNG TICKET GỬI</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>GỬI YÊU CẦU</span>
                      </>
                    )}
                  </>
                )}
              </motion.button>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-cosmic-purple/70 text-sm mb-3 text-center">
              Gợi ý tin nhắn nhanh:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickMessages.map((template, index) => (
                <motion.button
                  key={index}
                  onClick={() => setMessage(template)}
                  className="bg-white/10 hover:bg-white/20 text-cosmic-purple px-4 py-2 rounded-full text-sm transition-all duration-300 border border-white/20 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  {template}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConnectPayment;