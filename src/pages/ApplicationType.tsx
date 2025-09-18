import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonSplitPane,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonAlert
} from '@ionic/react';
import { createOutline, trashOutline, filterOutline } from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import { useApplicationTypes } from '../hooks/useApplicationTypes';
import type { ApplicationType } from '../types';
import './ApplicationType.css';

const ApplicationType: React.FC = () => {
  const { data: applicationTypes, isLoading, error, delete: deleteApplicationType } = useApplicationTypes();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    console.log('Edit application type:', id);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (selectedId) {
      try {
        await deleteApplicationType(selectedId);
        setShowDeleteAlert(false);
        setSelectedId(null);
      } catch (error) {
        console.error('Failed to delete application type:', error);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteAlert(false);
    setSelectedId(null);
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="main-content" id="dashboard-content">
          {/* Header */}
          <DashboardHeader />
          
          {/* Application Type Content */}
          <IonContent className="application-type-content">
            <div className="application-type-container">
              {/* Page Header */}
              <div className="page-header">
                <h1 className="page-title">Application Types</h1>
                <div className="page-actions">
                  <IonButton fill="outline" size="small">
                    <IonIcon icon={filterOutline} slot="start" />
                    Filter
                  </IonButton>
                </div>
              </div>

              {/* Application Types List */}
              <div className="list-container">
                <div className="list-header">
                  <IonLabel className="column-header">
                    <span>Name</span>
                    <IonIcon icon={filterOutline} className="filter-icon" />
                  </IonLabel>
                </div>

                {isLoading ? (
                  <div className="loading-container">
                    <IonSpinner name="crescent" />
                    <p>Loading application types...</p>
                  </div>
                ) : error ? (
                  <div className="error-container">
                    <p>Error: {error}</p>
                    <IonButton fill="outline" onClick={() => {
                      // SDK-friendly refresh approach
                      if (typeof window !== 'undefined') {
                        window.location.reload();
                      }
                    }}>
                      Retry
                    </IonButton>
                  </div>
                ) : (
                  <IonList className="application-types-list">
                    {applicationTypes?.map((type) => (
                      <IonItem key={type.id} className="application-type-item">
                        <IonLabel className="application-type-name">
                          {type.name}
                        </IonLabel>
                        <div className="action-buttons" slot="end">
                          <IonButton 
                            fill="clear" 
                            size="small" 
                            className="edit-button"
                            onClick={() => handleEdit(type.id)}
                          >
                            <IonIcon icon={createOutline} />
                          </IonButton>
                          <IonButton 
                            fill="clear" 
                            size="small" 
                            className="delete-button"
                            onClick={() => handleDelete(type.id)}
                          >
                            <IonIcon icon={trashOutline} />
                          </IonButton>
                        </div>
                      </IonItem>
                    ))}
                  </IonList>
                )}
              </div>
            </div>
          </IonContent>
        </div>
      </IonSplitPane>

      {/* Delete Confirmation Alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={cancelDelete}
        header="Confirm Delete"
        message="Are you sure you want to delete this application type? This action cannot be undone."
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: cancelDelete
          },
          {
            text: 'Delete',
            role: 'destructive',
            handler: confirmDelete
          }
        ]}
      />
    </IonPage>
  );
};

export default ApplicationType;
