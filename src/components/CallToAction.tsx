import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { personAddOutline } from 'ionicons/icons';

const CallToAction: React.FC = () => {
  return (
    <div style={{
      background: '#03002e', // Dark blue background
      color: 'white',
      padding: 'clamp(1.5rem, 3vw, 2rem) clamp(1rem, 3vw, 2rem)',
      display: 'flex',
      flexDirection: window.innerWidth < 768 ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'clamp(1rem, 2vw, 2rem)',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <h2 style={{
        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
        fontWeight: 'bold',
        margin: 0,
        color: 'white',
        lineHeight: '1.3',
        textAlign: window.innerWidth < 768 ? 'center' : 'left',
        flex: 1
      }}>
        Start your journey with Maha-Disha
      </h2>
      
      <IonButton 
        size="default" 
        style={{
          '--background': 'white',
          '--color': 'black',
          '--background-hover': '#f5f5f5',
          '--color-hover': 'black',
          '--padding-start': '1.5rem',
          '--padding-end': '1.5rem',
          '--padding-top': '0.75rem',
          '--padding-bottom': '0.75rem',
          minHeight: '44px',
          flexShrink: 0
        }}
      >
        <IonIcon icon={personAddOutline} slot="start" />
        Register Now
      </IonButton>
    </div>
  );
};

export default CallToAction;
