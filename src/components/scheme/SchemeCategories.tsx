import React, { useState } from 'react';
import { 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle, 
  IonButton, 
  IonIcon, 
  IonGrid, 
  IonRow, 
  IonCol,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from '@ionic/react';
import { cashOutline, cardOutline, giftOutline, arrowForwardOutline, closeOutline, globeOutline, documentTextOutline } from 'ionicons/icons';
import './SchemeCategories.css';

const SchemeCategories: React.FC = () => {
  const [selectedScheme, setSelectedScheme] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('State Schemes');

  const schemes = [
    {
      title: 'Direct Finance Scheme',
      description: 'Empowering rural entrepreneurs through direct credit.',
      icon: cashOutline,
      color: 'primary',
      hasModal: true,
      modalTitle: 'Direct Finance Scheme (State)',
      details: [
        { label: 'Loan Range', value: '₹50,001 - ₹5,00,000' },
        { label: 'Subsidy', value: '100% (Max ₹50,000)' },
        { label: 'Own Contribution', value: '5%' },
        { label: 'MPBCDC Interest', value: '4%' },
        { label: 'Partner Share', value: '75%' },
        { label: 'Tenure', value: '3 - 5 years' },
        { label: 'Interest', value: 'Simple Interest' }
      ]
    },
    {
      title: 'Margin Money Scheme',
      description: 'Bridging credit gaps for small businesses.',
      icon: cardOutline,
      color: 'secondary',
      hasModal: true,
      modalTitle: 'Margin Money Scheme (State)',
      details: [
        { label: 'Loan Range', value: '₹50,001 - ₹5,00,000' },
        { label: 'Subsidy', value: '100% (Max ₹50,000)' },
        { label: 'Own Contribution', value: '5%' },
        { label: 'MPBCDC Interest', value: '4%' },
        { label: 'Partner Share', value: '75%' },
        { label: 'Tenure', value: '3 - 5 years' },
        { label: 'Interest', value: 'Simple Interest' }
      ]
    },
    {
      title: 'Subsidy Scheme',
      description: 'Providing subsidies for economic upliftment.',
      icon: giftOutline,
      color: 'tertiary',
      hasModal: true,
      modalTitle: 'Subsidy Scheme (State)',
      details: [
        { label: 'Loan Range', value: '₹0 - ₹50,000' },
        { label: 'Subsidy', value: '100% (Max ₹25,000)' },
        { label: 'Own Contribution', value: '0%' },
        { label: 'MPBCDC Interest', value: '0%' },
        { label: 'Partner Share', value: '50%' },
        { label: 'Tenure', value: '0 - 3 years' },
        { label: 'Interest', value: 'Simple Interest' }
      ]
    },
  ];

  const openModal = (schemeTitle: string) => {
    setSelectedScheme(schemeTitle);
  };

  const closeModal = () => {
    setSelectedScheme(null);
  };

  const getSelectedSchemeData = () => {
    return schemes.find(scheme => scheme.title === selectedScheme);
  };

  const schemeTabs = [
    { name: 'State Schemes', icon: globeOutline },
    { name: 'NSFDC Schemes', icon: globeOutline },
    { name: 'SFDVScheme', icon: documentTextOutline },
    { name: 'Central Schemes', icon: globeOutline },
    { name: 'Bank Schemes', icon: cashOutline },
    { name: 'Cooperative Schemes', icon: cardOutline },
    { name: 'Women Schemes', icon: giftOutline },
    { name: 'Youth Schemes', icon: arrowForwardOutline },
    { name: 'Senior Citizen Schemes', icon: documentTextOutline },
    { name: 'Farmer Schemes', icon: globeOutline }
  ];

  return (
    <div className="scheme-categories">
      <div className="scheme-header-row">
        <h2 className="scheme-categories__title">
          Scheme Categories
        </h2>
        
        {/* Horizontal scrollable tabs */}
        <div className="scheme-tabs-container">
          <div className="scheme-tabs">
            {schemeTabs.map((tab, index) => (
              <div 
                key={index}
                className={`scheme-tab ${activeTab === tab.name ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.name)}
              >
                <IonIcon icon={tab.icon} className="scheme-tab-icon" />
                <span className="scheme-tab-text">{tab.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <IonGrid>
        <IonRow>
          {schemes.map((scheme, index) => (
            <IonCol size="12" sizeMd="4" key={index}>
              <IonCard className="scheme-card">
                <IonCardHeader className="scheme-card__header">
                  <div className="scheme-card__icon-container">
                    <IonIcon
                      icon={scheme.icon}
                      className="scheme-card__icon"
                      style={{ color: `var(--ion-color-${scheme.color})` }}
                    />
                  </div>
                  <IonCardTitle className="scheme-card__title">
                    {scheme.title}
                  </IonCardTitle>
                </IonCardHeader>

                <IonCardContent className="scheme-card__content">
                  <p className="scheme-card__description">
                    {scheme.description}
                  </p>

                  <IonButton
                    fill="clear"
                    color={scheme.color}
                    className="scheme-card__button"
                    onClick={() => scheme.hasModal ? openModal(scheme.title) : null}
                  >
                    {scheme.hasModal ? 'Read More' : 'View Details'}
                    <IonIcon icon={arrowForwardOutline} slot="end" />
                  </IonButton>
                </IonCardContent>
              </IonCard>


            </IonCol>
          ))}

        </IonRow>
      </IonGrid>

      {/* Modal for Scheme Details */}
      <IonModal isOpen={!!selectedScheme} onDidDismiss={closeModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{getSelectedSchemeData()?.modalTitle}</IonTitle>
            <IonButton slot="end" fill="clear" onClick={closeModal}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        
        <IonContent className="scheme-modal-content">
          <div className="scheme-details">
            {getSelectedSchemeData()?.details?.map((detail, index) => (
              <div key={index} className="scheme-detail-item">
                <span className="detail-label">{detail.label}:</span>
                <span className="detail-value">{detail.value}</span>
              </div>
            ))}
          </div>
          
          <div className="scheme-modal-actions">
            <IonButton 
              expand="block" 
              className="apply-now-btn"
              onClick={closeModal}
            >
              Apply Now
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
    </div>
  );
};

export default SchemeCategories;
