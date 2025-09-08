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
import { mockDataService } from '../../services/api';
import type { OrganizationMasterData } from '../../types';
import './OrganizationMasters.css';

const OrganizationMasters: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationMasterData | null>(null);
  const [editForm, setEditForm] = useState({
    name: ''
  });

  const itemsPerPage = 5;

  // Get organization master data from mock service
  const allOrganizations = mockDataService.getOrganizationMasterData();
  
  // Filter organizations based on search query
  const filteredOrganizations = useMemo(() => {
    return allOrganizations.filter(org =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allOrganizations, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrganizations = filteredOrganizations.slice(startIndex, endIndex);

  const handleAddOrganization = () => {
    setToastMessage('Add new organization functionality will be implemented');
    setShowToast(true);
  };

  const handleEdit = (orgId: string) => {
    const org = allOrganizations.find(o => o.id === orgId);
    if (org) {
      setEditingOrg(org);
      setEditForm({
        name: org.name
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingOrg) {
      setToastMessage(`Organization "${editForm.name}" updated successfully`);
      setShowToast(true);
      setShowEditModal(false);
      setEditingOrg(null);
      setEditForm({ name: '' });
    }
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingOrg(null);
    setEditForm({ name: '' });
  };

  const handleDelete = (orgId: string) => {
    setSelectedOrgId(orgId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedOrgId) {
      setToastMessage(`Delete organization ${selectedOrgId} functionality will be implemented`);
      setShowToast(true);
      setSelectedOrgId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedOrgId(null);
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
          
          <IonContent className="organization-masters-content">
            <div className="organizations-container">
              {/* Header Section */}
              <div className="organizations-header">
                <h1>Organization Masters</h1>
                <p>Manage organization categories and their names</p>
              </div>

              {/* Search and Actions */}
              <div className="organizations-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search organizations by name..."
                  className="organizations-search"
                />
                <IonButton 
                  fill="solid" 
                  className="add-organization-button"
                  onClick={handleAddOrganization}
                >
                  <IonIcon icon={addOutline} />
                  Add Organization
                </IonButton>
              </div>

              {/* Organizations Table */}
              <IonCard className="organizations-table-card">
                <IonCardContent className="table-container">
                  <table className="organizations-table">
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
                      {currentOrganizations.map((org, index) => (
                        <tr key={org.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="organization-name-cell">
                            <span className="organization-name">{org.name}</span>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="edit-button"
                                onClick={() => handleEdit(org.id)}
                              >
                                <IonIcon icon={createOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="delete-button"
                                onClick={() => handleDelete(org.id)}
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
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredOrganizations.length)} of {filteredOrganizations.length} organizations
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
            <h2>Edit Org</h2>
            <IonButton fill="clear" onClick={handleCloseEdit} className="close-button">
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <IonItem className="form-item">
              <IonLabel position="stacked">Enter Organisation name</IonLabel>
              <IonInput
                value={editForm.name}
                onIonChange={(e) => setEditForm({...editForm, name: e.detail.value!})}
                placeholder="Enter organisation name"
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
        message="Are you sure you want to delete this organization? This action cannot be undone."
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

export default OrganizationMasters;
