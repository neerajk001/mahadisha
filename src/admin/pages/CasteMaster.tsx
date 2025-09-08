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
import { mockDataService } from '../../services/api';
import type { CasteData } from '../../types';
import './CasteMaster.css';

const CasteMaster: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedCasteId, setSelectedCasteId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const itemsPerPage = 5;

  // Get caste data from mock service
  const allCastes = mockDataService.getCasteData();
  
  // Filter castes based on search query
  const filteredCastes = useMemo(() => {
    return allCastes.filter(caste =>
      caste.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allCastes, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCastes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCastes = filteredCastes.slice(startIndex, endIndex);

  const handleAddCaste = () => {
    setToastMessage('Add new caste functionality will be implemented');
    setShowToast(true);
  };

  const handleEdit = (casteId: string) => {
    setToastMessage(`Edit caste ${casteId} functionality will be implemented`);
    setShowToast(true);
  };

  const handleDelete = (casteId: string) => {
    setSelectedCasteId(casteId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedCasteId) {
      setToastMessage(`Delete caste ${selectedCasteId} functionality will be implemented`);
      setShowToast(true);
      setSelectedCasteId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedCasteId(null);
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
      <IonSplitPane contentId="dashboard-content" when="md">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="caste-master-content">
            <div className="castes-container">
              {/* Header Section */}
              <div className="castes-header">
                <h1>Caste Master</h1>
                <p>Manage caste categories and their names</p>
              </div>

              {/* Search and Actions */}
              <div className="castes-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search castes by name..."
                  className="castes-search"
                />
                <IonButton 
                  fill="solid" 
                  className="add-caste-button"
                  onClick={handleAddCaste}
                >
                  <IonIcon icon={addOutline} />
                  Add Caste
                </IonButton>
              </div>

              {/* Castes Table */}
              <IonCard className="castes-table-card">
                <IonCardContent className="table-container">
                  <table className="castes-table">
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
                      {currentCastes.map((caste, index) => (
                        <tr key={caste.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="caste-name-cell">
                            <span className="caste-name">{caste.name}</span>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="edit-button"
                                onClick={() => handleEdit(caste.id)}
                              >
                                <IonIcon icon={createOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="delete-button"
                                onClick={() => handleDelete(caste.id)}
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
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredCastes.length)} of {filteredCastes.length} castes
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
        message="Are you sure you want to delete this caste? This action cannot be undone."
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

export default CasteMaster;