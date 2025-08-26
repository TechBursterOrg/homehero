import React from 'react';
import { ArrowRight, Star,   } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2220%22%20height=%2220%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id=%22grid%22%20width=%2220%22%20height=%2220%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M%2020%200%20L%200%200%200%2020%22%20fill=%22none%22%20stroke=%22%23e5e7eb%22%20stroke-width=%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20fill=%22url(%23grid)%22/%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 hover:shadow-lg transition-all duration-300">
              <Star className="w-4 h-4 text-yellow-500 fill-current animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Trusted by 1,000+ homeowners</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Your Home,
            <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent animate-gradient">
              Our Heroes
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Connect with trusted service providers for all your home needs, or join our platform to earn flexible income with your skills.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/login" className="group bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold text-lg flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105">
              Find Services
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="group bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105">
              Become a Provider
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <img 
                src="https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" 
                alt="Verified Provider" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium text-gray-700">Verified Providers</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <img 
                src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" 
                alt="Same Day Service" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium text-gray-700">Same-Day Service</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
              <span className="font-medium text-gray-700">5-Star Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;