import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Services from './components/Services';
import ProviderOpportunity from './components/ProviderOpportunity';
import Footer from './components/Footer';

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header scrollY={scrollY} />
      <Hero />
      <Features />
      <HowItWorks />
      <Services />
      <ProviderOpportunity />
      <Footer />
    </div>
  );
}

export default App;