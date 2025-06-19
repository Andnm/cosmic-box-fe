import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Inbox from './pages/Inbox';
import Archive from './pages/Archive';
import WriteLetter from './pages/WriteLetter';
import Auth from './pages/Auth';
import ConnectPayment from './pages/ConnectPayment';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <Router>
      <div className="App cosmic-bg">
        <AuthProvider>
          <NotificationProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected Routes */}
                <Route path="/inbox" element={
                  <ProtectedRoute>
                    <Inbox />
                  </ProtectedRoute>
                } />
                <Route path="/archive" element={
                  <ProtectedRoute>
                    <Archive />
                  </ProtectedRoute>
                } />
                <Route path="/write" element={
                  <ProtectedRoute>
                    <WriteLetter />
                  </ProtectedRoute>
                } />
                <Route path="/connect-payment" element={
                  <ProtectedRoute>
                    <ConnectPayment />
                  </ProtectedRoute>
                } />
                
                {/* Catch all route */}
                <Route path="*" element={<Home />} />
              </Routes>
            </Layout>
          </NotificationProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;