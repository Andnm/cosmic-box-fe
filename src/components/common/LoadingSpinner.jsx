import React from 'react';
import { motion } from 'framer-motion';
import { Loader, Sparkles } from 'lucide-react';

const LoadingSpinner = ({ message = "Đang tải..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-cosmic-purple/20 border-t-cosmic-purple rounded-full mx-auto mb-4" />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="text-cosmic-purple" size={24} />
          </motion.div>
        </motion.div>
        
        <motion.p
          className="text-cosmic-purple font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingSpinner;