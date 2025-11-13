import React, { useEffect, useRef, useState } from 'react';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../public/HH.png';

const Footer: React.FC = () => {
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

  const serviceCategories = [
    'House Cleaning', 'Plumbing', 'Painting', 'Car Washing',
    'Handyman', 'Landscaping', 'Electrical', 'Pool Service'
  ];

  const companyLinks = [
    'About Us', 'How It Works', 'Safety', 'Careers', 'Press', 'Blog'
  ];

  const supportLinks = [
    'Help Center', 'Contact Us', 'Trust & Safety', 'Terms of Service', 'Privacy Policy', 'Accessibility'
  ];

  return (
    <footer ref={sectionRef} className="bg-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className={`py-12 border-b border-gray-800 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-gray-400 leading-relaxed">
                Get the latest updates on new services, special offers, and tips for maintaining your home.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-green-800 border border-green-700 text-white placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
              />
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 font-medium flex items-center justify-center group transform hover:scale-105">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className={`lg:col-span-2 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center space-x-2 mb-4">
              <Link to="/" className="flex items-center space-x-2">
            <img 
              src={logo} 
              alt="HomeHeroes Logo" 
              className="w-14 h-14 object-contain rounded-lg"
            />
            {/* <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
              HomeHeroes
            </span> */}
          </Link>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Connecting homeowners with trusted service providers for all your home needs. Creating opportunities for skilled professionals to earn flexible income.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-3 hover:text-white transition-colors duration-300">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Serving nationwide across Nigeria</span>
              </div>
              <div className="flex items-center space-x-3 hover:text-white transition-colors duration-300">
                <Phone className="w-4 h-4 text-green-400" />
                <span>+2348069980777</span>
              </div>
              <div className="flex items-center space-x-3 hover:text-white transition-colors duration-300">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>support@homeheroes.help</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {serviceCategories.map((service, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-300 inline-block">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-300 inline-block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-300 inline-block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`py-8 border-t border-gray-800 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
              <span>© 2025 HomeHero. All rights reserved.</span>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group transform hover:scale-110 hover:-translate-y-1">
                <Facebook className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-all duration-300 group transform hover:scale-110 hover:-translate-y-1">
                <Twitter className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-all duration-300 group transform hover:scale-110 hover:-translate-y-1">
                <Instagram className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all duration-300 group transform hover:scale-110 hover:-translate-y-1">
                <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;