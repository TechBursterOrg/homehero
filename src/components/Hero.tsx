import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Shield, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import cleaning from '../../public/heroImgg.jpg'
import hairStylist from '../../public/hairStylist.jpg'
import electrician  from '../../public/heroImgg.jpg'



const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    {
      url: [cleaning],
      title: "Cleaning",
      rating: "4.9"
    },
    {
      url: [hairStylist],
      title: "Hair Stylist",
      rating: "4.8"
    },
    {
      url: [electrician],
      title: "Electrician",
      rating: "5.0"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-green-900 flex items-center justify-center overflow-hidden mt-[70px]">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)] animate-pulse"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-left space-y-6 sm:space-y-8">
            <div className="inline-flex items-center space-x-2 bg-green-500/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-green-500/20">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 fill-current animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-green-300">Trusted by 1,000+ homeowners</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Your Home,
                <span className="block bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                  Our Heroes
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                Connect with trusted service providers for all your home needs, or join our platform to earn flexible income with your skills.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to='/login' className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold text-base sm:text-lg flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Find Services
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to='/provider-login' className="group bg-white/10 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold text-base sm:text-lg border-2 border-white/20 hover:border-white/40 flex items-center justify-center shadow-xl transform hover:-translate-y-1">
                Become a Provider
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 sm:pt-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">1000+</div>
                <div className="text-xs sm:text-sm text-gray-400">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-xs sm:text-sm text-gray-400">Providers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">4.9</div>
                <div className="text-xs sm:text-sm text-gray-400">Avg Rating</div>
              </div>
            </div>
          </div>

          {/* Right Image Carousel */}
          <div className="relative h-[350px] sm:h-[450px] md:h-[500px] lg:h-[600px] mt-8 lg:mt-0">
            {/* Main animated image */}
            <div className="relative h-full">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    currentImage === index
                      ? 'opacity-100 scale-100 z-10'
                      : 'opacity-0 scale-95 z-0'
                  }`}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl h-full">
                    <img 
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2 sm:p-3 shadow-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-xs sm:text-sm">{image.title}</div>
                              <div className="flex items-center text-xs text-gray-600">
                                <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                                <span className="font-medium">{image.rating}</span>
                                <span className="ml-1 hidden sm:inline">(127+ reviews)</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">From</div>
                            <div className="text-sm sm:text-base font-bold text-green-600">N4k</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating cards - Hidden on very small screens */}
            <div className="hidden sm:block absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-white rounded-xl p-3 sm:p-4 shadow-xl z-20 animate-bounce">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                  <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-xs sm:text-base">Verified</div>
                  <div className="text-xs text-gray-600">100% Safe</div>
                </div>
              </div>
            </div>

            <div className="hidden sm:block absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white rounded-xl p-3 sm:p-4 shadow-xl z-20 animate-bounce" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                  <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-xs sm:text-base">Fast Service</div>
                  <div className="text-xs text-gray-600">Same Day</div>
                </div>
              </div>
            </div>

            {/* Image indicators */}
            <div className="absolute -bottom-8 sm:-bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    currentImage === index 
                      ? 'w-6 sm:w-8 bg-green-400' 
                      : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Features bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 lg:mt-24">
          <div className="flex items-center space-x-3 sm:space-x-4 bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-green-500/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm sm:text-base">Verified Providers</div>
              <div className="text-xs sm:text-sm text-gray-400">Background checked</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4 bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-green-500/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm sm:text-base">Same-Day Service</div>
              <div className="text-xs sm:text-sm text-gray-400">Quick response time</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4 bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-yellow-500/20 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm sm:text-base">5-Star Reviews</div>
              <div className="text-xs sm:text-sm text-gray-400">Top-rated service</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-green-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
    </section>
  );
};

export default Hero;