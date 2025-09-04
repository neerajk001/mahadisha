import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';

const Statistics: React.FC = () => {
  const stats = [
    { value: '5 lakh+', label: 'Beneficiaries' },
    { value: '1000+', label: 'Villages Covered' },
    { value: '₹ 150 Cr+', label: 'Amount Disbursed' },
  ];

  return (
    <div style={{
      padding: '3rem 2rem',
      background: 'var(--ion-color-light)'
    }}>
      <IonGrid>
        <IonRow>
          {stats.map((stat, index) => (
            <IonCol size="12" sizeMd="4" key={index} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 'bold',
                color: 'var(--ion-color-primary)',
                marginBottom: '0.5rem'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '1.1rem',
                color: 'var(--ion-color-medium)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {stat.label}
              </div>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default Statistics;
