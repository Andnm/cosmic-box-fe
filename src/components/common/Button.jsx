import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  leftIcon,
  rightIcon,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent';
  
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
    secondary: 'bg-pink-500 hover:bg-pink-600 text-white focus:ring-pink-500',
    tertiary: 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500',
    outline: 'bg-transparent border-2 border-white/30 text-cosmic-purple hover:bg-white/10 focus:ring-white',
    ghost: 'bg-white/10 backdrop-blur-md text-cosmic-purple hover:bg-white/20 focus:ring-white'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  
  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled ? disabledClasses : ''}
    ${className}
  `.trim();

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <motion.button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.05 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.95 } : undefined}
      {...props}
    >
      {loading && (
        <div className="spinner mr-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      )}
      
      {leftIcon && !loading && (
        <span className="mr-2">
          {leftIcon}
        </span>
      )}
      
      <span>{children}</span>
      
      {rightIcon && !loading && (
        <span className="ml-2">
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
};

export default Button;