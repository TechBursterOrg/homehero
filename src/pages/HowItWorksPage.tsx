import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import ChatBot from '../components/ChatBot'

const HowItWorksPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [activeTab, setActiveTab] = useState("customer");
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

  const customerSteps = [
    {
      number: 1,
      image:
        "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Find Services",
      description:
        "Browse our comprehensive catalog of vetted service providers and read authentic reviews from other customers.",
      details: [
        "Search by service type or location",
        "View detailed provider profiles",
        "Read verified customer reviews",
        "Compare ratings and experience",
      ],
    },
    {
      number: 2,
      image:
        "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Book & Schedule",
      description:
        "Choose your preferred time and book instantly with transparent pricing and no hidden fees.",
      details: [
        "Select your preferred date and time",
        "Get instant price estimates",
        "Secure online booking",
        "Receive instant confirmation",
      ],
    },
    {
      number: 3,
      image:
        "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Get It Done",
      description:
        "Relax while our trusted providers complete your task to perfection with quality guarantee.",
      details: [
        "Track service provider in real-time",
        "Direct communication with provider",
        "Quality assurance guarantee",
        "Rate and review after completion",
      ],
    },
    {
      number: 4,
      image:
        "https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Pay Securely",
      description:
        "Make secure payments through our platform with multiple payment options and buyer protection.",
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
      image:
        "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Sign Up",
      description:
        "Create your professional profile and showcase your skills, experience, and certifications to potential customers.",
      details: [
        "Complete quick registration",
        "Upload certifications and ID",
        "Set your service areas",
        "Define your pricing",
      ],
    },
    {
      number: 2,
      image:
        "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Get Verified",
      description:
        "Complete our verification process to build trust with customers and stand out from the competition.",
      details: [
        "Background check process",
        "Skills verification",
        "Document validation",
        "Get your verified badge",
      ],
    },
    {
      number: 3,
      image:
        "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Get Matched",
      description:
        "Receive job requests that match your skills, availability, and location preferences.",
      details: [
        "Real-time job notifications",
        "Choose jobs that fit your schedule",
        "View customer details and location",
        "Accept or decline requests",
      ],
    },
    {
      number: 4,
      image:
        "https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      title: "Get Paid",
      description:
        "Complete jobs and receive payment directly through our secure platform with fast payouts.",
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
      {
        icon: "🛡️",
        title: "Verified Professionals",
        description:
          "All service providers undergo thorough background checks and verification",
      },
      {
        icon: "💰",
        title: "Transparent Pricing",
        description: "No hidden fees. See exact costs before booking",
      },
      {
        icon: "⭐",
        title: "Quality Guarantee",
        description: "100% satisfaction guarantee on all services",
      },
      {
        icon: "📱",
        title: "Easy Booking",
        description: "Book services in minutes from your phone or computer",
      },
      {
        icon: "💬",
        title: "24/7 Support",
        description: "Our customer support team is always here to help",
      },
      {
        icon: "🔒",
        title: "Secure Payments",
        description: "Protected transactions with multiple payment options",
      },
    ],
    provider: [
      {
        icon: "💼",
        title: "Flexible Schedule",
        description:
          "Work when you want and choose jobs that fit your schedule",
      },
      {
        icon: "📈",
        title: "Grow Your Business",
        description: "Reach thousands of customers looking for your services",
      },
      {
        icon: "💵",
        title: "Competitive Rates",
        description: "Set your own prices and maximize your earnings",
      },
      {
        icon: "🎯",
        title: "Job Matching",
        description: "Get matched with jobs that fit your skills and location",
      },
      {
        icon: "⚡",
        title: "Fast Payments",
        description: "Get paid quickly after completing jobs",
      },
      {
        icon: "🏆",
        title: "Build Reputation",
        description: "Earn reviews and ratings to attract more customers",
      },
    ],
  };

  const currentSteps = activeTab === "customer" ? customerSteps : providerSteps;
  const currentBenefits =
    activeTab === "customer" ? benefits.customer : benefits.provider;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white ">
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
      <div className=" bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setActiveTab("customer")}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                activeTab === "customer"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              👤 For Customers
            </button>
            <button
              onClick={() => setActiveTab("provider")}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                activeTab === "provider"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🔧 For Providers
            </button>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <section ref={sectionRef} className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {currentSteps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-8 items-center  ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-80 object-cover"
                    />
                    <div
                      className={`absolute top-6 left-6 w-16 h-16 ${
                        activeTab === "customer"
                          ? "bg-green-600"
                          : "bg-green-600"
                      } rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
                    >
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2">
                  <h3
                    className={`text-3xl font-bold mb-4 ${
                      activeTab === "customer"
                        ? "text-green-600"
                        : "text-green-600"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <span
                          className={`mr-3 mt-1 ${
                            activeTab === "customer"
                              ? "text-green-600"
                              : "text-green-600"
                          }`}
                        >
                          ✓
                        </span>
                        <span className="text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        className={`py-20 ${
          activeTab === "customer" ? "bg-blue-50" : "bg-green-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`py-20 bg-gradient-to-r ${
          activeTab === "customer"
            ? "from-green-600 to-green-700"
            : "from-green-600 to-green-700"
        } text-white`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {activeTab === "customer"
              ? "Ready to Get Started?"
              : "Ready to Start Earning?"}
          </h2>
          <p className="text-xl mb-8">
            {activeTab === "customer"
              ? "Join thousands of satisfied customers who trust us for their service needs."
              : "Join our network of professional service providers and grow your business."}
          </p>
          <Link
            to={activeTab === "customer" ? "/login" : "/provider-login"}
            className="bg-white text-gray-900 px-10 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
          >
            {activeTab === "customer" ? "Find Services" : "Become a Provider"}
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {activeTab === "customer" ? (
              <>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    How do I book a service?
                  </h3>
                  <p className="text-gray-600">
                    Simply browse our services, select the one you need, choose
                    your preferred date and time, and confirm your booking.
                    You'll receive instant confirmation.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Are the service providers vetted?
                  </h3>
                  <p className="text-gray-600">
                    Yes! All our service providers undergo thorough background
                    checks, verification, and must maintain high ratings to stay
                    on our platform.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    What if I'm not satisfied with the service?
                  </h3>
                  <p className="text-gray-600">
                    We offer a 100% satisfaction guarantee. If you're not happy
                    with the service, contact our support team and we'll make it
                    right.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    How much does it cost to join?
                  </h3>
                  <p className="text-gray-600">
                    It's free to sign up! We only charge a small service fee
                    when you complete jobs through our platform.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    How do I get paid?
                  </h3>
                  <p className="text-gray-600">
                    Payments are processed securely through our platform. You
                    can choose weekly payouts or instant transfers (fees may
                    apply).
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Can I set my own prices?
                  </h3>
                  <p className="text-gray-600">
                    Yes! You have full control over your pricing. We provide
                    market rate suggestions to help you stay competitive.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
      <ChatBot /> {/* Add the chatbot component */}
    </div>
  );
};

export default HowItWorksPage;
