import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Services from '../components/Services';
import ProviderOpportunity from '../components/ProviderOpportunity';
import Footer from '../components/Footer';

function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <Header scrollY={scrollY}/>
      <Hero />
      <Features />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="services">
        <Services />
      </div>
      <div id="providers">
        <ProviderOpportunity />
      </div>
      <Footer />
    </div>
  )
}

export default Home