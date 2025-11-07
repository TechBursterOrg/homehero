import React, { useEffect, useRef, useState } from 'react';

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
      image: "https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "House Cleaning",
      description: "Professional cleaning services for your home"
    },
    {
      image: "https://images.pexels.com/photos/4490201/pexels-photo-4490201.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Plumbing",
      description: "Expert plumbers for repairs and installations"
    },
    {
      image: "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Painting",
      description: "Interior and exterior painting specialists"
    },
    {
      image: "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Car Washing",
      description: "Mobile car detailing at your location"
    },
    {
      image: "https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Handyman",
      description: "General repairs and maintenance tasks"
    },
    {
      image: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Landscaping",
      description: "Garden maintenance and lawn care"
    },
    {
      image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Electrical",
      description: "Licensed electricians for all electrical needs"
    },
    {
      image: "https://images.pexels.com/photos/261679/pexels-photo-261679.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Pool Service",
      description: "Pool cleaning and maintenance experts"
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
              className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 cursor-pointer border border-gray-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={`text-center mt-12 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;