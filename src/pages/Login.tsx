// LoginPage.tsx - DEBUG VERSION
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

interface VerificationData {
  token: string;
  email: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  errors?: any[];
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentStep, setCurrentStep] = useState<"signup" | "verify" | "complete">("signup");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "provider",
  });
  const [verificationData, setVerificationData] = useState<VerificationData>({
    token: "",
    email: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backendhomeheroes.onrender.com";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleVerificationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVerificationData({
      ...verificationData,
      [name]: value,
    });
  };

  const makeApiCall = async (endpoint: string, data: any): Promise<ApiResponse> => {
    console.log(`🌐 Making API call to: ${API_BASE_URL}/api/auth/${endpoint}`);
    console.log(`📤 Sending data:`, JSON.stringify(data, null, 2));
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log(`📥 Response status: ${response.status} ${response.statusText}`);
      
      const result: ApiResponse = await response.json();
      console.log(`📥 Response data:`, JSON.stringify(result, null, 2));
      
      if (!response.ok) {
        console.error(`🔴 API Error Response:`, result);
        
        if (result.errors && Array.isArray(result.errors)) {
          const errorDetails = result.errors.map((err: any) => {
            if (typeof err === 'string') return err;
            return `${err.field || ''}: ${err.message || JSON.stringify(err)}`;
          }).join(', ');
          throw new Error(`Validation failed: ${errorDetails}`);
        }
        
        const errorMessage = result.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      return result;
    } catch (error: any) {
      console.error('🔴 API Call Error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to server at ${API_BASE_URL}. Please check if the backend is running.`);
      }
      throw error;
    }
  };

  const sendVerificationToken = async (email: string) => {
    try {
      setIsLoading(true);
      setError("");

      console.log('📧 Sending verification token to email:', email);
      console.log('🔍 Email before sending:', email.trim().toLowerCase());

      // Make sure verificationData has the email
      setVerificationData(prev => ({
        ...prev,
        email: email.trim().toLowerCase()
      }));

      const result = await makeApiCall('send-verification', {
        email: email.trim().toLowerCase()
      });

      if (result.success) {
        // Always show the verification code prominently
        const debugToken = result.data?.debugToken;
        if (debugToken) {
          console.log('🔑 Debug Token received:', debugToken);
          console.log('🔑 Token type:', typeof debugToken);
          console.log('🔑 Token length:', debugToken.length);
          
          // Auto-fill the verification code for easier testing
          setVerificationData({
            token: debugToken.toString(), // Ensure it's a string
            email: email.trim().toLowerCase() // Make sure email is set
          });
        } else {
          setSuccessMessage(`Verification code sent to ${email}. Please check your email.`);
        }
        
        setCurrentStep("verify");
      }
    } catch (error: any) {
      console.error('❌ Send verification error:', error);
      setError(error.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Validate that we have both email and token
      const emailToVerify = verificationData.email || formData.email;
      const tokenToVerify = verificationData.token;
      
      if (!emailToVerify || !tokenToVerify) {
        setError("Email and verification token are required. Please try again.");
        return;
      }

      console.log('✅ Verifying email:', { 
        email: emailToVerify, 
        token: tokenToVerify,
        emailType: typeof emailToVerify,
        tokenType: typeof tokenToVerify,
        tokenLength: tokenToVerify.length
      });

      // Ensure data is properly formatted
      const verificationPayload = {
        email: emailToVerify.trim().toLowerCase(),
        token: tokenToVerify.trim()
      };

      console.log('📤 Final verification payload:', verificationPayload);

      const result = await makeApiCall('verify-email', verificationPayload);

      if (result.success) {
        setSuccessMessage("Email verified successfully!");
        setCurrentStep("complete");
        
        // Complete the signup process
        await completeSignup();
      }
    } catch (error: any) {
      console.error('❌ Verify email error:', error);
      
      // More specific error handling
      if (error.message.includes('Email and verification token are required')) {
        setError("Verification failed: Missing email or token. Please try again.");
      } else if (error.message.includes('Invalid token') || error.message.includes('Invalid verification token')) {
        setError("Invalid verification code. Please check the code and try again.");
      } else if (error.message.includes('Token expired')) {
        setError("Verification code has expired. Please request a new one.");
      } else {
        setError(error.message || "Failed to verify email. Please check the code and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const completeSignup = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Final signup with verified email
      const signupData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        userType: formData.userType || 'customer',
      };

      console.log('📝 Completing signup:', signupData);

      const result = await makeApiCall('signup', signupData);

      if (result.success) {
        setSuccessMessage("Account created successfully! Redirecting...");
        
        // Store user data
        if (result.data.token) {
          localStorage.setItem('authToken', result.data.token);
          console.log('🔐 Token stored');
        }
        
        localStorage.setItem('userData', JSON.stringify(result.data.user));
        
        // Navigate based on userType
        setTimeout(() => {
          if (result.data.user.userType === 'provider' || result.data.user.userType === 'both') {
            navigate('/provider/dashboard');
          } else {
            navigate('/customer');
          }
        }, 2000);
      }
    } catch (error: any) {
      console.error('❌ Complete signup error:', error);
      setError(error.message || "Failed to complete signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (currentStep === "signup") {
      // Validate form data
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

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address.");
        return;
      }

      // Send verification token to email
      await sendVerificationToken(formData.email.trim().toLowerCase());
    } else if (currentStep === "verify") {
      // Verify token
      if (!verificationData.token.trim()) {
        setError("Please enter the verification code.");
        return;
      }
      
      if (verificationData.token.length !== 6) {
        setError("Verification code must be 6 digits.");
        return;
      }
      
      // Make sure we have the email
      if (!verificationData.email) {
        setVerificationData(prev => ({
          ...prev,
          email: formData.email.trim().toLowerCase()
        }));
        // Small delay to ensure state is updated
        setTimeout(() => {
          verifyEmail();
        }, 100);
      } else {
        await verifyEmail();
      }
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (!formData.email.trim() || !formData.password.trim()) {
        setError("Please enter both email and password to login.");
        setIsLoading(false);
        return;
      }

      const loginData = {
        email: formData.email,
        password: formData.password,
        userType: formData.userType || 'customer'
      };

      console.log('🔐 Attempting login:', loginData);

      const result = await makeApiCall('login', loginData);

      if (result.success) {
        setSuccessMessage(`Login successful! Welcome back, ${result.data.user.name}!`);
        
        if (result.data.token) {
          localStorage.setItem('authToken', result.data.token);
        }
        localStorage.setItem('userData', JSON.stringify(result.data.user));
        
        setTimeout(() => {
          if (result.data.user.userType === 'provider' || result.data.user.userType === 'both') {
            navigate('/provider/dashboard');
          } else {
            navigate('/customer');
          }
        }, 1000);
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationToken = async () => {
    const emailToUse = verificationData.email || formData.email;
    if (emailToUse) {
      await sendVerificationToken(emailToUse);
    }
  };

  // Debug function to test verification manually
  const testVerificationManually = async () => {
    const testData = {
      email: verificationData.email || formData.email,
      token: verificationData.token
    };
    
    console.log('🧪 Manual test data:', testData);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      
      const result = await response.json();
      console.log('🧪 Manual test result:', result);
    } catch (error) {
      console.error('🧪 Manual test error:', error);
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
              Start your journey as a
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

        {/* Right Side - Login/Verification Form */}
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

            {/* Step Indicator */}
            {!isLogin && (
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === "signup" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"}`}>
                    1
                  </div>
                  <div className="w-12 h-1 bg-gray-300"></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === "verify" ? "bg-blue-600 text-white" : currentStep === "complete" ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"}`}>
                    2
                  </div>
                </div>
              </div>
            )}

            {/* Toggle Buttons */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setCurrentStep("signup");
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
                  setCurrentStep("signup");
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
            <form onSubmit={isLogin ? handleLogin : handleSubmit} className="space-y-6">
              {!isLogin && currentStep === "signup" && (
                <>
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
                        placeholder="Enter your password (min. 6 characters)"
                        required
                        minLength={6}
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

                  <div>
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
                      <option value="provider">Provide Services (Provider)</option>
                      <option value="both">Both (Customer & Provider)</option>
                    </select>
                  </div>
                </>
              )}

              {!isLogin && currentStep === "verify" && (
                <div className="animate-fade-in-up">
                  <div className="text-center mb-6">
                    <MessageSquare className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Verify Your Email Address</h3>
                    <p className="text-gray-600">
                      We sent a verification code to {verificationData.email || formData.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="token"
                        value={verificationData.token}
                        onChange={handleVerificationInputChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        pattern="[0-9]{6}"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={resendVerificationToken}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    disabled={isLoading}
                  >
                    Didn't receive the code? Resend
                  </button>

                  {/* Enhanced Debug Info */}
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm mt-4">
                    <h4 className="font-semibold mb-2">Debug Information:</h4>
                    <div className="space-y-1">
                      <p><strong>Email:</strong> {verificationData.email || formData.email}</p>
                      <p><strong>Token:</strong> {verificationData.token || 'Not set'}</p>
                      <p><strong>Token Length:</strong> {verificationData.token?.length || 0}</p>
                      <p><strong>Token Type:</strong> {typeof verificationData.token}</p>
                    </div>
                    <div className="mt-2 space-x-2">
                      <button
                        type="button"
                        onClick={() => console.log('Verification Data:', verificationData)}
                        className="text-xs bg-yellow-200 px-2 py-1 rounded"
                      >
                        Log Data
                      </button>
                      <button
                        type="button"
                        onClick={testVerificationManually}
                        className="text-xs bg-red-200 px-2 py-1 rounded"
                      >
                        Test Manually
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!isLogin && currentStep === "complete" && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification Complete!</h3>
                  <p className="text-gray-600">Your account has been created successfully.</p>
                </div>
              )}

              {isLogin && (
                <>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Login as
                    </label>
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                    >
                      <option value="provider">Service Provider</option>
                      <option value="customer">Customer</option>
                    </select>
                  </div>

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
                </>
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

              {/* Submit Button */}
              {!isLogin && currentStep !== "complete" && (
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
                      {currentStep === "signup" ? 'Sending Code...' : 'Verifying...'}
                    </>
                  ) : (
                    currentStep === "signup" ? 'Send Verification Code' : 'Verify Email'
                  )}
                </button>
              )}

              {isLogin && (
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
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              )}
            </form>

            {/* Footer Text */}
            {currentStep === "signup" && (
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
                    setCurrentStep("signup");
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  {isLogin ? "Sign up here" : "Sign in here"}
                </button>
              </p>
            )}
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