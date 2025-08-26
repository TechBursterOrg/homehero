import { useState, useEffect } from "react";
import { Mail, CheckCircle, XCircle, RefreshCw, Home } from "lucide-react";

interface VerificationResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      userType: string;
      country: string;
      isEmailVerified: boolean;
    };
    token: string;
    redirectTo: string;
  };
}

const EmailVerificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userType, setUserType] = useState("customer");

  const API_BASE_URL = "https://backendhomeheroes.onrender.com";

  useEffect(() => {
    // Get user info from localStorage (set during signup)
    const storedEmail = localStorage.getItem("userEmail");
    const storedUserType = localStorage.getItem("userType");
    
    if (storedEmail) setUserEmail(storedEmail);
    if (storedUserType) setUserType(storedUserType);

    // Check URL for verification token
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    
    if (token) {
      handleVerification(token);
    }
  }, []);

  const handleVerification = async (token: string) => {
    if (!token) {
      setError("Invalid verification link. Please check your email for the correct link.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data: VerificationResponse = await response.json();

      if (response.ok && data.success) {
        setIsVerified(true);
        setMessage("Email verified successfully! You can now access all features.");
        
        // Store auth token if provided
        if (data.data?.token) {
          localStorage.setItem("authToken", data.data.token);
          localStorage.setItem("userData", JSON.stringify(data.data.user));
        }
        
        // Clean up temporary storage
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userType");
        
        // Redirect after 3 seconds
        setTimeout(() => {
          const redirectPath = data.data?.user?.userType === "provider" || data.data?.user?.userType === "both" 
            ? "/provider/dashboard" 
            : "/customer";
          window.location.href = redirectPath;
        }, 3000);
      } else {
        setError(data.message || "Email verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("Unable to verify email. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!userEmail) {
      setError("No email address found. Please sign up again.");
      return;
    }

    setIsResending(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Verification email sent! Please check your inbox and spam folder.");
      } else {
        setError(data.message || "Failed to resend verification email.");
      }
    } catch (error) {
      console.error("Resend error:", error);
      setError("Unable to resend email. Please try again later.");
    } finally {
      setIsResending(false);
    }
  };

  const handleGoToDashboard = () => {
    const redirectPath = userType === "provider" || userType === "both" 
      ? "/provider/dashboard" 
      : "/customer";
    window.location.href = redirectPath;
  };

  const handleBackToLogin = () => {
    window.location.href = "/auth";
  };

  // Check if we have a token in URL for auto-verification
  const urlParams = new URLSearchParams(window.location.search);
  const hasToken = urlParams.get("token");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2220%22%20height=%2220%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id=%22grid%22%20width=%2220%22%20height=%2220%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M%2020%200%20L%200%200%200%2020%22%20fill=%22none%22%20stroke=%22%23e5e7eb%22%20stroke-width=%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20fill=%22url(%23grid)%22/%3E%3C/svg%3E')] opacity-30"></div>

      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 p-8 text-center animate-fade-in-up">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
              <Home className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              HomeHero
            </span>
          </div>

          {!hasToken ? (
            // Email verification request page
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-blue-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Verify Your Email
              </h1>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                We've sent a verification email to:
                <br />
                <span className="font-semibold text-gray-900 break-all">
                  {userEmail || "your email address"}
                </span>
              </p>

              <p className="text-sm text-gray-500 mb-8">
                Please check your inbox and click the verification link to activate your account.
                Don't forget to check your spam folder!
              </p>

              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-4"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </button>

              <button
                onClick={handleBackToLogin}
                className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                Back to Login
              </button>
            </>
          ) : isVerified ? (
            // Success page
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Email Verified!
              </h1>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Your email has been successfully verified. You now have full access to your HomeHero account.
              </p>

              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-6">
                Redirecting to your dashboard in a few seconds...
              </div>

              <button
                onClick={handleGoToDashboard}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Go to Dashboard
              </button>
            </>
          ) : (
            // Verification in progress or failed
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {isLoading ? (
                  <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {isLoading ? "Verifying Email..." : "Verification Failed"}
              </h1>
              
              {isLoading && (
                <p className="text-gray-600 mb-8">
                  Please wait while we verify your email address.
                </p>
              )}

              {!isLoading && (
                <>
                  <button
                    onClick={() => {
                      const token = urlParams.get("token");
                      if (token) handleVerification(token);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-4"
                  >
                    Try Again
                  </button>
                  
                  <button
                    onClick={handleBackToLogin}
                    className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-medium"
                  >
                    Back to Login
                  </button>
                </>
              )}
            </>
          )}

          {/* Success Message */}
          {message && !isVerified && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm mb-4 animate-fade-in-up">
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-fade-in-up">
              {error}
            </div>
          )}
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

export default EmailVerificationPage;