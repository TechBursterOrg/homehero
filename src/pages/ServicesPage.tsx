import React, { useState, useEffect, useRef } from 'react';
import family from '../../public/family.jpg'
import Header from '../components/Header';
import Footer from '../components/Footer';

const ServicesPage = () => {
  const [scrollY, setScrollY] = useState(0);
  
    useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  const categories = [
    { id: 'all', name: 'All Services', icon: '🔧' },
    { id: 'home', name: 'Home Maintenance', icon: '🏠' },
    { id: 'auto', name: 'Auto Services', icon: '🚗' },
    { id: 'beauty', name: 'Beauty & Personal Care', icon: '💇' },
    { id: 'domestic', name: 'Domestic Help', icon: '🧹' },
    { id: 'tech', name: 'Smart Home & Tech', icon: '🔌' }
  ];

  const services = [
    // Home Maintenance & Repair
    {
      category: 'home',
      image: "https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "House Cleaning",
      description: "Professional deep cleaning services for your home"
    },
    {
      category: 'home',
      image: "https://images.pexels.com/photos/4490201/pexels-photo-4490201.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Plumbing",
      description: "Expert plumbers for repairs and installations"
    },
    {
      category: 'home',
      image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Electrical",
      description: "Licensed electricians for all electrical needs"
    },
    {
      category: 'home',
      image: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Garden Care",
      description: "Garden maintenance and lawn care services"
    },
    {
      category: 'home',
      image: "https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Handyman",
      description: "General repairs and maintenance tasks"
    },
    {
      category: 'home',
      image: "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Painting",
      description: "Interior and exterior painting specialists"
    },
    {
      category: 'home',
      image: "https://images.pexels.com/photos/8092/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "AC Repair",
      description: "Air conditioning repair and maintenance services"
    },
    {
      category: 'home',
      image: "https://images.pexels.com/photos/5691607/pexels-photo-5691607.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Generator Repair",
      description: "Generator maintenance and emergency repairs"
    },
    {
      category: 'home',
      image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Carpentry",
      description: "Custom woodwork and furniture repair services"
    },
    {
      category: 'home',
      image: "https://images.pexels.com/photos/4488659/pexels-photo-4488659.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Tiling",
      description: "Professional tile installation and repair"
    },
    {
      category: 'home',
      image: "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Masonry",
      description: "Brick, block, and stone construction services"
    },
    {
      category: 'home',
      image: "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Welding",
      description: "Metal fabrication and welding services"
    },
    {
      category: 'home',
      image: "https://images.pexels.com/photos/4505171/pexels-photo-4505171.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Pest Control",
      description: "Professional pest elimination and prevention"
    },
    // Auto & Mechanical Services
    {
      category: 'auto',
      image: "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Auto Mechanic",
      description: "Complete vehicle repair and maintenance"
    },
    {
      category: 'auto',
      image: "https://images.pexels.com/photos/3806245/pexels-photo-3806245.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Panel Beater",
      description: "Auto body repair and restoration services"
    },
    {
      category: 'auto',
      image: "https://images.pexels.com/photos/3807267/pexels-photo-3807267.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Auto Electrician",
      description: "Vehicle electrical system diagnostics and repair"
    },
    {
      category: 'auto',
      image: "https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Vulcanizer",
      description: "Tire repair and replacement services"
    },
    {
      category: 'auto',
      image: "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Car Wash",
      description: "Mobile car detailing at your location"
    },
    // Beauty & Personal Care
    {
      category: 'beauty',
      image: "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Hair Stylist",
      description: "Professional hair styling and treatments"
    },
    {
      category: 'beauty',
      image: "https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Makeup Artist",
      description: "Bridal and event makeup services"
    },
    {
      category: 'beauty',
      image: "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Nail Technician",
      description: "Manicure, pedicure, and nail art services"
    },
    {
      category: 'beauty',
      image: "https://images.pexels.com/photos/3757957/pexels-photo-3757957.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Massage Therapist",
      description: "Relaxation and therapeutic massage services"
    },
    {
      category: 'beauty',
      image: "https://images.pexels.com/photos/3738388/pexels-photo-3738388.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Tailor",
      description: "Custom clothing and alterations"
    },
    // Domestic & Household Help
    {
      category: 'domestic',
      image: "https://images.pexels.com/photos/4473622/pexels-photo-4473622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Nanny",
      description: "Professional childcare services"
    },
    {
      category: 'domestic',
      image: "https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Cook",
      description: "Personal chef and meal preparation services"
    },
    {
      category: 'domestic',
      image: "https://images.pexels.com/photos/6197118/pexels-photo-6197118.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Laundry",
      description: "Professional laundry and dry cleaning services"
    },
    {
      category: 'domestic',
      image: "https://images.pexels.com/photos/2132240/pexels-photo-2132240.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Gardener",
      description: "Regular garden maintenance and landscaping"
    },
    {
      category: 'domestic',
      image: "https://images.pexels.com/photos/8761675/pexels-photo-8761675.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Security Guard",
      description: "Professional security and monitoring services"
    },
    // Smart Home & Tech
    {
      category: 'tech',
      image: "https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "CCTV Installer",
      description: "Security camera installation and setup"
    },
    {
      category: 'tech',
      image: "https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Solar Technician",
      description: "Solar panel installation and maintenance"
    },
    {
      category: 'tech',
      image: "https://images.pexels.com/photos/257699/pexels-photo-257699.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Inverter Technician",
      description: "Inverter installation and repair services"
    },
    {
      category: 'tech',
      image: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "IT Support",
      description: "Computer repair and tech support services"
    },
    {
      category: 'tech',
      image: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "Interior Designer",
      description: "Professional home and office design services"
    },
    {
      category: 'tech',
      image: "https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      title: "TV Repair",
      description: "Television and entertainment system repair"
    }
  ];

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header scrollY={scrollY}/>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20 mb-12" style={{ backgroundImage: `url(${family})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Our Professional Services
          </h1>
          <p className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto">
            Connect with trusted professionals for all your home, auto, beauty, and tech needs
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <section ref={sectionRef} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service, index) => (
              <div
                key={index}
                className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-gray-100 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="w-full bg-white text-green-600 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-500">No services found in this category</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      
       
        <Footer />
     
    </div>
  );
};

export default ServicesPage;