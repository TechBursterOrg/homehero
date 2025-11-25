import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Search, Calendar, CheckCircle, CreditCard, UserPlus, ShieldCheck, 
  Briefcase, DollarSign, Shield, Wallet, Star, Smartphone, 
  MessageCircle, Lock, TrendingUp, Target, Zap, Award, ArrowRight 
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot";

const HowItWorksPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState("customer");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const customerSteps = [
    {
      number: 1,
      icon: Search,
      image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Find Services",
      description: "Browse our comprehensive catalog of vetted service providers and read authentic reviews from other customers.",
      details: [
        "Search by service type or location",
        "View detailed provider profiles",
        "Read verified customer reviews",
        "Compare ratings and experience",
      ],
    },
    {
      number: 2,
      icon: Calendar,
      image: "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Book & Schedule",
      description: "Choose your preferred time and book instantly with transparent pricing and no hidden fees.",
      details: [
        "Select your preferred date and time",
        "Get instant price estimates",
        "Secure online booking",
        "Receive instant confirmation",
      ],
    },
    {
      number: 3,
      icon: CheckCircle,
      image: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Get It Done",
      description: "Relax while our trusted providers complete your task to perfection with quality guarantee.",
      details: [
        "Track service provider in real-time",
        "Direct communication with provider",
        "Quality assurance guarantee",
        "Rate and review after completion",
      ],
    },
    {
      number: 4,
      icon: CreditCard,
      image: "https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Pay Securely",
      description: "Make secure payments through our platform with multiple payment options and buyer protection.",
      details: [
        "Multiple payment methods",
        "Secure payment gateway",
        "Pay only after satisfaction",
        "Digital receipts and invoices",
      ],
    },
  ];

  const providerSteps = [
    {
      number: 1,
      icon: UserPlus,
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Sign Up",
      description: "Create your professional profile and showcase your skills, experience, and certifications to potential customers.",
      details: [
        "Complete quick registration",
        "Upload certifications and ID",
        "Set your service areas",
        "Define your pricing",
      ],
    },
    {
      number: 2,
      icon: ShieldCheck,
      image: "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Get Verified",
      description: "Complete our verification process to build trust with customers and stand out from the competition.",
      details: [
        "Background check process",
        "Skills verification",
        "Document validation",
        "Get your verified badge",
      ],
    },
    {
      number: 3,
      icon: Briefcase,
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Get Matched",
      description: "Receive job requests that match your skills, availability, and location preferences.",
      details: [
        "Real-time job notifications",
        "Choose jobs that fit your schedule",
        "View customer details and location",
        "Accept or decline requests",
      ],
    },
    {
      number: 4,
      icon: DollarSign,
      image: "https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      title: "Get Paid",
      description: "Complete jobs and receive payment directly through our secure platform with fast payouts.",
      details: [
        "Secure payment processing",
        "Weekly or instant payouts",
        "Track your earnings",
        "Build your reputation",
      ],
    },
  ];

  const benefits = {
    customer: [
      { icon: Shield, title: "Verified Professionals", description: "All service providers undergo thorough background checks and verification" },
      { icon: Wallet, title: "Transparent Pricing", description: "No hidden fees. See exact costs before booking" },
      { icon: Star, title: "Quality Guarantee", description: "100% satisfaction guarantee on all services" },
      { icon: Smartphone, title: "Easy Booking", description: "Book services in minutes from your phone or computer" },
      { icon: MessageCircle, title: "24/7 Support", description: "Our customer support team is always here to help" },
      { icon: Lock, title: "Secure Payments", description: "Protected transactions with multiple payment options" },
    ],
    provider: [
      { icon: Calendar, title: "Flexible Schedule", description: "Work when you want and choose jobs that fit your schedule" },
      { icon: TrendingUp, title: "Grow Your Business", description: "Reach thousands of customers looking for your services" },
      { icon: DollarSign, title: "Competitive Rates", description: "Set your own prices and maximize your earnings" },
      { icon: Target, title: "Job Matching", description: "Get matched with jobs that fit your skills and location" },
      { icon: Zap, title: "Fast Payments", description: "Get paid quickly after completing jobs" },
      { icon: Award, title: "Build Reputation", description: "Earn reviews and ratings to attract more customers" },
    ],
  };

  const currentSteps = activeTab === "customer" ? customerSteps : providerSteps;
  const currentBenefits = activeTab === "customer" ? benefits.customer : benefits.provider;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <Header scrollY={scrollY} />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-600 text-white py-20 howitworksImg mt-14">
        <div className="max-w-7xl md:h-[400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h1>
          <p className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto text-gray-500" >
            Getting started is simple. Whether you need help or want to help
            others, we've made the process seamless.
          </p>
        </div>
      </div>


      {/* Tab Selector */}
      <div className="relative shadow-lg bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setActiveTab("customer")}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                activeTab === "customer"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Search className="w-5 h-5" />
              For Customers
            </button>
            <button
              onClick={() => setActiveTab("provider")}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                activeTab === "provider"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Briefcase className="w-5 h-5" />
              For Providers
            </button>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <section ref={sectionRef} className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {currentSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-12 items-center transition-all duration-1000 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Image */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-6 left-6 w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                        {step.number}
                      </div>
                      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-gray-900">{step.title}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2">
                    <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-500">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-100 p-3 rounded-xl">
                          <Icon className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-green-600">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                        {step.description}
                      </p>
                      <ul className="space-y-3">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-gray-600">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-green-100 rounded-full mb-4">
              <span className="text-green-700 font-semibold text-sm">Benefits</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-green-100"
                >
                  <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-900 via-emerald-800 to-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {activeTab === "customer" ? "Ready to Get Started?" : "Ready to Start Earning?"}
          </h2>
          <p className="text-xl mb-8 text-green-100">
            {activeTab === "customer"
              ? "Join thousands of satisfied customers who trust us for their service needs."
              : "Join our network of professional service providers and grow your business."}
          </p>
          <Link
            to={activeTab === "customer" ? "/login" : "/provider-login"}
            className="group bg-white text-gray-900 px-10 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center gap-3"
          >
            {activeTab === "customer" ? "Find Services" : "Become a Provider"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-green-100 rounded-full mb-4">
              <span className="text-green-700 font-semibold text-sm">FAQ</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-6">
            {activeTab === "customer" ? (
              <>
                <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-100 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    How do I book a service?
                  </h3>
                  <p className="text-gray-600">
                    Simply browse our services, select the one you need, choose your preferred date and time, and confirm your booking. You'll receive instant confirmation.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-100 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Are the service providers vetted?
                  </h3>
                  <p className="text-gray-600">
                    Yes! All our service providers undergo thorough background checks, verification, and must maintain high ratings to stay on our platform.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-100 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-green-600" />
                    What if I'm not satisfied with the service?
                  </h3>
                  <p className="text-gray-600">
                    We offer a 100% satisfaction guarantee. If you're not happy with the service, contact our support team and we'll make it right.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-100 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-green-600" />
                    How much does it cost to join?
                  </h3>
                  <p className="text-gray-600">
                    It's free to sign up! We only charge a small service fee when you complete jobs through our platform.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-100 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    How do I get paid?
                  </h3>
                  <p className="text-gray-600">
                    Payments are processed securely through our platform. You can choose weekly payouts or instant transfers (fees may apply).
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-100 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Can I set my own prices?
                  </h3>
                  <p className="text-gray-600">
                    Yes! You have full control over your pricing. We provide market rate suggestions to help you stay competitive.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
      <ChatBot/>
    </div>
  );
};

export default HowItWorksPage;