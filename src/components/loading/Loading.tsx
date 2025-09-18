import React from 'react';
import { IonContent, IonPage, IonSpinner, IonText, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Loading.css';

const Loading: React.FC = () => {
  const history = useHistory();

  const handleSkip = () => {
    console.log('Skip button clicked');
    history.push('/home');
  };

  console.log('Loading component rendering');

  return (
    <IonPage className="loading-page">
      <IonContent className="loading-content">
        <div className="loading-container">
          {/* Logo Section */}
          <div className="logo-section">
            <img src="/mahadisha.png" alt="MAHA-DISHA Logo" className="loading-logo" />
            <h1 className="app-title">MAHA-DISHA</h1>
            <p className="app-subtitle">Digital Integrated System for Holistic Administration</p>
          </div>

          {/* Loading Animation */}
          <div className="loading-animation">
            <IonSpinner name="crescent" className="loading-spinner" />
            <IonText className="loading-text">
              Loading...
            </IonText>
          </div>

          {/* Simple Progress */}
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '50%' }}></div>
            </div>
            <span className="progress-text">50%</span>
          </div>

          {/* Skip Button */}
          <IonButton 
            fill="clear" 
            className="skip-button"
            onClick={handleSkip}
          >
            Skip Loading
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Loading;
