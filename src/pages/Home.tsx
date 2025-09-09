import React from 'react';
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
  return (
    <IonPage className="home-page">
      <Header />
      <IonContent fullscreen scrollY={true}>
        <div className="home-sections">
          <Hero />
          <AboutSection />
          <SchemeCategories />
          <Contact />
          <Statistics />
          <CallToAction />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
