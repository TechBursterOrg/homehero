import { Navigate } from 'react-router-dom';

const LandingHome = () => {
  // Redirect to the new provider dashboard route
  return <Navigate to="/provider/dashboard" replace />;
};

export default LandingHome;