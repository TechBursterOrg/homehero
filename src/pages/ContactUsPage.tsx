import { useState, useEffect, useRef, useCallback } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { googleMapsService } from "../utils/googleMaps";
import ChatBot from '../components/ChatBot'


const ContactUsPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<'sending' | 'success' | 'error' | null>(null);
  
  // Map related state
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string>("");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInitializedRef = useRef(false);

  // Office location coordinates (Genesis Estate, Aboru, Iyanu Ipaja, Lagos, Nigeria)
  const officeLocation = { lat: 6.5675, lng: 3.2565 };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormStatus("error");
      setTimeout(() => setFormStatus(null), 3000);
      return;
    }

    setFormStatus("sending");
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      
      setTimeout(() => {
        setFormStatus(null);
      }, 5000);
    }, 1500);
  };

  // Initialize Google Map
  const initializeMap = useCallback(async () => {
    if (mapInitializedRef.current || !mapContainerRef.current) {
      return;
    }

    try {
      console.log('🗺️ Initializing map...');
      const loaded = await googleMapsService.loadGoogleMaps();
      
      if (!loaded) {
        throw new Error('Failed to load Google Maps');
      }

      googleMapsService.initializeMap(mapContainerRef.current, {
        zoom: 15,
        center: officeLocation
      });

      // Add marker for office location
      if (window.google?.maps) {
        new window.google.maps.Marker({
          position: officeLocation,
          map: googleMapsService.getMap(),
          title: "Our Office",
          icon: {
            url: `data:image/svg+xml;base64,${btoa(`
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 0C15.168 0 8 7.168 8 16C8 28 24 48 24 48C24 48 40 28 40 16C40 7.168 32.832 0 24 0Z" fill="#10B981"/>
                <circle cx="24" cy="16" r="6" fill="white"/>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(48, 48),
            anchor: new window.google.maps.Point(24, 48)
          }
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-3">
              <h3 class="font-bold text-gray-900 mb-1">Our Office</h3>
              <p class="text-sm text-gray-600">Genesis Estate, Aboru</p>
              <p class="text-sm text-gray-600">Iyanu Ipaja, Lagos, Nigeria</p>
            </div>
          `
        });

        const marker = new window.google.maps.Marker({
          position: officeLocation,
          map: googleMapsService.getMap(),
        });

        marker.addListener('click', () => {
          infoWindow.open(googleMapsService.getMap(), marker);
        });
      }

      mapInitializedRef.current = true;
      setIsMapLoaded(true);
      console.log('✅ Map initialized successfully');
    } catch (error) {
      console.error('❌ Map initialization error:', error);
      setMapError(error instanceof Error ? error.message : 'Failed to load map');
    }
  }, []);

  // Initialize map when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeMap();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [initializeMap]);

  const contactMethods = [
    {
      icon: "📞",
      title: "Phone",
      detail: "+234 806 998 0777",
      description: "Mon-Fri from 8am to 5pm",
      link: "tel:+2348069980777",
    },
    {
      icon: "✉️",
      title: "Email",
      detail: "support@homeheroes.help",
      description: "We'll respond within 24 hours",
      link: "mailto:support@serviceplatform.com",
    },
    {
      icon: "📍",
      title: "Office",
      detail: "Genesis Estate, Aboru",
      description: "Iyanu Ipaja, Lagos, Nigeria",
      link: "https://maps.google.com/?q=6.5675,3.2565",
    },
    {
      icon: "💬",
      title: "Live Chat",
      detail: "Chat with our team",
      description: "Available 24/7 for urgent matters",
      link: "#",
    },
  ];

  const faqItems = [
    {
      question: "How quickly will I get a response?",
      answer:
        "We aim to respond to all inquiries within 24 hours during business days. Urgent matters are prioritized and typically receive responses within 2-4 hours.",
    },
    {
      question: "Can I schedule a call with your team?",
      answer:
        "Yes! Simply mention your preferred time in the message form, and our team will reach out to confirm a convenient time for both parties.",
    },
    {
      question: "Do you offer customer support in multiple languages?",
      answer:
        "Currently, we offer support in English. However, we're working on expanding our language support to better serve our diverse customer base.",
    },
    {
      question: "What information should I include in my message?",
      answer:
        "Please include your account details (if applicable), a clear description of your inquiry or issue, and any relevant screenshots or documents that might help us assist you better.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header scrollY={scrollY} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20 mt-16 contactus">
        <div className="max-w-7xl md:h-[400px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
          <p className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Methods */}
      <section className="py-16 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.link}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                <div className="text-5xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-green-600 font-semibold mb-2">
                  {method.detail}
                </p>
                <p className="text-gray-600 text-sm">{method.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section ref={sectionRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and our team will get back to you
                shortly.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                    placeholder="+234 123 456 7890"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={formStatus === "sending"}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === "sending" ? "Sending..." : "Send Message"}
                </button>

                {formStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                    ✓ Message sent successfully! We'll get back to you soon.
                  </div>
                )}

                {formStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    ⚠ Please fill in all required fields.
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Contact Us?
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mr-4">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Expert Support
                    </h3>
                    <p className="text-gray-600">
                      Our dedicated support team has years of experience and is
                      ready to help with any questions or concerns.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mr-4">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Quick Response
                    </h3>
                    <p className="text-gray-600">
                      We prioritize your inquiries and aim to respond within 24
                      hours during business days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mr-4">
                    💡
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Personalized Solutions
                    </h3>
                    <p className="text-gray-600">
                      Every inquiry is unique. We provide tailored solutions
                      that meet your specific needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mr-4">
                    🔒
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Secure & Private
                    </h3>
                    <p className="text-gray-600">
                      Your information is protected with industry-standard
                      security measures and kept confidential.
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Business Hours
                </h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-semibold">8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-semibold">9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  * Emergency support available 24/7 for urgent matters
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.question}
                </h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section with Google Maps Integration */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Find Us
          </h2>
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border">
            {!isMapLoaded && !mapError && (
              <div className="h-96 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading map...</p>
                </div>
              </div>
            )}
            
            {mapError && (
              <div className="h-96 flex items-center justify-center bg-gray-100">
                <div className="text-center max-w-md px-4">
                  <div className="text-6xl mb-4">🗺️</div>
                  <p className="text-gray-600 text-lg mb-2">Map temporarily unavailable</p>
                  <p className="text-gray-500 text-sm mb-4">{mapError}</p>
                  <div className="bg-white rounded-lg p-4 text-left">
                    <p className="font-semibold text-gray-900 mb-2">Our Location:</p>
                    <p className="text-gray-600">6, Sam Iyamu , Genesis Estate, Aboru</p>
                    <p className="text-gray-600">Lagos, Nigeria</p>
                    <a 
                      href="https://maps.google.com/?q=6.5244,3.3792" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-green-600 hover:text-green-700 font-medium"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            <div 
              ref={mapContainerRef} 
              className={`w-full h-96 ${!isMapLoaded || mapError ? 'hidden' : 'block'}`}
              style={{ minHeight: '384px' }}
            />
          </div>
          
          {/* Location Details */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md border text-center">
              <div className="text-4xl mb-3">📍</div>
              <h3 className="font-bold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600 text-sm">6, Sam Iyamu , Genesis Estate, Aboru</p>
              <p className="text-gray-600 text-sm">Lagos, Nigeria</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md border text-center">
              <div className="text-4xl mb-3">🚗</div>
              <h3 className="font-bold text-gray-900 mb-2">Parking</h3>
              <p className="text-gray-600 text-sm">Free parking available</p>
              <p className="text-gray-600 text-sm">Ground floor & basement</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md border text-center">
              <div className="text-4xl mb-3">🚇</div>
              <h3 className="font-bold text-gray-900 mb-2">Public Transport</h3>
              <p className="text-gray-600 text-sm">Bus stop: 2 mins walk</p>
              <p className="text-gray-600 text-sm">Metro: 5 mins walk</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default ContactUsPage;