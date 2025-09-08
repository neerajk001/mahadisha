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
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { StatusMasterData } from '../types';
import './StatusMaster.css';

const StatusMaster: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState<StatusMasterData | null>(null);
  const [editForm, setEditForm] = useState({
    name: ''
  });

  const itemsPerPage = 5;

  // Get status master data from mock service
  const allStatuses = mockDataService.getStatusMasterData();
  
  // Filter statuses based on search query
  const filteredStatuses = useMemo(() => {
    return allStatuses.filter(status =>
      status.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allStatuses, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredStatuses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStatuses = filteredStatuses.slice(startIndex, endIndex);

  const handleAddStatus = () => {
    setToastMessage('Add new status functionality will be implemented');
    setShowToast(true);
  };

  const handleEdit = (statusId: string) => {
    const status = allStatuses.find(s => s.id === statusId);
    if (status) {
      setEditingStatus(status);
      setEditForm({
        name: status.name
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingStatus) {
      setToastMessage(`Status "${editForm.name}" updated successfully`);
      setShowToast(true);
      setShowEditModal(false);
      setEditingStatus(null);
      setEditForm({ name: '' });
    }
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingStatus(null);
    setEditForm({ name: '' });
  };

  const handleDelete = (statusId: string) => {
    setSelectedStatusId(statusId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedStatusId) {
      setToastMessage(`Delete status ${selectedStatusId} functionality will be implemented`);
      setShowToast(true);
      setSelectedStatusId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedStatusId(null);
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
          
          <IonContent className="status-master-content">
            <div className="statuses-container">
              {/* Header Section */}
              <div className="statuses-header">
                <h1>Status Master</h1>
                <p>Manage status categories and their names</p>
              </div>

              {/* Search and Actions */}
              <div className="statuses-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search statuses by name..."
                  className="statuses-search"
                />
                <IonButton 
                  fill="solid" 
                  className="add-status-button"
                  onClick={handleAddStatus}
                >
                  <IonIcon icon={addOutline} />
                  Add Status
                </IonButton>
              </div>

              {/* Statuses Table */}
              <IonCard className="statuses-table-card">
                <IonCardContent className="table-container">
                  <table className="statuses-table">
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
                      {currentStatuses.map((status, index) => (
                        <tr key={status.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="status-name-cell">
                            <span className="status-name">{status.name}</span>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="edit-button"
                                onClick={() => handleEdit(status.id)}
                              >
                                <IonIcon icon={createOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="delete-button"
                                onClick={() => handleDelete(status.id)}
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
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredStatuses.length)} of {filteredStatuses.length} statuses
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
            <h2>Edit Status</h2>
            <IonButton fill="clear" onClick={handleCloseEdit} className="close-button">
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <IonItem className="form-item">
              <IonLabel position="stacked">Enter Status name</IonLabel>
              <IonInput
                value={editForm.name}
                onIonChange={(e) => setEditForm({...editForm, name: e.detail.value!})}
                placeholder="Enter status name"
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
        message="Are you sure you want to delete this status? This action cannot be undone."
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

export default StatusMaster;
