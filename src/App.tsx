import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import LandingHome from './pages/LandingHome';
import CustomerPage from './customerpages/Customer';


function App() {
  

  

  return (
    <div className="min-h-screen bg-white">
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dasboard" element={<LandingHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customer" element={< CustomerPage />} />
        {/* Add more routes like this: */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>



      
    </div>
  );
}

export default App;