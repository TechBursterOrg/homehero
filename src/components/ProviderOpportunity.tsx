import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, Clock, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProviderOpportunity: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: TrendingUp,
      title: "Earn ₦5k-30k/daily",
      description: "Set competitive rates and maximize your earning potential"
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Work when you want, as much or as little as you prefer"
    },
    {
      icon: Shield,
      title: "Insurance Coverage",
      description: "Protected by our comprehensive insurance policy"
    }
  ];

  return (
    <section ref={sectionRef} id="providers" className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-green-600 to-green-700 relative">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center text-white mb-10 sm:mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            Turn Your Skills Into Income
          </h2>
          <p className="text-base sm:text-lg md:text-xl opacity-90 max-w-3xl mx-auto px-4">
            Join thousands of skilled professionals earning flexible income through Home Heroes. Start your journey today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className={`text-center text-white transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 hover:bg-white/30 transition-colors duration-300">
                <benefit.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm sm:text-base opacity-90 leading-relaxed px-2">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className={`bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 transition-all duration-1000 delay-700 hover:bg-white/15 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="text-white">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-base sm:text-lg opacity-90 mb-5 sm:mb-6 leading-relaxed">
                Join our community of trusted service providers and start earning money doing what you love. Our simple onboarding process gets you up and running in no time.
              </p>
              <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                <li className={`flex items-center space-x-3 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1000ms' }}>
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base">Create your professional profile</span>
                </li>
                <li className={`flex items-center space-x-3 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1100ms' }}>
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base">Get verified and background checked</span>
                </li>
                <li className={`flex items-center space-x-3 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1200ms' }}>
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base">Start booking job requests</span>
                </li>
              </ul>
            </div>
            <div className={`text-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl transition-shadow duration-300 hover:shadow-3xl">
                <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Join Today
                </h4>
                <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
                  Start earning flexible income with your skills
                </p>
                <Link to='/provider-login' className="w-full bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-green-700 transition-all duration-300 font-semibold text-base sm:text-lg flex items-center justify-center group shadow-lg hover:shadow-xl">
                  Become a Provider
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderOpportunity;