import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-300 to-purple-600 opacity-90"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-60"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-pink-400 rounded-full opacity-40"></div>
        <div className="absolute bottom-40 left-20 w-8 h-8 bg-purple-500 rounded-full opacity-50"></div>
        <div className="absolute top-60 left-1/3 w-3 h-3 bg-white rounded-full opacity-70"></div>
        <div className="absolute bottom-60 right-1/4 w-5 h-5 bg-blue-300 rounded-full opacity-60"></div>
        <div className="absolute top-1/2 right-10 w-4 h-4 bg-pink-300 rounded-full opacity-50"></div>
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;