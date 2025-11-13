import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerificationPage from './pages/VerifyEmail';
import CustomerPage from './customerpages/Customer';
import Waitlist from './pages/Waitlist';
import ProviderLayout from './pages/Provider';
import CustomerLogin from './customerpages/Login';
import ServicesPage from './pages/ServicesPage';
import HowItWorks from './components/HowItWorks';
import HowItWorksPage from './pages/HowItWorksPage';


// Types
interface UserData {
  user: {
    isEmailVerified: boolean;
    userType: 'provider' | 'customer' | 'both';
    country?: string;
  };
  authToken: string;
}

interface RouteComponentProps {
  children: React.ReactNode;
}

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top for specific routes
    const scrollRoutes = ['/', '/services', '/how-it-works'];
    if (scrollRoutes.includes(pathname)) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

// Helper function to get and parse user data
const getUserData = (): UserData | null => {
  try {
    const authToken = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    
    if (!authToken || !userData) {
      return null;
    }
    
    const user = JSON.parse(userData);
    return { user, authToken };
  } catch (error) {
    console.error("Error parsing user data:", error);
    // Clean up corrupted data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    return null;
  }
};

// Helper function to determine redirect path based on user type
const getRedirectPath = (userType: 'provider' | 'customer' | 'both'): string => {
  if (userType === 'provider' || userType === 'both') {
    return '/provider/dashboard';
  }
  return '/customer';
};

// Protected Route Component
const ProtectedRoute: React.FC<RouteComponentProps> = ({ children }) => {
  const userData = getUserData();
  
  // Not authenticated - redirect to login
  if (!userData) {
    return <Navigate to="/login" replace />;
  }
  
  // Email not verified - redirect to verification
  if (!userData.user.isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirects authenticated users)
const PublicRoute: React.FC<RouteComponentProps> = ({ children }) => {
  const userData = getUserData();
  
  if (userData) {
    // Email not verified - allow access to verification page
    if (!userData.user.isEmailVerified) {
      return <Navigate to="/verify-email" replace />;
    }
    
    // Authenticated and verified - redirect to appropriate dashboard
    const redirectPath = getRedirectPath(userData.user.userType);
    return <Navigate to={redirectPath} replace />;
  }
  
  return <>{children}</>;
};

// Component to handle initial redirect for authenticated users
const AuthenticatedRedirect = () => {
  const userData = getUserData();
  
  if (!userData) {
    return <Navigate to="/login" replace />;
  }
  
  if (!userData.user.isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  const redirectPath = getRedirectPath(userData.user.userType);
  return <Navigate to={redirectPath} replace />;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            } 
          />
          <Route 
            path="/services" 
            element={
              <PublicRoute>
                <ServicesPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/how-it-works" 
            element={
              <PublicRoute>
                <HowItWorksPage />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/waitlist" 
            element={
              <PublicRoute>
                <Waitlist />
              </PublicRoute>
            } 
          />
          
          
          <Route 
            path="/provider-login" 
            element={
              
                <Login />
              
            } 
          />
          <Route 
            path="/login" 
            element={
              
                <CustomerLogin />
              
            } 
          />
          
          
          <Route 
            path="/verify-email" 
            element={<EmailVerificationPage />} 
          />
          
          
          <Route 
            path="/dashboard" 
            element={<AuthenticatedRedirect />} 
          />
          
          
          <Route 
            path="/customer/*" 
            element={
              <ProtectedRoute>
                <CustomerPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/provider/*" 
            element={
              <ProtectedRoute>
                <ProviderLayout />
              </ProtectedRoute>
            } 
          />
          
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;