import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonItem, IonLabel, IonInput
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { RejectionMasterData } from '../types';
import './RejectionMaster.css';

const RejectionMaster: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedRejectionId, setSelectedRejectionId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRejection, setEditingRejection] = useState<RejectionMasterData | null>(null);
  const [editForm, setEditForm] = useState({
    name: ''
  });

  const itemsPerPage = 5;

  // Get rejection master data from mock service
  const allRejections = mockDataService.getRejectionMasterData();
  
  // Filter rejections based on search query
  const filteredRejections = useMemo(() => {
    return allRejections.filter(rejection =>
      rejection.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allRejections, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRejections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRejections = filteredRejections.slice(startIndex, endIndex);

  const handleAddRejection = () => {
    setToastMessage('Add new rejection functionality will be implemented');
    setShowToast(true);
  };

  const handleEdit = (rejectionId: string) => {
    const rejection = allRejections.find(r => r.id === rejectionId);
    if (rejection) {
      setEditingRejection(rejection);
      setEditForm({
        name: rejection.name
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingRejection) {
      setToastMessage(`Rejection "${editForm.name}" updated successfully`);
      setShowToast(true);
      setShowEditModal(false);
      setEditingRejection(null);
      setEditForm({ name: '' });
    }
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingRejection(null);
    setEditForm({ name: '' });
  };

  const handleDelete = (rejectionId: string) => {
    setSelectedRejectionId(rejectionId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedRejectionId) {
      setToastMessage(`Delete rejection ${selectedRejectionId} functionality will be implemented`);
      setShowToast(true);
      setSelectedRejectionId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedRejectionId(null);
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
          
          <IonContent className="rejection-master-content">
            <div className="rejections-container">
              {/* Header Section */}
              <div className="rejections-header">
                <h1>Rejection Master</h1>
                <p>Manage rejection reasons and their details</p>
              </div>

              {/* Search and Actions */}
              <div className="rejections-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search rejections by name..."
                  className="rejections-search"
                />
                <IonButton 
                  fill="solid" 
                  className="add-rejection-button"
                  onClick={handleAddRejection}
                >
                  <IonIcon icon={addOutline} />
                  Add Rejection
                </IonButton>
              </div>

              {/* Rejections Table */}
              <IonCard className="rejections-table-card">
                <IonCardContent className="table-container">
                  <table className="rejections-table">
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
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRejections.map((rejection, index) => (
                        <tr key={rejection.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="rejection-name-cell">
                            <span className="rejection-name">{rejection.name}</span>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="edit-button"
                                onClick={() => handleEdit(rejection.id)}
                              >
                                <IonIcon icon={createOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="delete-button"
                                onClick={() => handleDelete(rejection.id)}
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
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredRejections.length)} of {filteredRejections.length} rejections
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

      {/* Edit Modal */}
      <IonModal 
        isOpen={showEditModal} 
        onDidDismiss={handleCloseEdit}
        backdropDismiss={true}
        showBackdrop={true}
      >
        <div className="edit-modal">
          <div className="modal-header">
            <h2>Edit Rejection</h2>
            <IonButton fill="clear" onClick={handleCloseEdit} className="close-button">
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <IonItem className="form-item">
              <IonLabel position="stacked">Rejection Name</IonLabel>
              <IonInput
                value={editForm.name}
                onIonChange={(e) => setEditForm({...editForm, name: e.detail.value!})}
                placeholder="Enter rejection name"
              />
            </IonItem>
          </div>

          <div className="modal-footer">
            <IonButton 
              fill="solid" 
              className="save-button"
              onClick={handleSaveEdit}
            >
              Save Changes
            </IonButton>
          </div>
        </div>
      </IonModal>

      {/* Delete Confirmation Alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={cancelDelete}
        header="Confirm Delete"
        message="Are you sure you want to delete this rejection? This action cannot be undone."
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

export default RejectionMaster;
