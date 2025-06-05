import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Wallet,
  Building,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const SendLetter = () => {
  const [selectedPayment, setSelectedPayment] = useState("Bank");

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
          <Link to="/" className="mr-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300">
              <ArrowLeft className="text-cosmic-purple" size={20} />
            </div>
          </Link>
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

      <div className="max-w-4xl mx-auto text-center mt-10">
        <p className="text-cosmic-purple/80 mb-6">
          Gửi một lời chào đến người nhận nhé.
        </p>
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 min-h-[120px] p-4">
          <textarea
            placeholder="Nhập tin nhắn của bạn..."
            className="w-full h-full bg-transparent text-cosmic-purple placeholder-cosmic-purple/50 resize-none outline-none"
          />
        </div>
        <Link to="/write">
          <motion.button
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            GỬI THƯ
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default SendLetter;
