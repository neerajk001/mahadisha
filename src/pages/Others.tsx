import React from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle
} from '@ionic/react';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import './Others.css';

const Others: React.FC = () => {
  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="others-content">
            <div className="others-container">
              {/* Header Section */}
              <div className="others-header">
                <h1>Others</h1>
                <p>Additional utilities and tools</p>
              </div>

              {/* Content Card */}
              <IonCard className="others-card">
                <IonCardHeader>
                  <IonCardTitle>Additional Features</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>This page will contain additional utilities and tools.</p>
                  <p>Features to be implemented:</p>
                  <ul>
                    <li>System utilities</li>
                    <li>Administrative tools</li>
                    <li>Help and documentation</li>
                    <li>System maintenance</li>
                    <li>Backup and restore</li>
                    <li>Log management</li>
                  </ul>
                </IonCardContent>
              </IonCard>
            </div>
          </IonContent>
        </div>
      </IonSplitPane>
    </IonPage>
  );
};

export default Others;
