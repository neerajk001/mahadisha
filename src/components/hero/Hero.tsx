import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { searchOutline, documentTextOutline } from 'ionicons/icons';
import './hero.css';

const Hero: React.FC = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Empowering Communities, Fostering Growth
        </h1>
        
        <p className="hero-description">
          Providing seamless access to government schemes and support for inclusive development and prosperity.
        </p>
        
        <div className="hero-buttons">
          <IonButton className="explore-button">
            <IonIcon icon={searchOutline} slot="start" />
            Explore Schemes
          </IonButton>
          
          <IonButton className="apply-button">
            <IonIcon icon={documentTextOutline} slot="start" />
            Apply Now
          </IonButton>
        </div>
      </div>
    </div>
  );
};

export default Hero;
