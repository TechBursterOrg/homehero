// LoginPage.tsx - STANDALONE WORKING VERSION
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  Star,
  MessageSquare,
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "provider",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  // SIMULATED AUTH - Works without backend
  const simulateAuth = async (isLogin: boolean) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (isLogin) {
          // Simulate login success
          resolve({
            success: true,
            data: {
              token: 'simulated-token-' + Date.now(),
              user: {
                id: 'user-' + Date.now(),
                name: formData.name || 'Test User',
                email: formData.email,
                userType: formData.userType
              }
            }
          });
        } else {
          // Simulate signup success
          resolve({
            success: true,
            data: {
              token: 'simulated-token-' + Date.now(),
              user: {
                id: 'user-' + Date.now(),
                name: formData.name,
                email: formData.email,
                userType: formData.userType
              }
            }
          });
        }
      }, 1500);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login validation
        if (!formData.email.trim() || !formData.password.trim()) {
          setError("Please enter both email and password.");
          setIsLoading(false);
          return;
        }

        const result: any = await simulateAuth(true);
        
        if (result.success) {
          setSuccessMessage(`Login successful! Welcome back, ${result.data.user.name}!`);
          
          // Store simulated user data
          localStorage.setItem('authToken', result.data.token);
          localStorage.setItem('userData', JSON.stringify(result.data.user));
          
          setTimeout(() => {
            if (result.data.user.userType === 'provider' || result.data.user.userType === 'both') {
              navigate('/provider/dashboard');
            } else {
              navigate('/customer');
            }
          }, 1000);
        }
      } else {
        // Signup validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
          setError("Please fill in all required fields.");
          setIsLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters long.");
          setIsLoading(false);
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setError("Please enter a valid email address.");
          setIsLoading(false);
          return;
        }

        const result: any = await simulateAuth(false);
        
        if (result.success) {
          setSuccessMessage("Account created successfully! Redirecting...");
          
          // Store simulated user data
          localStorage.setItem('authToken', result.data.token);
          localStorage.setItem('userData', JSON.stringify(result.data.user));
          
          setTimeout(() => {
            if (result.data.user.userType === 'provider' || result.data.user.userType === 'both') {
              navigate('/provider/dashboard');
            } else {
              navigate('/customer');
            }
          }, 2000);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2220%22%20height=%2220%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id=%22grid%22%20width=%2220%22%20height=%2220%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M%2020%200%20L%200%200%200%2020%22%20fill=%22none%22%20stroke=%22%23e5e7eb%22%20stroke-width=%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20fill=%22url(%23grid)%22/%3E%3C/svg%3E')] opacity-30"></div>

      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 animate-fade-in-up">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <Home className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              HomeHero
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Welcome to Your
              <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Home Services Hub
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Start your journey as a professional provider today.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  Verified Providers
                </h3>
                <p className="text-sm text-gray-600">
                  All professionals are background-checked
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <Star className="w-8 h-8 text-yellow-500 fill-current" />
              <div>
                <h3 className="font-semibold text-gray-900">5-Star Reviews</h3>
                <p className="text-sm text-gray-600">
                  Trusted by 10,000+ homeowners
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login/Signup Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 p-8 animate-fade-in-up">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                HomeHero
              </span>
            </div>

            {/* Toggle Buttons */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                  isLogin
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                  !isLogin
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="animate-fade-in-up">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                      placeholder="Enter your full name"
                      required
                      minLength={2}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                    placeholder={isLogin ? "Enter your password" : "Enter your password (min. 6 characters)"}
                    required
                    minLength={isLogin ? 1 : 6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                      placeholder="Confirm your password"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isLogin ? "Login as" : "I want to..."}
                </label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                >
                  <option value="customer">Find Services (Customer)</option>
                  <option value="provider">Provide Services (Provider)</option>
                  <option value="both">Both (Customer & Provider)</option>
                </select>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm animate-fade-in-up">
                  {successMessage}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-fade-in-up">
                  {error}
                </div>
              )}

              {/* Development Notice */}
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl text-sm">
                <strong>Development Mode:</strong> Using simulated authentication. Backend JWT issues detected.
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {/* Footer Text */}
            <p className="mt-8 text-center text-sm text-gray-600">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccessMessage("");
                }}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                {isLogin ? "Sign up here" : "Sign in here"}
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;