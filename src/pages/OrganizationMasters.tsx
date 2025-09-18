import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonItem, IonLabel, IonInput, IonFab, IonFabButton, IonButtons
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  eyeOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { OrganizationMasterData } from '../types';
import './OrganizationMasters.css';
import './shared/MasterMobile.css';

const OrganizationMasters: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationMasterData | null>(null);
  const [viewingOrg, setViewingOrg] = useState<OrganizationMasterData | null>(null);
  const [editForm, setEditForm] = useState({
    name: ''
  });
  const [addForm, setAddForm] = useState({
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
    setShowAddModal(true);
  };

  const handleView = (orgId: string) => {
    const org = allOrganizations.find(o => o.id === orgId);
    if (org) {
      setViewingOrg(org);
      setShowViewModal(true);
    }
  };

  const handleSaveAdd = () => {
    setToastMessage(`Organization "${addForm.name}" created successfully`);
    setShowToast(true);
    setShowAddModal(false);
    setAddForm({ name: '' });
  };

  const handleCloseAdd = () => {
    setShowAddModal(false);
    setAddForm({ name: '' });
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
      const orgToDelete = allOrganizations.find(org => org.id === selectedOrgId);
      setToastMessage(`Organization "${orgToDelete?.name || selectedOrgId}" deleted successfully`);
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
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="caste-master-content">
            <div className="castes-container">
              {/* Header Section */}
              <div className="castes-header">
                <h1>Organization Masters</h1>
                <p>Manage organization categories and their names</p>
              </div>

              {/* Search and Actions */}
              <div className="castes-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search organizations by name..."
                  className="castes-search"
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
              <IonCard className="castes-table-card">
                <IonCardContent className="table-container">
                  <div className="mobile-table-wrapper">
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
                                className="view-button"
                                onClick={() => handleView(org.id)}
                              >
                                <IonIcon icon={eyeOutline} />
                              </IonButton>
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
                  </div>
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

      {/* Add Modal */}
      <IonModal 
        isOpen={showAddModal} 
        onDidDismiss={handleCloseAdd}
        backdropDismiss={true}
        showBackdrop={true}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add Organization</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleCloseAdd}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Create New Organization</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Organization Name"
                labelPlacement="stacked"
                value={addForm.name}
                onIonInput={(e) => setAddForm({name: e.detail.value!})}
                placeholder="Enter organization name"
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonButton 
                expand="block" 
                style={{ 
                  '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '--color': 'white',
                  '--border-radius': '12px',
                  marginTop: '1rem'
                }}
                onClick={handleSaveAdd}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Create Organization
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* View Modal */}
      <IonModal 
        isOpen={showViewModal} 
        onDidDismiss={() => setShowViewModal(false)}
        backdropDismiss={true}
        showBackdrop={true}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>View Organization Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowViewModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Organization Details: {viewingOrg?.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Organization Name</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0'
                }}>
                  {viewingOrg?.name}
                </div>
              </div>
              
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Organization ID</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  fontFamily: 'monospace'
                }}>
                  {viewingOrg?.id}
                </div>
              </div>
              
              <IonButton 
                expand="block" 
                fill="outline"
                style={{ 
                  '--border-color': '#667eea',
                  '--color': '#667eea',
                  '--border-radius': '12px',
                  marginTop: '1rem'
                }}
                onClick={() => setShowViewModal(false)}
              >
                <IonIcon icon={closeOutline} slot="start" />
                Close
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

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

      {/* Floating Action Button */}
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton className="fab-add-org" onClick={handleAddOrganization}>
          <IonIcon icon={addOutline} />
        </IonFabButton>
      </IonFab>

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
