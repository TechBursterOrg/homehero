import React, { useState } from 'react';
import { Mail, User, Phone, MapPin, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';

const WaitlistPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    userType: 'customer'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id=%22confetti%22%20width=%2260%22%20height=%2260%22%20patternUnits=%22userSpaceOnUse%22%3E%3Ccircle%20cx=%2210%22%20cy=%2210%22%20r=%221%22%20fill=%22%23dbeafe%22/%3E%3Ccircle%20cx=%2250%22%20cy=%2250%22%20r=%221.5%22%20fill=%22%23dcfce7%22/%3E%3Cpolygon%20points=%2230,5%2032,10%2028,10%22%20fill=%22%23fef3c7%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20fill=%22url(%23confetti)%22/%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center animate-fade-in-up">
          <div className="animate-bounce mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-pulse" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            You're In! 🎉
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Welcome to the HomeHero family! We'll notify you as soon as we launch in your area.
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Get early access to our platform
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Exclusive launch promotions
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Priority onboarding support
              </li>
            </ul>
          </div>
          
          <button
            onClick={() => setIsSubmitted(false)}
            className="group bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center mx-auto transform hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2220%22%20height=%2220%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id=%22grid%22%20width=%2220%22%20height=%2220%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M%2020%200%20L%200%200%200%2020%22%20fill=%22none%22%20stroke=%22%23e5e7eb%22%20stroke-width=%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20fill=%22url(%23grid)%22/%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Join the Waitlist
          </h1>
          
          <p className="text-gray-600 leading-relaxed">
            Be the first to experience HomeHero when we launch. Get exclusive early access and special offers!
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-8 border border-blue-100">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              <span className="font-medium">1,300 people waiting</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="font-medium">Launching Soon</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
              />
            </div>

            <div className="relative group">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
              />
            </div>

            <div className="relative group">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                name="location"
                placeholder="City, State"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I'm interested as a:
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
              >
                <option value="customer">Customer (Need Services)</option>
                <option value="provider">Service Provider</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Joining Waitlist...</span>
              </>
            ) : (
              <>
                <span>Join Waitlist</span>
                <Sparkles className="w-5 h-5 animate-pulse" />
              </>
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By joining, you agree to receive updates about HomeHero's launch.
            <br />
            We respect your privacy and won't spam you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage;