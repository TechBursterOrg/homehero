// components/EmailVerification.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    verifyEmail();
  }, []);

  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      navigate('/dashboard');
    }
  }, [status, countdown, navigate]);

  const verifyEmail = async () => {
    try {
      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backendhomeheroes.onrender.com';
      
      console.log('🔐 Verifying email:', { email, token });
      
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: decodeURIComponent(email),
          token: token
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setMessage('Email verified successfully! Redirecting to dashboard...');
        
        // Update local storage if user is logged in
        const userData = localStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          user.isEmailVerified = true;
          localStorage.setItem('userData', JSON.stringify(user));
        }
      } else {
        setStatus('error');
        setMessage(result.message || 'Verification failed');
      }
    } catch (error) {
      console.error('❌ Verification error:', error);
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  const resendVerification = async () => {
    try {
      setStatus('sending');
      setMessage('Sending new verification code...');

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backendhomeheroes.onrender.com';
      
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email ? decodeURIComponent(email) : ''
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('sent');
        setMessage('New verification code sent! Check your email.');
      } else {
        setStatus('error');
        setMessage(result.message || 'Failed to resend verification');
      }
    } catch (error) {
      console.error('❌ Resend error:', error);
      setStatus('error');
      setMessage('Failed to resend verification code');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          {status === 'verifying' && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          )}
          
          {status === 'success' && (
            <div className="text-green-500">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-red-500">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            {status === 'verifying' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
            {status === 'sending' && 'Sending Code...'}
            {status === 'sent' && 'Code Sent!'}
          </h2>

          <p className="text-gray-600 mt-2">{message}</p>

          {status === 'success' && (
            <p className="text-sm text-gray-500 mt-4">
              Redirecting in {countdown} seconds...
            </p>
          )}

          {status === 'error' && (
            <div className="mt-6">
              <button
                onClick={resendVerification}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Resend Verification Code
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="w-full mt-3 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200"
              >
                Back to Login
              </button>
            </div>
          )}

          {status === 'sent' && (
            <button
              onClick={() => navigate('/login')}
              className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Return to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;