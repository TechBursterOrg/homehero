import { useState } from "react";
import {
  Home,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "customer",
  });

  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Only handle login authentication
    if (isLogin) {
      // Check if email and password fields are filled
      if (!formData.email.trim() || !formData.password.trim()) {
        setError("Please enter both email and password to login.");
        return;
      }

      // Check credentials
      if (formData.email === "techuredev@gmail.com" && formData.password === "Password123") {
        // Redirect based on user type selection - FIXED TYPO
        if (formData.userType === "provider") {
          navigate("/dashboard"); // Fixed: was "/dasboard"
        } else {
          navigate("/customer");
        }
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } else {
      // Handle sign up logic
      if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
        setError("Please fill in all required fields.");
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      
      console.log("Sign up form submitted:", formData);
      // Reset form and switch to login
      setIsLogin(true);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        userType: "customer",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
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
              Connect with trusted service providers or start your journey as a
              professional provider today.
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

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div
            className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 p-8 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
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
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                  isLogin
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
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
                      required={!isLogin}
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
                    placeholder="Enter your password"
                    required
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
                <div className="animate-fade-in-up">
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
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="animate-fade-in-up">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Login as
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                  >
                    <option value="customer">Customer</option>
                    <option value="provider">Service Provider</option>
                  </select>
                </div>
              )}

              {!isLogin && (
                <div className="animate-fade-in-up">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I want to...
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                  >
                    <option value="customer">Find Services (Customer)</option>
                    <option value="provider">
                      Provide Services (Provider)
                    </option>
                  </select>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-600">Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center group"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>
                <button className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>
            </div>

            {/* Footer Text */}
            <p className="mt-8 text-center text-sm text-gray-600">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
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