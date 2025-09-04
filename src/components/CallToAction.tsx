import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { personAddOutline } from 'ionicons/icons';

const CallToAction: React.FC = () => {
  return (
    <div style={{
      background: 'var(--ion-color-dark)',
      color: 'white',
      padding: '3rem 2rem',
      display: 'flex',
      flexDirection: window.innerWidth < 768 ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2rem'
    }}>
      <h2 style={{
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        fontWeight: 'bold',
        margin: 0,
        textAlign: window.innerWidth < 768 ? 'center' : 'left'
      }}>
        Start your journey with Maha-Disha
      </h2>
      
      <IonButton size="large" color="primary">
        <IonIcon icon={personAddOutline} slot="start" />
        Register Now
      </IonButton>
    </div>
  );
};

export default CallToAction;
