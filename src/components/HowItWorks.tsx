import React, { useEffect, useRef, useState } from 'react';

const HowItWorks: React.FC = () => {
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

  const customerSteps = [
    {
      image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      title: "Find Services",
      description: "Browse our vetted service providers and read reviews from other customers."
    },
    {
      image: "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      title: "Book & Schedule",
      description: "Choose your preferred time and book instantly with transparent pricing."
    },
    {
      image: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      title: "Get It Done",
      description: "Relax while our trusted providers complete your task to perfection."
    }
  ];

  const providerSteps = [
    {
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      title: "Sign Up",
      description: "Create your profile and showcase your skills and experience to customers."
    },
    {
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      title: "Get Matched",
      description: "Receive job requests that match your skills and availability preferences."
    },
    {
      image: "https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      title: "Get Paid",
      description: "Complete jobs and receive payment directly through our secure platform."
    }
  ];

  return (
    <section ref={sectionRef} id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting started is simple. Whether you need help or want to help others, we've made the process seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 transition-all duration-1000 delay-200 transform hover:scale-105 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              For Customers
            </h3>
            <div className="space-y-6">
              {customerSteps.map((step, index) => (
                <div 
                  key={index} 
                  className={`flex items-start space-x-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                  style={{ transitionDelay: `${400 + index * 150}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start space-x-3 mb-2">
                      <div className="w-16 h-12 rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={step.image} 
                          alt={step.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mt-1">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 leading-relaxed ml-19">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 transition-all duration-1000 delay-300 transform hover:scale-105 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              For Providers
            </h3>
            <div className="space-y-6">
              {providerSteps.map((step, index) => (
                <div 
                  key={index} 
                  className={`flex items-start space-x-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                  style={{ transitionDelay: `${700 + index * 150}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start space-x-3 mb-2">
                      <div className="w-16 h-12 rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={step.image} 
                          alt={step.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mt-1">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 leading-relaxed ml-19">
                      {step.description}
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

export default HowItWorks;