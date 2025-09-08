import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline
} from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { TalukaData } from '../types';
import './TalukaMaster.css';

const TalukaMaster: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedTalukaId, setSelectedTalukaId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const itemsPerPage = 5;

  // Get taluka data from mock service
  const allTalukas = mockDataService.getTalukaData();
  
  // Filter talukas based on search query
  const filteredTalukas = useMemo(() => {
    return allTalukas.filter(taluka =>
      taluka.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allTalukas, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTalukas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTalukas = filteredTalukas.slice(startIndex, endIndex);

  const handleAddTaluka = () => {
    setToastMessage('Add new taluka functionality will be implemented');
    setShowToast(true);
  };

  const handleEdit = (talukaId: string) => {
    setToastMessage(`Edit taluka ${talukaId} functionality will be implemented`);
    setShowToast(true);
  };

  const handleDelete = (talukaId: string) => {
    setSelectedTalukaId(talukaId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedTalukaId) {
      setToastMessage(`Delete taluka ${selectedTalukaId} functionality will be implemented`);
      setShowToast(true);
      setSelectedTalukaId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedTalukaId(null);
    setShowDeleteAlert(false);
  };

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

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="taluka-master-content">
            <div className="talukas-container">
              {/* Header Section */}
              <div className="talukas-header">
                <h1>Taluka Master</h1>
                <p>Manage taluka categories and their names</p>
              </div>

              {/* Search and Actions */}
              <div className="talukas-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search talukas by name..."
                  className="talukas-search"
                />
                <IonButton 
                  fill="solid" 
                  className="add-taluka-button"
                  onClick={handleAddTaluka}
                >
                  <IonIcon icon={addOutline} />
                  Add Taluka
                </IonButton>
              </div>

              {/* Talukas Table */}
              <IonCard className="talukas-table-card">
                <IonCardContent className="table-container">
                  <table className="talukas-table">
                    <thead>
                      <tr>
                        <th>
                          <div className="table-header">
                            <span>Name</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Actions</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTalukas.map((taluka, index) => (
                        <tr key={taluka.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="taluka-name-cell">
                            <span className="taluka-name">{taluka.name}</span>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="edit-button"
                                onClick={() => handleEdit(taluka.id)}
                              >
                                <IonIcon icon={createOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="delete-button"
                                onClick={() => handleDelete(taluka.id)}
                              >
                                <IonIcon icon={trashOutline} />
                              </IonButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </IonCardContent>
              </IonCard>

              {/* Pagination */}
              <div className="pagination-container">
                <div className="pagination-info">
                  <p>
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredTalukas.length)} of {filteredTalukas.length} talukas
                  </p>
                </div>
                <div className="pagination-controls">
                  <IonButton 
                    fill="clear" 
                    disabled={currentPage === 1}
                    onClick={handlePreviousPage}
                    className="pagination-button"
                  >
                    <IonIcon icon={chevronBackOutline} />
                    Previous
                  </IonButton>
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <IonButton 
                    fill="clear" 
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                    className="pagination-button"
                  >
                    Next
                    <IonIcon icon={chevronForwardOutline} />
                  </IonButton>
                </div>
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
        message="Are you sure you want to delete this taluka? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Toast for notifications */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="bottom"
      />
    </IonPage>
  );
};

export default TalukaMaster;
