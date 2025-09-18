import React, { useEffect, useState } from 'react';
import { IonButton, IonIcon, useIonRouter } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { searchOutline, documentTextOutline, sparklesOutline } from 'ionicons/icons';
import './hero.css';

const Hero: React.FC = () => {
  const history = useHistory();
  const ionRouter = useIonRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const navigateToSchemes = () => {
    try {
      ionRouter.push('/schemes');
    } catch (error) {
      history.push('/schemes');
    }
  };

  const navigateToSignup = () => {
    try {
      ionRouter.push('/signup');
    } catch (error) {
      history.push('/signup');
    }
  };

  return (
    <div className="hero-section">
      {/* Image Carousel Background */}
      <div className="hero-image-carousel">
        <div className="carousel-slide slide-1"></div>
        <div className="carousel-slide slide-2"></div>
        <div className="carousel-slide slide-3"></div>
      </div>
      
      {/* Pagination Dots */}
      <div className="carousel-pagination">
        <div className="pagination-dot active" data-slide="1"></div>
        <div className="pagination-dot" data-slide="2"></div>
        <div className="pagination-dot" data-slide="3"></div>
      </div>
      
      {/* Floating particles */}
      <div className="hero-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

      <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
        <div className="hero-badge">
          <IonIcon icon={sparklesOutline} />
          <span>Empowering Communities</span>
        </div>
        
        <h1 className="hero-title">
          <span className="title-line">Empowering</span>
          <span className="title-line highlight">the backward class</span>
          <span className="title-line">communities</span>
        </h1>
        
        <p className="hero-description">
          Providing seamless access to government schemes and support for inclusive development and prosperity.
        </p>
        
        <div className="hero-buttons">
          <IonButton className="explore-button" onClick={navigateToSchemes}>
            <IonIcon icon={searchOutline} slot="start" />
            <span>Explore Schemes</span>
            <div className="button-shine"></div>
          </IonButton>
          
          <IonButton className="apply-button" onClick={navigateToSignup}>
            <IonIcon icon={documentTextOutline} slot="start" />
            <span>Apply Now</span>
            <div className="button-shine"></div>
          </IonButton>
        </div>
      </div>
    </div>
  );
};

export default Hero;
