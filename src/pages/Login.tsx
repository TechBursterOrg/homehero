import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Home,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  Star,
  Globe,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  X
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;
  country: string;
  phoneNumber: string;
}

interface VerificationData {
  token: string;
  phoneNumber: string;
  country: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentStep, setCurrentStep] = useState<"signup" | "verify" | "complete">("signup");
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "customer",
    country: "NIGERIA",
    phoneNumber: "",
  });
  
  const [verificationData, setVerificationData] = useState<VerificationData>({
    token: "",
    phoneNumber: "",
    country: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  // Check for verification success and pre-populate form
  useEffect(() => {
    const verified = searchParams.get('verified');
    const email = searchParams.get('email');
    const message = searchParams.get('message');
    const error = searchParams.get('error');
    
    if (verified === 'true' && email) {
      // Show verification success popup
      setShowVerificationSuccess(true);
      
      // Pre-populate the email in the form
      setFormData(prev => ({
        ...prev,
        email: decodeURIComponent(email)
      }));
      
      // Switch to login mode
      setIsLogin(true);
      
      // Set success message
      if (message) {
        setSuccessMessage(decodeURIComponent(message));
      }
      
      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
    
    if (message && !verified) {
      setSuccessMessage(decodeURIComponent(message));
    }
    
    if (error) {
      setError(decodeURIComponent(error));
    }
  }, [searchParams]);

  // Country codes and validation
  const countryData = {
    NIGERIA: { code: "+234", length: 10, pattern: /^[0-9]{10}$/ },
    UK: { code: "+44", length: 10, pattern: /^[0-9]{10}$/ },
    USA: { code: "+1", length: 10, pattern: /^[0-9]{10}$/ },
    CANADA: { code: "+1", length: 10, pattern: /^[0-9]{10}$/ },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "phoneNumber") {
      const cleanedValue = value.replace(/\D/g, "");
      setFormData({
        ...formData,
        [name]: cleanedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
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

  const validatePhoneNumber = (phone: string, country: string): string | null => {
    const countryInfo = countryData[country as keyof typeof countryData];
    if (!countryInfo) return "Invalid country selected";

    if (phone.length !== countryInfo.length) {
      return `Phone number must be ${countryInfo.length} digits for ${country}`;
    }

    if (!countryInfo.pattern.test(phone)) {
      return `Invalid phone number format for ${country}`;
    }

    return null;
  };

  const makeApiCall = async (endpoint: string, data: any) => {
    console.log(`🌐 Making API call to: ${API_BASE_URL}/api/auth/${endpoint}`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error(`🔴 API Error Response:`, result);
        
        if (result.errors && Array.isArray(result.errors)) {
          const errorDetails = result.errors.map((err: any) => {
            if (typeof err === 'string') return err;
            return `${err.field || ''}: ${err.message || JSON.stringify(err)}`;
          }).join(', ');
          throw new Error(`Validation failed: ${errorDetails}`);
        }
        
        const errorMessage = result.message || 
                            result.error ||
                            `HTTP ${response.status}: ${response.statusText}`;
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

  // UPDATED: Signup function for email verification link
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.phoneNumber.trim()) {
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

      // Validate phone number
      const phoneError = validatePhoneNumber(formData.phoneNumber, formData.country);
      if (phoneError) {
        setError(phoneError);
        setIsLoading(false);
        return;
      }

      console.log('📝 Starting signup process for:', formData.email);

      // Complete signup with email verification
      const signupData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        userType: formData.userType || 'customer',
        country: formData.country || 'NIGERIA',
        phoneNumber: formData.phoneNumber
      };

      console.log('📝 Sending signup data:', signupData);

      const result = await makeApiCall('signup', signupData);

      if (result.success) {
        setSuccessMessage("Account created successfully! Please check your email for the verification link. You'll be redirected to login after verification.");
        setCurrentStep("complete");
        
        // Don't auto-login, wait for email verification
        console.log('✅ Signup successful, waiting for email verification');
      }
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification email
  const resendVerificationEmail = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!formData.email.trim()) {
        setError("Email address is required");
        setIsLoading(false);
        return;
      }

      const result = await makeApiCall('resend-verification', {
        email: formData.email.toLowerCase().trim()
      });

      if (result.success) {
        setSuccessMessage("Verification email sent successfully! Please check your email.");
      }
    } catch (error: any) {
      console.error('❌ Resend verification error:', error);
      setError(error.message || "Failed to resend verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check verification status
  const checkVerificationStatus = async () => {
    try {
      if (!formData.email.trim()) return;

      const response = await fetch(`${API_BASE_URL}/api/auth/verification-status/${formData.email.toLowerCase()}`);
      const result = await response.json();

      if (result.success && result.data.isEmailVerified) {
        setSuccessMessage("Email verified successfully! You can now login.");
        setCurrentStep("complete");
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  // Handle login
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

  const getCurrentCountryCode = () => {
    return countryData[formData.country as keyof typeof countryData]?.code || "+234";
  };

  // Close verification success popup
  const closeVerificationSuccess = () => {
    setShowVerificationSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Verification Success Popup */}
      {showVerificationSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Verified Successfully!</h3>
              <p className="text-gray-600 mb-6">
                Your email has been verified. You can now login to your account.
              </p>
              <button
                onClick={closeVerificationSuccess}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                Continue to Login
              </button>
            </div>
          </div>
        </div>
      )}

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
              Connect with trusted service providers today
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
            <form onSubmit={isLogin ? handleLogin : (currentStep === "signup" ? handleSignup : (e) => e.preventDefault())} className="space-y-6">
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
                      Country
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400 appearance-none bg-white"
                        required
                      >
                        <option value="NIGERIA">🇳🇬 Nigeria</option>
                        {/* <option value="UK">🇬🇧 United Kingdom</option>
                        <option value="USA">🇺🇸 United States</option>
                        <option value="CANADA">🇨🇦 Canada</option> */}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 border-gray-300 rounded-l-xl bg-gray-50">
                          <span className="text-gray-600 text-sm">{getCurrentCountryCode()}</span>
                        </div>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="flex-1 pl-3 pr-4 py-3 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                          placeholder={`Enter your phone number (${countryData[formData.country as keyof typeof countryData]?.length || 10} digits)`}
                          required
                          maxLength={countryData[formData.country as keyof typeof countryData]?.length || 10}
                        />
                      </div>
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
                      
                      <option value="provider">Provide Services (Provider)</option>
                      <option value="customer">Find Services (Customer)</option>
                      <option value="both">Both (Customer & Provider)</option>
                    </select>
                  </div>
                </>
              )}

              {!isLogin && currentStep === "complete" && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email!</h3>
                  <p className="text-gray-600 mb-4">
                    We've sent a verification link to <strong>{formData.email}</strong>. 
                    Click the link in the email to verify your account.
                  </p>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={resendVerificationEmail}
                      disabled={isLoading}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "Sending..." : "Resend Verification Email"}
                    </button>
                    <button
                      type="button"
                      onClick={checkVerificationStatus}
                      className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      I've Verified My Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(true);
                        setCurrentStep("signup");
                        setSuccessMessage("");
                      }}
                      className="w-full text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Back to Login
                    </button>
                  </div>
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
              {!isLogin && currentStep === "signup" && (
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
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
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
          
          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
          }
          
          .animate-scale-in {
            animation: scale-in 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;