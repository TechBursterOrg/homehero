import { useEffect, useRef, useState } from 'react';
import { CheckCircle, Users, Clock, Shield, TrendingUp, Zap } from 'lucide-react';

const Features = () => {
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

  const customerFeatures = [
    {
      icon: Shield,
      image: "./src/images/verified.jpg",
      title: "Verified Providers",
      description: "All service providers are background-checked and verified for your peace of mind.",
      color: "green"
    },
    {
      icon: Clock,
      image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Quick Booking",
      description: "Book services in minutes and get same-day or next-day availability.",
      color: "blue"
    },
    {
      icon: CheckCircle,
      image: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Quality Guaranteed",
      description: "Satisfaction guaranteed with our 5-star rating system and reviews.",
      color: "emerald"
    }
  ];

  const providerFeatures = [
    {
      icon: TrendingUp,
      image: "https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Flexible Income",
      description: "Set your own rates and work when you want to maximize your earnings.",
      color: "green"
    },
    {
      icon: Users,
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Steady Customers",
      description: "Access to a growing customer base looking for reliable service providers.",
      color: "blue"
    },
    {
      icon: Zap,
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Easy Setup",
      description: "Get started in minutes with our simple onboarding process.",
      color: "emerald"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      green: 'bg-green-500 text-green-600 border-green-200',
      blue: 'bg-blue-500 text-blue-600 border-blue-200',
      emerald: 'bg-emerald-500 text-emerald-600 border-emerald-200'
    };
    return colors[color] || colors.green;
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center px-4 py-2 bg-green-100 rounded-full mb-4">
            <span className="text-green-700 font-semibold text-sm">Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 px-2">
            Why Choose Home Heroes?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            We're building a trusted community where homeowners find reliable help and skilled workers find meaningful opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* For Homeowners */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="flex items-center justify-center mb-8">
              <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                For Homeowners
              </div>
            </div>
            <div className="space-y-6">
              {customerFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index} 
                    className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                    style={{ transitionDelay: `${400 + index * 150}ms` }}
                  >
                    <div className="grid sm:grid-cols-5 gap-0">
                      <div className="sm:col-span-2 h-48 sm:h-full relative overflow-hidden">
                        <img 
                          src={feature.image} 
                          alt={feature.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                      </div>
                      <div className="sm:col-span-3 p-6 flex flex-col justify-center">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${getColorClasses(feature.color).split(' ')[0]}/10 mb-4`}>
                          <Icon className={`w-6 h-6 ${getColorClasses(feature.color).split(' ')[1]}`} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* For Service Providers */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="flex items-center justify-center mb-8">
              <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                For Service Providers
              </div>
            </div>
            <div className="space-y-6">
              {providerFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index} 
                    className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                    style={{ transitionDelay: `${700 + index * 150}ms` }}
                  >
                    <div className="grid sm:grid-cols-5 gap-0">
                      <div className="sm:col-span-2 h-48 sm:h-full relative overflow-hidden">
                        <img 
                          src={feature.image} 
                          alt={feature.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                      </div>
                      <div className="sm:col-span-3 p-6 flex flex-col justify-center">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${getColorClasses(feature.color).split(' ')[0]}/10 mb-4`}>
                          <Icon className={`w-6 h-6 ${getColorClasses(feature.color).split(' ')[1]}`} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
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

export default Features;