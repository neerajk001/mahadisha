import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { informationCircleOutline, arrowForwardOutline } from 'ionicons/icons';
import './AboutSection.css'

const AboutSection: React.FC = () => {
  return (
    <section className="about about--wide">
      <div className="about__container">
        <div className="about__icon" aria-hidden="true">
          <IonIcon icon={informationCircleOutline} />
        </div>
        <h2 className="about__title">About Maha-Disha</h2>
        <p className="about__text">
          MAHA-DISHA (Maharashtra Digital Information System for Health and Agriculture) is a comprehensive digital portal 
          designed to bridge the gap between government schemes and the citizens of Maharashtra. Our mission is to 
          democratize access to vital information about healthcare, agriculture, education, and social welfare programs 
          through an intuitive, user-friendly digital platform.
        </p>
        <p className="about__text">
          We provide real-time updates on government schemes, eligibility criteria, application processes, and 
          implementation status. Whether you're a farmer looking for agricultural subsidies, a student seeking 
          educational grants, or a healthcare worker exploring medical programs, MAHA-DISHA serves as your 
          one-stop destination for all government-related information and services.
        </p>
        <IonButton className="about__cta" fill="solid" color="primary">
          Learn More
          <IonIcon icon={arrowForwardOutline} slot="end" aria-hidden="true" />
        </IonButton>
      </div>
    </section>
  );
};

export default AboutSection;
