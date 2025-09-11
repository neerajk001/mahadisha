import React, { useEffect, useRef, useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import Header from '../components/header/Header';
import Hero from '../components/hero/Hero';
import AboutSection from '../components/aboutSection/AboutSection';
import SchemeCategories from '../components/scheme/SchemeCategories';
import Statistics from '../components/Statistics';
import CallToAction from '../components/CallToAction';
import Contact from '../components/contact/Contact';
import './Home.css';

const Home: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    // Page load animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const setSectionRef = (id: string) => (ref: HTMLDivElement | null) => {
    sectionRefs.current[id] = ref;
  };

  return (
    <IonPage className={`home-page ${isLoaded ? 'loaded' : ''}`}>
      <Header />
      <IonContent fullscreen scrollY={true} className="smooth-scroll">
        <div className="home-sections">
          <div 
            id="hero-section"
            ref={setSectionRef('hero-section')}
            className={`section-wrapper ${visibleSections.has('hero-section') ? 'visible' : ''}`}
          >
            <Hero />
          </div>
          
          <div 
            id="about-section"
            ref={setSectionRef('about-section')}
            className={`section-wrapper ${visibleSections.has('about-section') ? 'visible' : ''}`}
          >
            <AboutSection />
          </div>
          
          <div 
            id="schemes-section"
            ref={setSectionRef('schemes-section')}
            className={`section-wrapper ${visibleSections.has('schemes-section') ? 'visible' : ''}`}
          >
            <SchemeCategories />
          </div>
          
          <div 
            id="contact-section"
            ref={setSectionRef('contact-section')}
            className={`section-wrapper ${visibleSections.has('contact-section') ? 'visible' : ''}`}
          >
            <Contact />
          </div>
          
          <div 
            id="statistics-section"
            ref={setSectionRef('statistics-section')}
            className={`section-wrapper ${visibleSections.has('statistics-section') ? 'visible' : ''}`}
          >
            <Statistics />
          </div>
          
          <div 
            id="cta-section"
            ref={setSectionRef('cta-section')}
            className={`section-wrapper ${visibleSections.has('cta-section') ? 'visible' : ''}`}
          >
            <CallToAction />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
