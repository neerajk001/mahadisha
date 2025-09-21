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
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { Pagination } from '../admin/components/shared';
import { useApplicationTypes } from '../hooks/useApplicationTypes';
import type { ApplicationType } from '../types';
import './ApplicationType.css';

const ApplicationType: React.FC = () => {
  const { data: applicationTypes, isLoading, error, delete: deleteApplicationType } = useApplicationTypes();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Calculate pagination
  const totalPages = Math.ceil((applicationTypes?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicationTypes = applicationTypes?.slice(startIndex, endIndex) || [];

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
                    {currentApplicationTypes.map((type) => (
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

                  {/* Pagination */}
                  {(applicationTypes?.length || 0) > 0 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPreviousPage={handlePreviousPage}
                      onNextPage={handleNextPage}
                    />
                  )}
                  
                  {/* Bottom spacing for pagination visibility */}
                  <div style={{ height: '3rem' }}></div>
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
