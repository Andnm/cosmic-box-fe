import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Crown, 
  CheckCircle, 
  Star, 
  Mail, 
  Archive, 
  Sparkles,
  CreditCard,
  Loader2,
  Gift
} from "lucide-react";
import { usersAPI } from "../services/api";
import { useAuth } from "../context/AuthContext"; 
import { toast } from "react-hot-toast";

const MembershipPage = () => {
  const { user } = useAuth();
  const [membershipData, setMembershipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    fetchMembershipData();
  }, []);

  const fetchMembershipData = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getMembership();
      setMembershipData(response.data);
    } catch (error) {
      console.error("Error fetching membership data:", error);
      toast.error("Không thể tải thông tin membership");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeVip = async () => {
    try {
      setUpgrading(true);
      const response = await usersAPI.upgradeVip();
      console.log("response: ", response)
      if (response.data.paymentLink?.paymentUrl) {
        window.location.href = response.data.paymentLink.paymentUrl;
      } else {
        toast.error("Không thể tạo link thanh toán");
      }
    } catch (error) {
      console.error("Error upgrading to VIP:", error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Có lỗi xảy ra khi nâng cấp VIP");
      }
    } finally {
      setUpgrading(false);
    }
  };

  const membershipPlans = [
    {
      name: "BASIC",
      type: "basic",
      price: "Miễn phí",
      popular: false,
      features: [
        { icon: Mail, text: "Gửi 1 lá thư mỗi ngày", included: true },
        { icon: Archive, text: "Lưu trữ tối đa 3 lá thư mỗi ngày", included: true },
        { icon: Mail, text: "Nhận tối đa 1 lá thư mỗi ngày", included: true },
        { icon: Star, text: "Gửi 10 lá thư mỗi ngày", included: false },
        { icon: Crown, text: "Nhận không giới hạn lá thư mỗi ngày", included: false },
        { icon: Sparkles, text: "Ưu tiên hỗ trợ", included: false }
      ]
    },
    {
      name: "VIP",
      type: "vip",
      price: "60.000đ",
      popular: true,
      features: [
        { icon: Mail, text: "Gửi 10 lá thư mỗi ngày", included: true },
        { icon: Mail, text: "Lưu trữ không giới hạn", included: true },
        { icon: Mail, text: "Nhận không giới hạn lá thư mỗi ngày", included: true },
        { icon: Crown, text: "Huy hiệu VIP đặc biệt", included: true },
        { icon: Sparkles, text: "Ưu tiên hỗ trợ", included: true },
        { icon: Gift, text: "Tính năng độc quyền", included: true },
        { icon: Star, text: "Không giới hạn thời gian", included: true }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-cosmic-purple">
          <Loader2 className="animate-spin" size={32} />
          <span className="text-xl font-medium">Đang tải...</span>
        </div>
      </div>
    );
  }

  const currentPlan = membershipData?.membership || "basic";
  const isVip = currentPlan === "vip";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Crown className="text-yellow-500" size={48} />
              <h1 className="text-5xl lg:text-6xl font-bold text-cosmic-purple pearl-jean-style leading-tight">
                MEMBERSHIP
              </h1>
            </div>
            
            <p className="text-cosmic-purple/80 text-xl lg:text-2xl max-w-3xl mx-auto mb-8">
              Chọn gói membership phù hợp để tận hưởng trải nghiệm tốt nhất tại CosmicBox
            </p>

            {/* Current Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center space-x-3 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-cosmic-purple/20"
            >
              {isVip ? (
                <>
                  <Crown className="text-yellow-500" size={24} />
                  <span className="text-cosmic-purple font-semibold">
                    Bạn đang là thành viên VIP
                  </span>
                </>
              ) : (
                <>
                  <Star className="text-cosmic-purple" size={24} />
                  <span className="text-cosmic-purple font-semibold">
                    Bạn đang là thành viên Basic
                  </span>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Membership Plans */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {membershipPlans.map((plan, index) => (
            <motion.div
              key={plan.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-2xl ${
                plan.popular
                  ? "border-yellow-400 shadow-xl scale-105"
                  : "border-cosmic-purple/20 hover:border-cosmic-purple/40"
              } ${
                currentPlan === plan.type ? "ring-4 ring-cosmic-purple/30" : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                    PHỔ BIẾN NHẤT
                  </div>
                </div>
              )}

              {/* Current Plan Badge */}
              {currentPlan === plan.type && (
                <div className="absolute -top-4 right-4">
                  <div className="bg-cosmic-purple text-white px-4 py-2 rounded-full text-sm font-bold">
                    GÓI HIỆN TẠI
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  {plan.type === "vip" ? (
                    <Crown className="text-yellow-500" size={48} />
                  ) : (
                    <Star className="text-cosmic-purple" size={48} />
                  )}
                </div>
                <h3 className="text-3xl font-bold text-cosmic-purple mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-cosmic-purple mb-4">
                  {plan.price}
                </div>
                {plan.type === "vip" && (
                  <p className="text-cosmic-purple/60 text-sm">
                    Thanh toán một lần, sử dụng vĩnh viễn
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className={`flex items-center space-x-3 ${
                      feature.included ? "text-cosmic-purple" : "text-gray-400"
                    }`}
                  >
                    {feature.included ? (
                      <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    )}
                    <feature.icon className="flex-shrink-0" size={16} />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="text-center">
                {plan.type === "basic" ? (
                  <div className="text-cosmic-purple/60 text-sm font-medium py-4">
                    Gói miễn phí mặc định
                  </div>
                ) : currentPlan === "vip" ? (
                  <div className="bg-green-100 text-green-700 py-4 rounded-2xl font-medium">
                    ✨ Bạn đã là thành viên VIP
                  </div>
                ) : (
                  <motion.button
                    onClick={handleUpgradeVip}
                    disabled={upgrading}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: upgrading ? 1 : 1.02 }}
                    whileTap={{ scale: upgrading ? 1 : 0.98 }}
                  >
                    {upgrading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        <span>NÂNG CẤP VIP NGAY</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-20 text-center"
        >
          <h2 className="text-4xl font-bold text-cosmic-purple mb-8">
            Tại sao nên chọn VIP?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Mail,
                title: "Gửi nhiều hơn",
                description: "10 lá thư mỗi ngày thay vì giới hạn của Basic"
              },
              {
                icon: Crown,
                title: "Nhận nhiều hơn",
                description: "Nhận không giới hạn thư mỗi ngày từ cộng đồng"
              },
              {
                icon: Sparkles,
                title: "Trải nghiệm cao cấp",
                description: "Ưu tiên hỗ trợ và các tính năng độc quyền"
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-cosmic-purple/20 hover:border-cosmic-purple/40 transition-all duration-300"
              >
                <benefit.icon className="text-cosmic-purple mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold text-cosmic-purple mb-2">
                  {benefit.title}
                </h3>
                <p className="text-cosmic-purple/70">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MembershipPage;