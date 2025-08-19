import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import CustomerPage from './customerpages/Customer';
import Waitlist from './pages/Waitlist';
import ProviderLayout from './pages/Provider';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Navigate to="/provider/dashboard" replace />} />
          <Route path="/customer/*" element={<CustomerPage />} />
          <Route path="/provider/*" element={<ProviderLayout />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;