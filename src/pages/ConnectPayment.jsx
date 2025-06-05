import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Wallet,
  Building,
  Send,
  Heart,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const ConnectPayment = () => {
  const [selectedPayment, setSelectedPayment] = useState("Bank");
  const [message, setMessage] = useState("");

  const paymentMethods = [
    { id: "Bank", label: "Bank", icon: Building },
    { id: "Momo", label: "Momo", icon: Smartphone },
    { id: "Zalopay", label: "Zalopay", icon: CreditCard },
    { id: "VNPAY", label: "VNPAY", icon: Wallet },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div className="flex items-center mb-8" {...fadeInUp}>
          <button className="mr-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300">
              <ArrowLeft className="text-cosmic-purple" size={20} />
            </div>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                trở phí để gửi cho họ yêu cầu kết nối với bạn nhé!
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30">
              <div className="text-center mb-6">
                <div className="w-60 h-60 mx-auto bg-white rounded-xl p-4 shadow-lg flex justify-center items-center">
                  <QRCodeSVG
                    value="https://cosmicbox.example.com/connect/123456"
                    size={180}
                    level="M"
                    includeMargin={false}
                  />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-cosmic-purple text-center mb-4">
                QUÉT TỚ NHÉ!
              </h2>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h2 className="text-xl font-bold text-cosmic-purple mb-6">
                LỰA CHỌN HÌNH THỨC THANH TOÁN NÈ
              </h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <motion.div
                      key={method.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedPayment === method.id
                          ? "bg-white/20 border-blue-400 backdrop-blur-md"
                          : "bg-white/10 border-white/20 hover:bg-white/15"
                      }`}
                      onClick={() => setSelectedPayment(method.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 ${
                            selectedPayment === method.id
                              ? "border-blue-400 bg-blue-400"
                              : "border-cosmic-purple/50"
                          }`}
                        >
                          {selectedPayment === method.id && (
                            <div className="w-full h-full rounded-full bg-white/30"></div>
                          )}
                        </div>
                        <IconComponent
                          className="text-cosmic-purple"
                          size={20}
                        />
                        <span className="text-cosmic-purple font-medium">
                          {method.label}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="text-cosmic-purple/70">STK: 1381****</p>
                  <p className="text-cosmic-purple/70">
                    Tên Tài Khoản: ************
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-cosmic-purple/70">
                    Nội Dung Chuyển Khoản:
                  </p>
                  <p className="text-cosmic-purple font-medium">
                    COSMICBOX-PHI CONTACT
                  </p>
                </div>
              </div>
              <p className="text-xs text-cosmic-purple/60 mt-4 italic">
                *Kiểm tra thật kĩ thông tin tài khoản trước khi thực hiện giao
                dịch nhé cả nhà yêu!*
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Message Section */}
      <motion.div
        className="max-w-4xl mx-auto mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 relative overflow-hidden">
          {/* Decorative elements */}
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
              />
            </div>

            {/* Character counter and send button */}
            <div className="bg-white/10 px-6 py-4 flex items-center justify-between border-t border-white/20">
              <span className="text-cosmic-purple/60 text-sm">
                {message.length}/500 ký tự
              </span>

              <motion.button
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!message.trim()}
              >
                <Send size={16} />
                <span>GỬI THƯ</span>
              </motion.button>
            </div>
          </div>

          {/* Quick message templates */}
          <div className="mt-6">
            <p className="text-cosmic-purple/70 text-sm mb-3 text-center">
              Gợi ý tin nhắn nhanh:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Chào bạn! Mình rất muốn làm quen 🤝",
                "Câu chuyện của bạn thật cảm động ❤️",
                "Hy vọng chúng ta có thể trò chuyện nhiều hơn ✨",
              ].map((template, index) => (
                <motion.button
                  key={index}
                  onClick={() => setMessage(template)}
                  className="bg-white/10 hover:bg-white/20 text-cosmic-purple px-4 py-2 rounded-full text-sm transition-all duration-300 border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
