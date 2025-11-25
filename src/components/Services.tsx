import { useEffect, useRef, useState } from 'react';
import { Sparkles, Droplet, Paintbrush, Car, Wrench, Flower2, Zap, Waves, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
      image: "https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "House Cleaning",
      description: "Professional cleaning services for your home",
      color: "blue"
    },
    {
      icon: Droplet,
      image: "https://images.pexels.com/photos/4490201/pexels-photo-4490201.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Plumbing",
      description: "Expert plumbers for repairs and installations",
      color: "cyan"
    },
    {
      icon: Paintbrush,
      image: "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Painting",
      description: "Interior and exterior painting specialists",
      color: "purple"
    },
    {
      icon: Car,
      image: "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Car Washing",
      description: "Mobile car detailing at your location",
      color: "red"
    },
    {
      icon: Wrench,
      image: "https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Handyman",
      description: "General repairs and maintenance tasks",
      color: "orange"
    },
    {
      icon: Flower2,
      image: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Landscaping",
      description: "Garden maintenance and lawn care",
      color: "green"
    },
    {
      icon: Zap,
      image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Electrical",
      description: "Licensed electricians for all electrical needs",
      color: "yellow"
    },
    {
      icon: Waves,
      image: "https://images.pexels.com/photos/261679/pexels-photo-261679.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Pool Service",
      description: "Pool cleaning and maintenance experts",
      color: "teal"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string; hover: string } } = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', hover: 'group-hover:bg-blue-500' },
      cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', hover: 'group-hover:bg-cyan-500' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', hover: 'group-hover:bg-purple-500' },
      red: { bg: 'bg-red-500', text: 'text-red-600', hover: 'group-hover:bg-red-500' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', hover: 'group-hover:bg-orange-500' },
      green: { bg: 'bg-green-500', text: 'text-green-600', hover: 'group-hover:bg-green-500' },
      yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', hover: 'group-hover:bg-yellow-500' },
      teal: { bg: 'bg-teal-500', text: 'text-teal-600', hover: 'group-hover:bg-teal-500' }
    };
    return colors[color] || colors.green;
  };

  return (
    <section ref={sectionRef} id="services" className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center px-4 py-2 bg-green-100 rounded-full mb-4">
            <span className="text-green-700 font-semibold text-sm">Our Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Services We Offer
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            From routine maintenance to emergency repairs, our network of trusted professionals has you covered.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            const colorClasses = getColorClasses(service.color);
            
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-60'}`}></div>
                  
                  {/* Icon Badge */}
                  <div className={`absolute top-4 right-4 w-12 h-12 ${colorClasses.bg} rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 ${hoveredIndex === index ? 'scale-110 rotate-12' : 'scale-100'}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {service.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Hover Action Button */}
                <div className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent transform transition-all duration-300 ${hoveredIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                  <button className={`w-full ${colorClasses.bg} text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all`}>
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link to='/services' className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-3 mx-auto">
            View All Services
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;