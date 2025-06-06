import React, { useEffect, useRef, useState } from 'react';
import { Shield, Clock, Star, DollarSign, Users, Zap } from 'lucide-react';

const Features: React.FC = () => {
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

  const customerFeatures = [
    {
      icon: Shield,
      title: "Verified Providers",
      description: "All service providers are background-checked and verified for your peace of mind."
    },
    {
      icon: Clock,
      title: "Quick Booking",
      description: "Book services in minutes and get same-day or next-day availability."
    },
    {
      icon: Star,
      title: "Quality Guaranteed",
      description: "Satisfaction guaranteed with our 5-star rating system and reviews."
    }
  ];

  const providerFeatures = [
    {
      icon: DollarSign,
      title: "Flexible Income",
      description: "Set your own rates and work when you want to maximize your earnings."
    },
    {
      icon: Users,
      title: "Steady Customers",
      description: "Access to a growing customer base looking for reliable service providers."
    },
    {
      icon: Zap,
      title: "Easy Setup",
      description: "Get started in minutes with our simple onboarding process."
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose HomeHero?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building a trusted community where homeowners find reliable help and skilled workers find meaningful opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              For Homeowners
            </h3>
            <div className="space-y-8">
              {customerFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className={`flex items-start space-x-4 group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              For Service Providers
            </h3>
            <div className="space-y-8">
              {providerFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className={`flex items-start space-x-4 group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                  style={{ transitionDelay: `${700 + index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <feature.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;