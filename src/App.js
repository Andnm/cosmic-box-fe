import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Inbox from './pages/Inbox';
import Archive from './pages/Archive';
import WriteLetter from './pages/WriteLetter';
import './App.css';
import Auth from './pages/Auth';
import ConnectPayment from './pages/ConnectPayment';

function App() {
  return (
    <Router>
      <div className="App cosmic-bg">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/write" element={<WriteLetter />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/connect-payment" element={<ConnectPayment />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;