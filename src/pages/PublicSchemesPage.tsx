import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import Header from '../components/header/Header';
import PublicSchemes from '../components/schemes/PublicSchemes';
import './PublicSchemesPage.css';

const PublicSchemesPage: React.FC = () => {
  return (
    <IonPage>
      <Header />
      <IonContent fullscreen>
        <PublicSchemes />
      </IonContent>
    </IonPage>
  );
};

export default PublicSchemesPage;
