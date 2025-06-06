import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, Clock, Shield, ArrowRight } from 'lucide-react';

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
      title: "Earn $25-75/hour",
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
    <section ref={sectionRef} id="providers" className="py-20 bg-gradient-to-r from-green-600 to-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center text-white mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Turn Your Skills Into Income
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Join thousands of skilled professionals earning flexible income through HomeHero. Start your journey today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className={`text-center text-white transition-all duration-700 transform hover:scale-110 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 hover:bg-white/30 transition-all duration-300 hover:rotate-12">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="opacity-90 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className={`bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 transition-all duration-1000 delay-700 hover:bg-white/15 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-lg opacity-90 mb-6 leading-relaxed">
                Join our community of trusted service providers and start earning money doing what you love. Our simple onboarding process gets you up and running in no time.
              </p>
              <ul className="space-y-3 mb-8">
                <li className={`flex items-center space-x-3 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`} style={{ transitionDelay: '1000ms' }}>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>Create your professional profile</span>
                </li>
                <li className={`flex items-center space-x-3 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`} style={{ transitionDelay: '1100ms' }}>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <span>Get verified and background checked</span>
                </li>
                <li className={`flex items-center space-x-3 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`} style={{ transitionDelay: '1200ms' }}>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <span>Start receiving job requests</span>
                </li>
              </ul>
            </div>
            <div className={`text-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  Join Today
                </h4>
                <p className="text-gray-600 mb-6">
                  Start earning flexible income with your skills
                </p>
                <button className="w-full bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-all duration-300 font-semibold text-lg flex items-center justify-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Become a Provider
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderOpportunity;