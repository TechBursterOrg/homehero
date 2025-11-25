import { useEffect, useRef, useState } from 'react';
import { Search, Calendar, CheckCircle, UserPlus, Briefcase, DollarSign } from 'lucide-react';

const HowItWorks = () => {
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
      icon: Search,
      image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      number: "01",
      title: "Find Services",
      description: "Browse our vetted service providers and read reviews from other customers."
    },
    {
      icon: Calendar,
      image: "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      number: "02",
      title: "Book & Schedule",
      description: "Choose your preferred time and book instantly with transparent pricing."
    },
    {
      icon: CheckCircle,
      image: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      number: "03",
      title: "Get It Done",
      description: "Relax while our trusted providers complete your task to perfection."
    }
  ];

  const providerSteps = [
    {
      icon: UserPlus,
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      number: "01",
      title: "Sign Up",
      description: "Create your profile and showcase your skills and experience to customers."
    },
    {
      icon: Briefcase,
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      number: "02",
      title: "Get Matched",
      description: "Receive job requests that match your skills and availability preferences."
    },
    {
      icon: DollarSign,
      image: "https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      number: "03",
      title: "Get Paid",
      description: "Complete jobs and receive payment directly through our secure platform."
    }
  ];

  return (
    <section ref={sectionRef} id="how-it-works" className="py-12 sm:py-16 md:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center px-4 py-2 bg-green-100 rounded-full mb-4">
            <span className="text-green-700 font-semibold text-sm">Simple Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 px-2">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Getting started is simple. Whether you need help or want to help others, we've made the process seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* For Customers */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="flex items-center justify-center mb-8">
              <div className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                For Customers
              </div>
            </div>
            <div className="space-y-8">
              {customerSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={index} 
                    className={`group relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                    style={{ transitionDelay: `${400 + index * 150}ms` }}
                  >
                    <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                      <div className="flex items-start gap-4">
                        {/* Number Badge */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white font-bold text-xl">{step.number}</span>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-gray-600 leading-relaxed mb-4">
                            {step.description}
                          </p>
                          <div className="rounded-xl overflow-hidden shadow-md">
                            <img 
                              src={step.image} 
                              alt={step.title}
                              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Connector Line */}
                    {index < customerSteps.length - 1 && (
                      <div className="absolute left-8 top-full h-8 w-0.5 bg-gradient-to-b from-blue-200 to-transparent -mt-2"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* For Providers */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="flex items-center justify-center mb-8">
              <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                For Providers
              </div>
            </div>
            <div className="space-y-8">
              {providerSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={index} 
                    className={`group relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                    style={{ transitionDelay: `${700 + index * 150}ms` }}
                  >
                    <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                      <div className="flex items-start gap-4">
                        {/* Number Badge */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white font-bold text-xl">{step.number}</span>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <Icon className="w-5 h-5 text-green-600" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-gray-600 leading-relaxed mb-4">
                            {step.description}
                          </p>
                          <div className="rounded-xl overflow-hidden shadow-md">
                            <img 
                              src={step.image} 
                              alt={step.title}
                              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Connector Line */}
                    {index < providerSteps.length - 1 && (
                      <div className="absolute left-8 top-full h-8 w-0.5 bg-gradient-to-b from-green-200 to-transparent -mt-2"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;