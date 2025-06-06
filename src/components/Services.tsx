import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Wrench, Paintbrush, Car, Hammer, Leaf, Zap, Droplets } from 'lucide-react';

const Services: React.FC = () => {
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

  const services = [
    {
      icon: Sparkles,
      title: "House Cleaning",
      description: "Professional cleaning services for your home",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Wrench,
      title: "Plumbing",
      description: "Expert plumbers for repairs and installations",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Paintbrush,
      title: "Painting",
      description: "Interior and exterior painting specialists",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Car,
      title: "Car Washing",
      description: "Mobile car detailing at your location",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Hammer,
      title: "Handyman",
      description: "General repairs and maintenance tasks",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Leaf,
      title: "Landscaping",
      description: "Garden maintenance and lawn care",
      color: "from-green-600 to-lime-500"
    },
    {
      icon: Zap,
      title: "Electrical",
      description: "Licensed electricians for all electrical needs",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Droplets,
      title: "Pool Service",
      description: "Pool cleaning and maintenance experts",
      color: "from-cyan-500 to-blue-500"
    }
  ];

  return (
    <section ref={sectionRef} id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Services We Offer
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From routine maintenance to emergency repairs, our network of trusted professionals has you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 cursor-pointer border border-gray-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300`}>
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className={`text-center mt-12 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;