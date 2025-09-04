import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/react';
import { cashOutline, cardOutline, giftOutline, arrowForwardOutline } from 'ionicons/icons';
import './SchemeCategories.css';

const SchemeCategories: React.FC = () => {
  const schemes = [
    {
      title: 'Direct Finance Scheme',
      description: 'Empowering rural entrepreneurs through direct credit.',
      icon: cashOutline,
      color: 'primary'
    },
    {
      title: 'Margin Money Scheme',
      description: 'Bridging credit gaps for small businesses.',
      icon: cardOutline,
      color: 'secondary'
    },
    {
      title: 'Subsidy Scheme',
      description: 'Providing subsidies for economic upliftment.',
      icon: giftOutline,
      color: 'tertiary'
    },
  ];

  return (
    <div className="scheme-categories">
      <h2 className="scheme-categories__title">
        Scheme Categories
      </h2>
      
      {/* State Schemes Button - Above the cards */}
      <div className="scheme-categories__state-button-container">
        <IonButton 
          className="scheme-categories__state-button"
          fill="outline" 
          color="primary"
          size="large"
          expand="block"
        >
          STATE SCHEMES
        </IonButton>
      </div>
      
      <IonGrid>
        <IonRow>
          {schemes.map((scheme, index) => (
            <IonCol size="12" sizeMd="4" key={index}>
              <IonCard className="scheme-categories__card">
                <IonCardHeader>
                  <div className="scheme-categories__icon-container">
                    <IonIcon 
                      icon={scheme.icon} 
                      className="scheme-categories__icon"
                      style={{ color: `var(--ion-color-${scheme.color})` }}
                    />
                  </div>
                  <IonCardTitle>{scheme.title}</IonCardTitle>
                </IonCardHeader>
                
                <IonCardContent>
                  <p className="scheme-categories__description">
                    {scheme.description}
                  </p>
                  
                  <IonButton fill="clear" color={scheme.color}>
                    View Details
                    <IonIcon icon={arrowForwardOutline} slot="end" />
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default SchemeCategories;
