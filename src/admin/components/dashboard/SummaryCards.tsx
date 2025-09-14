import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol
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
  const summaryData = data
    ? [
        {
          title: 'Total Applications',
          value: data.totalApplications.toString(),
          icon: briefcaseOutline,
          color: 'var(--color-primary)'
        },
        {
          title: 'Approved',
          value: data.approvedApplications.toString(),
          icon: cashOutline,
          color: 'var(--color-success)'
        },
        {
          title: 'Pending',
          value: data.pendingApplications.toString(),
          icon: calendarOutline,
          color: 'var(--color-warning)'
        },
        {
          title: 'Rejected',
          value: data.rejectedApplications.toString(),
          icon: warningOutline,
          color: 'var(--color-error)'
        }
      ]
    : [
        {
          title: 'Total Applications',
          value: '0',
          icon: briefcaseOutline,
          color: 'var(--color-primary)'
        },
        {
          title: 'Approved',
          value: '0',
          icon: cashOutline,
          color: 'var(--color-success)'
        },
        {
          title: 'Pending',
          value: '0',
          icon: calendarOutline,
          color: 'var(--color-warning)'
        },
        {
          title: 'Rejected',
          value: '0',
          icon: warningOutline,
          color: 'var(--color-error)'
        }
      ];

  return (
    <div className="summary-cards-container">
      <IonGrid>
        <IonRow>
          {summaryData.map((card, index) => (
            <IonCol size="12" size-md="6" size-lg="3" key={index}>
              <IonCard className="summary-card">
                <IonCardContent className="summary-card-content">
                  <div className="card-row">
                    {/* Left Icon */}
                    <IonIcon
                      icon={card.icon}
                      className="card-icon"
                      style={{ color: card.color }}
                    />

                    {/* Right Text */}
                    <div className="card-text">
                      <div className="card-title">{card.title}</div>
                      <div className="card-value">{card.value}</div>
                    </div>
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
