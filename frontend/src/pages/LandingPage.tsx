import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Problems } from '../components/Problems';
import { Solution } from '../components/Solution';
import { Features } from '../components/Features';
import { Benefits } from '../components/Benefits';
import { Process } from '../components/Process';
import { Spotlight } from '../components/Spotlight';
import { Audience } from '../components/Audience';
import { GetStarted } from '../components/GetStarted';
import { Stats } from '../components/Stats';
import { FinalCta } from '../components/FinalCta';
import { Footer } from '../components/Footer';
import { ContactModal } from '../components/ContactModal';
import { FloatingCta } from '../components/FloatingCta';

export const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenContact = () => {
    setIsModalOpen(true);
  };

  const handleCloseContact = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="landing-app">
      <Navbar onOpenContact={handleOpenContact} />
      <main>
        <Hero onOpenContact={handleOpenContact} />
        <Problems onOpenContact={handleOpenContact} />
        <Solution onOpenContact={handleOpenContact} />
        <Features />
        <Benefits />
        <Process />
        <Spotlight onOpenContact={handleOpenContact} />
        <Audience />
        <GetStarted />
        <Stats />
        <FinalCta onOpenContact={handleOpenContact} />
      </main>
      <Footer />
      <FloatingCta onOpenContact={handleOpenContact} />
      <ContactModal isOpen={isModalOpen} onClose={handleCloseContact} />
    </div>
  );
};
