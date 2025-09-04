import React from 'react';
import { IonIcon } from '@ionic/react';
import { locationOutline, callOutline, mailOutline, pushOutline, businessOutline } from 'ionicons/icons';
import './Contact.css';

const Contact: React.FC = () => {
  return (
    <div className="contact-section">
      <h2 className="contact-title">
        MAHA-DISHA DIGITAL INTEGRATED SYSTEM FOR HOLISTIC ADMINISTRATION
      </h2>
      
      <div className="contact-panels">
        {/* Registered Office Panel */}
        <div className="contact-panel registered-office">
          <div className="panel-header">
            <IonIcon icon={pushOutline} className="panel-icon registered-icon" />
            <h3>Registered Office</h3>
          </div>
          
          <div className="contact-details">
            <div className="contact-item">
              <IonIcon icon={locationOutline} className="contact-icon" />
              <span className="contact-text">
                Thakarshi House, 2nd floor, J. N. Heredia Road, Ballard Estate, Mumbai - 400001
              </span>
            </div>
            
            <div className="contact-item">
              <IonIcon icon={callOutline} className="contact-icon" />
              <span className="contact-text">
                (022) 22621934
              </span>
            </div>
            
            <div className="contact-item">
              <IonIcon icon={mailOutline} className="contact-icon" />
              <span className="contact-text">
                regionofficemumbai21@gmail.com
              </span>
            </div>
          </div>
        </div>

        {/* Head Office Panel */}
        <div className="contact-panel head-office">
          <div className="panel-header">
            <IonIcon icon={businessOutline} className="panel-icon head-office-icon" />
            <h3>Head Office</h3>
          </div>
          
          <div className="contact-details">
            <div className="contact-item">
              <IonIcon icon={locationOutline} className="contact-icon" />
              <span className="contact-text">
                Mahatma Phule Backward Class Development Corporation, 1-N, Juhu Supreme Shopping Center, Gulmohar Cross Road No. 9, JVPD Scheme, Mumbai - 400049
              </span>
            </div>
            
            <div className="contact-item">
              <IonIcon icon={callOutline} className="contact-icon" />
              <span className="contact-text">
                (022) 26200351
              </span>
            </div>
            
            <div className="contact-item">
              <IonIcon icon={mailOutline} className="contact-icon" />
              <span className="contact-text">
                info@mpbcdc.in
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
