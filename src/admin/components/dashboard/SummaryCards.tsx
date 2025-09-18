import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel
} from '@ionic/react';
import {
  briefcaseOutline,
  cashOutline,
  calendarOutline,
  warningOutline
} from 'ionicons/icons';
import type { DashboardSummary } from '../../../types';
import './SummaryCards.css';

interface SummaryCardsProps {
  data?: DashboardSummary | null;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  const summaryData = data ? [
    {
      title: 'Total Requests',
      value: data.totalApplications.toString(),
      icon: briefcaseOutline,
      color: 'primary',
      bgColor: '#ffffff',
      textColor: '#333333',
      iconColor: '#3b82f6'
    },
    {
      title: 'Disbursed',
      value: '$4.5M',
      icon: cashOutline,
      color: 'success',
      bgColor: '#1e40af',
      textColor: '#ffffff',
      iconColor: '#ffffff'
    },
    {
      title: 'EMIS',
      value: '321',
      icon: calendarOutline,
      color: 'warning',
      bgColor: '#ffffff',
      textColor: '#333333',
      iconColor: '#3b82f6'
    },
    {
      title: 'Overdues',
      value: '14',
      icon: warningOutline,
      color: 'danger',
      bgColor: '#dc2626',
      textColor: '#ffffff',
      iconColor: '#ffffff'
    }
  ] : [
    {
      title: 'Total Requests',
      value: '0',
      icon: briefcaseOutline,
      color: 'primary',
      bgColor: '#ffffff',
      textColor: '#333333',
      iconColor: '#3b82f6'
    },
    {
      title: 'Disbursed',
      value: '$0',
      icon: cashOutline,
      color: 'success',
      bgColor: '#1e40af',
      textColor: '#ffffff',
      iconColor: '#ffffff'
    },
    {
      title: 'EMIS',
      value: '0',
      icon: calendarOutline,
      color: 'warning',
      bgColor: '#ffffff',
      textColor: '#333333',
      iconColor: '#3b82f6'
    },
    {
      title: 'Overdues',
      value: '0',
      icon: warningOutline,
      color: 'danger',
      bgColor: '#dc2626',
      textColor: '#ffffff',
      iconColor: '#ffffff'
    }
  ];

  return (
    <div className="summary-cards-container">
      <IonGrid>
        <IonRow>
          {summaryData.map((card, index) => (
            <IonCol size-xs="3" size-md="6" size-lg="3" key={index}>
              <IonCard 
                className="summary-card"
                style={{ 
                  backgroundColor: card.bgColor,
                  color: card.textColor
                }}
              >
                <IonCardContent className="summary-card-content">
                  <div className="card-icon" style={{ color: card.iconColor }}>
                    <IonIcon icon={card.icon} className="icon" />
                    <IonLabel style={{ color: card.textColor }} className="card-title">{card.title}</IonLabel>
                  </div>
                  <div className="card-value" style={{ color: card.textColor }}>
                    {card.value}
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default SummaryCards;
