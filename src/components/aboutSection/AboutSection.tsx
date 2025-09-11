import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { peopleOutline, arrowForwardOutline, sparklesOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './AboutSection.css'

const AboutSection: React.FC = () => {
  const history = useHistory();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLearnMore = () => {
    history.push('/about');
  };

  return (
    <section ref={sectionRef} className={`about about--wide ${isVisible ? 'visible' : ''}`}>
      <div className="about__container">
        <div className="about__icon" aria-hidden="true">
          <IonIcon icon={peopleOutline} />
          <div className="icon-glow"></div>
        </div>
        <div className="about__content">
          <div className="about__badge">
            <IonIcon icon={sparklesOutline} />
            <span>About Us</span>
          </div>
          <h2 className="about__title">About Maha-Disha</h2>
          <p className="about__text">
            Maha-Disha is a unified digital system designed to uplift the backward class through seamless access to various welfare and financial support schemes.
          </p>
          <div className="about__features">
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>Digital Empowerment</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>Seamless Access</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>Community Support</span>
            </div>
          </div>
        </div>
        <div className="about__cta-container">
          <span className="about__cta-text" onClick={handleLearnMore}>
            Learn More
            <IonIcon icon={arrowForwardOutline} />
          </span>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
