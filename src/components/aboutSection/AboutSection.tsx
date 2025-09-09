import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { peopleOutline, arrowForwardOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './AboutSection.css'

const AboutSection: React.FC = () => {
  const history = useHistory();

  const handleLearnMore = () => {
    history.push('/about');
  };

  return (
    <section className="about about--wide">
      <div className="about__container">
        <div className="about__icon" aria-hidden="true">
          <IonIcon icon={peopleOutline} />
        </div>
        <div className="about__content">
          <h2 className="about__title">About Maha-Disha</h2>
          <p className="about__text">
            Maha-Disha is a unified digital system designed to uplift the backward class through seamless access to various welfare and financial support.
          </p>
        </div>
        <div className="about__cta-container">
          <span className="about__cta-text" onClick={handleLearnMore}>Learn More</span>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
