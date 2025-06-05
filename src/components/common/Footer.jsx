import React from "react";
import { Mail, Phone, Facebook, Instagram } from "lucide-react";
import logoCosmicBox from "../../assets/images/logo-cosmic.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gradient-to-br from-blue-800 via-purple-800 to-fuchsia-800 text-white py-8 px-6 relative overflow-hidden">
      {/* Cosmic stars effect */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-6">
              <div className="relative">
                <img
                  src={logoCosmicBox}
                  alt="CosmicBox Logo"
                  className="w-16 h-16 object-contain drop-shadow-lg"
                />
                <div className="absolute top-2 left-1 w-14 h-14 border-2 border-purple-400 rounded-full opacity-60 animate-spin-slow"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-fuchsia-400 rounded-full"></div>
              </div>
              <div>
                <span className="text-2xl font-bold text-blue-300">Cosmic</span>
                <span className="text-2xl font-bold text-purple-300">Box</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-3 border border-blue-600/30 hover:border-blue-400 transition-all">
                <Link to="/write" onClick={scrollToTop}>
                  <p className="font-medium">VIẾT THƯ</p>
                </Link>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-3 border border-purple-600/30 hover:border-purple-400 transition-all">
                <Link to="/inbox" onClick={scrollToTop}>
                  <p className="font-medium">HỘP THƯ</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <h3 className="font-bold text-lg mb-6 text-blue-100">
              LIÊN HỆ VỚI CHÚNG MÌNH
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3 bg-black/20 backdrop-blur-sm rounded-lg px-4 py-3 border border-blue-600/30 hover:border-blue-400 transition-all">
                <Facebook size={18} className="text-blue-300" />
                <span className="font-medium">COSMICBOX</span>
              </div>
              <div className="flex items-center justify-center space-x-3 bg-black/20 backdrop-blur-sm rounded-lg px-4 py-3 border border-purple-600/30 hover:border-purple-400 transition-all">
                <Instagram size={18} className="text-pink-300" />
                <span className="font-medium">COSMICBOX</span>
              </div>
              <div className="flex items-center justify-center space-x-3 bg-black/20 backdrop-blur-sm rounded-lg px-4 py-3 border border-fuchsia-600/30 hover:border-fuchsia-400 transition-all">
                <Mail size={18} className="text-cyan-300" />
                <span className="font-medium">cosmicbox@gmail.com</span>
              </div>
              <div className="flex items-center justify-center space-x-3 bg-black/20 backdrop-blur-sm rounded-lg px-4 py-3 border border-blue-600/30 hover:border-blue-400 transition-all">
                <Phone size={18} className="text-green-300" />
                <span className="font-medium">0904171831</span>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="text-center md:text-right">
            <h3 className="font-bold text-lg mb-6 text-purple-100">
              HỘP THƯ GÓP Ý
            </h3>
            <div className="bg-black/25 backdrop-blur-sm rounded-xl p-4 border border-purple-600/30 shadow-lg">
              <textarea
                className="w-full h-24 bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-purple-600/30 resize-none placeholder-purple-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Nhập góp ý của bạn..."
              />
            </div>
            <button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              GỬI →
            </button>
          </div>
        </div>
      </div>

      {/* Animation style */}
      <style jsx>{`
        @keyframes twinkle {
          0% {
            opacity: 0.2;
          }
          100% {
            opacity: 0.8;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
