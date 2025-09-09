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
      padding: 'clamp(2rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)',
      background: 'white',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <IonGrid>
        <IonRow>
          {stats.map((stat, index) => (
            <IonCol 
              size="12" 
              sizeSm="6"
              sizeMd="4" 
              key={index} 
              style={{ 
                textAlign: 'center',
                padding: '1rem 0.5rem'
              }}
            >
              <div style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 'bold',
                color: 'black',
                marginBottom: '0.5rem',
                lineHeight: '1.1'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                color: 'var(--ion-color-medium)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                lineHeight: '1.3'
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
