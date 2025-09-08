import React from 'react';
import { IonButton, IonIcon, useIonRouter } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { searchOutline, documentTextOutline } from 'ionicons/icons';
import './hero.css';

const Hero: React.FC = () => {
  const history = useHistory();
  const ionRouter = useIonRouter();

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
      <div className="hero-content">
        <h1 className="hero-title">
          Empowering Communities, Fostering Growth
        </h1>
        
        <p className="hero-description">
          Providing seamless access to government schemes and support for inclusive development and prosperity.
        </p>
        
        <div className="hero-buttons">
          <IonButton className="explore-button" onClick={navigateToSchemes}>
            <IonIcon icon={searchOutline} slot="start" />
            Explore Schemes
          </IonButton>
          
          <IonButton className="apply-button" onClick={navigateToSignup}>
            <IonIcon icon={documentTextOutline} slot="start" />
            Apply Now
          </IonButton>
        </div>
      </div>
    </div>
  );
};

export default Hero;
