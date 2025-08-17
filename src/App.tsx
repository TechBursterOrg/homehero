import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import LandingHome from './pages/LandingHome';
import CustomerPage from './customerpages/Customer';
import Waitlist from './pages/Waitlist';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/dashboard" element={<LandingHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/customer" element={<CustomerPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;