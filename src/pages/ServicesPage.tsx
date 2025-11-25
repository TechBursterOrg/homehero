import { useState, useEffect, useRef } from 'react';
import { 
  Home, Car, Sparkles, Hammer, Droplet, Zap, Paintbrush, 
  Leaf, Wrench, Wind, Settings, Scissors, Ruler, Bug,
  Search, CheckCircle
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

const ServicesPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { id: 'all', name: 'All Services', icon: Settings },
    { id: 'home', name: 'Home Maintenance', icon: Home },
    { id: 'auto', name: 'Auto Services', icon: Car },
    { id: 'beauty', name: 'Beauty & Care', icon: Sparkles },
    { id: 'domestic', name: 'Domestic Help', icon: Wrench },
    { id: 'tech', name: 'Smart Home & Tech', icon: Zap }
  ];

  const services = [
    // Home Maintenance & Repair
    {
      category: 'home',
      icon: Sparkles,
      image: "https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "House Cleaning",
      description: "Professional deep cleaning services for your home",
      color: "blue"
    },
    {
      category: 'home',
      icon: Droplet,
      image: "https://images.pexels.com/photos/4490201/pexels-photo-4490201.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Plumbing",
      description: "Expert plumbers for repairs and installations",
      color: "cyan"
    },
    {
      category: 'home',
      icon: Zap,
      image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Electrical",
      description: "Licensed electricians for all electrical needs",
      color: "yellow"
    },
    {
      category: 'home',
      icon: Leaf,
      image: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Garden Care",
      description: "Garden maintenance and lawn care services",
      color: "green"
    },
    {
      category: 'home',
      icon: Hammer,
      image: "https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Handyman",
      description: "General repairs and maintenance tasks",
      color: "orange"
    },
    {
      category: 'home',
      icon: Paintbrush,
      image: "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Painting",
      description: "Interior and exterior painting specialists",
      color: "purple"
    },
    {
      category: 'home',
      icon: Wind,
      image: "https://images.pexels.com/photos/8092/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "AC Repair",
      description: "Air conditioning repair and maintenance services",
      color: "blue"
    },
    {
      category: 'home',
      icon: Settings,
      image: "https://images.pexels.com/photos/5691607/pexels-photo-5691607.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Generator Repair",
      description: "Generator maintenance and emergency repairs",
      color: "red"
    },
    {
      category: 'home',
      icon: Scissors,
      image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Carpentry",
      description: "Custom woodwork and furniture repair services",
      color: "orange"
    },
    {
      category: 'home',
      icon: Ruler,
      image: "https://images.pexels.com/photos/4488659/pexels-photo-4488659.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Tiling",
      description: "Professional tile installation and repair",
      color: "cyan"
    },
    {
      category: 'home',
      icon: Wrench,
      image: "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Masonry",
      description: "Brick, block, and stone construction services",
      color: "gray"
    },
    {
      category: 'home',
      icon: Settings,
      image: "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Welding",
      description: "Metal fabrication and welding services",
      color: "orange"
    },
    {
      category: 'home',
      icon: Bug,
      image: "https://images.pexels.com/photos/4505171/pexels-photo-4505171.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Pest Control",
      description: "Professional pest elimination and prevention",
      color: "green"
    },
    // Auto & Mechanical Services
    {
      category: 'auto',
      icon: Car,
      image: "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Auto Mechanic",
      description: "Complete vehicle repair and maintenance",
      color: "red"
    },
    {
      category: 'auto',
      icon: Hammer,
      image: "https://images.pexels.com/photos/3806245/pexels-photo-3806245.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Panel Beater",
      description: "Auto body repair and restoration services",
      color: "blue"
    },
    {
      category: 'auto',
      icon: Zap,
      image: "https://images.pexels.com/photos/3807267/pexels-photo-3807267.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Auto Electrician",
      description: "Vehicle electrical system diagnostics and repair",
      color: "yellow"
    },
    {
      category: 'auto',
      icon: Settings,
      image: "https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Vulcanizer",
      description: "Tire repair and replacement services",
      color: "gray"
    },
    {
      category: 'auto',
      icon: Sparkles,
      image: "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Car Wash",
      description: "Mobile car detailing at your location",
      color: "cyan"
    },
    // Beauty & Personal Care
    {
      category: 'beauty',
      icon: Scissors,
      image: "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Hair Stylist",
      description: "Professional hair styling and treatments",
      color: "purple"
    },
    {
      category: 'beauty',
      icon: Sparkles,
      image: "https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Makeup Artist",
      description: "Bridal and event makeup services",
      color: "pink"
    },
    {
      category: 'beauty',
      icon: Paintbrush,
      image: "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Nail Technician",
      description: "Manicure, pedicure, and nail art services",
      color: "red"
    },
    {
      category: 'beauty',
      icon: Wrench,
      image: "https://images.pexels.com/photos/3757957/pexels-photo-3757957.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Massage Therapist",
      description: "Relaxation and therapeutic massage services",
      color: "blue"
    },
    {
      category: 'beauty',
      icon: Scissors,
      image: "https://images.pexels.com/photos/3738388/pexels-photo-3738388.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Tailor",
      description: "Custom clothing and alterations",
      color: "purple"
    },
    // Domestic & Household Help
    {
      category: 'domestic',
      icon: Home,
      image: "https://images.pexels.com/photos/4473622/pexels-photo-4473622.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Nanny",
      description: "Professional childcare services",
      color: "pink"
    },
    {
      category: 'domestic',
      icon: Wrench,
      image: "https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Cook",
      description: "Personal chef and meal preparation services",
      color: "orange"
    },
    {
      category: 'domestic',
      icon: Sparkles,
      image: "https://images.pexels.com/photos/6197118/pexels-photo-6197118.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Laundry",
      description: "Professional laundry and dry cleaning services",
      color: "blue"
    },
    {
      category: 'domestic',
      icon: Leaf,
      image: "https://images.pexels.com/photos/2132240/pexels-photo-2132240.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Gardener",
      description: "Regular garden maintenance and landscaping",
      color: "green"
    },
    {
      category: 'domestic',
      icon: Settings,
      image: "https://images.pexels.com/photos/8761675/pexels-photo-8761675.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Security Guard",
      description: "Professional security and monitoring services",
      color: "gray"
    },
    // Smart Home & Tech
    {
      category: 'tech',
      icon: Search,
      image: "https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "CCTV Installer",
      description: "Security camera installation and setup",
      color: "gray"
    },
    {
      category: 'tech',
      icon: Zap,
      image: "https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Solar Technician",
      description: "Solar panel installation and maintenance",
      color: "yellow"
    },
    {
      category: 'tech',
      icon: Settings,
      image: "https://images.pexels.com/photos/257699/pexels-photo-257699.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Inverter Technician",
      description: "Inverter installation and repair services",
      color: "orange"
    },
    {
      category: 'tech',
      icon: Wrench,
      image: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "IT Support",
      description: "Computer repair and tech support services",
      color: "blue"
    },
    {
      category: 'tech',
      icon: Ruler,
      image: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Interior Designer",
      description: "Professional home and office design services",
      color: "purple"
    },
    {
      category: 'tech',
      icon: Settings,
      image: "https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "TV Repair",
      description: "Television and entertainment system repair",
      color: "red"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-500',
      cyan: 'bg-cyan-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      pink: 'bg-pink-500',
      gray: 'bg-gray-500'
    };
    return colors[color] || colors.green;
  };

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - NOT CHANGED */}
      <Header scrollY={scrollY}/>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 md:py-20 mb-8 md:mb-12 mt-14 servicesImg">
        <div className="max-w-7xl md:h-[400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            Our Professional Services
          </h1>
          <p className="text-lg md:text-2xl text-green-50 max-w-3xl mx-auto">
            Connect with trusted professionals for all your home, auto, beauty, and tech needs
          </p>
        </div>
      </div>
      {/* Category Filter - Redesigned */}
      <div className=" shadow-lg mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-3 md:px-6 md:py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="inline sm:hidden">{category.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Services Grid - Redesigned */}
      <section ref={sectionRef} className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service, index) => {
              const Icon = service.icon;
              const isHovered = hoveredService === index;
              
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredService(index)}
                  onMouseLeave={() => setHoveredService(null)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer relative"
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`}></div>
                    
                    {/* Icon Badge */}
                    <div className={`absolute top-4 right-4 w-12 h-12 ${getColorClasses(service.color)} rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 ${isHovered ? 'scale-110 rotate-12' : 'scale-100'}`}>
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

                    {/* Hover Action Button */}
                    <div className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent transform transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                      <button className={`w-full ${getColorClasses(service.color)} text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all`}>
                        <CheckCircle className="w-4 h-4" />
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-2xl text-gray-500 font-semibold">No services found in this category</p>
              <p className="text-gray-400 mt-2">Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
      <ChatBot/>

      {/* Footer and ChatBot - NOT CHANGED (would be imported components) */}
    </div>
  );
};

export default ServicesPage;