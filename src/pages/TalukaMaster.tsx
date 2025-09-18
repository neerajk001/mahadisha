import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonButtons, IonInput, IonFab, IonFabButton
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  eyeOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { TalukaData } from '../types';
import './TalukaMaster.css';
import './shared/MasterMobile.css';

const TalukaMaster: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedTalukaId, setSelectedTalukaId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Enhanced state for new functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTaluka, setEditingTaluka] = useState<TalukaData | null>(null);
  const [viewingTaluka, setViewingTaluka] = useState<TalukaData | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '' });

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
    setShowAddModal(true);
  };

  const handleEdit = (taluka: TalukaData) => {
    setEditingTaluka(taluka);
    setEditFormData({ name: taluka.name });
    setShowEditModal(true);
  };

  const handleView = (taluka: TalukaData) => {
    setViewingTaluka(taluka);
    setShowViewModal(true);
  };

  const handleUpdateTaluka = () => {
    if (editingTaluka) {
      setToastMessage(`Taluka "${editFormData.name}" updated successfully`);
      setShowToast(true);
      setShowEditModal(false);
      setEditingTaluka(null);
      setEditFormData({ name: '' });
    }
  };

  const handleSaveTaluka = () => {
    setToastMessage('New taluka created successfully');
    setShowToast(true);
    setShowAddModal(false);
  };

  const handleDelete = (talukaId: string) => {
    setSelectedTalukaId(talukaId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedTalukaId) {
      const talukaToDelete = allTalukas.find(taluka => taluka.id === selectedTalukaId);
      setToastMessage(`Taluka "${talukaToDelete?.name || selectedTalukaId}" deleted successfully`);
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
          
          <IonContent className="caste-master-content">
            <div className="castes-container">
              {/* Header Section */}
              <div className="castes-header">
                <h1>Taluka Master</h1>
                <p>Manage taluka categories and their names</p>
              </div>

              {/* Search and Actions */}
              <div className="castes-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search talukas by name..."
                  className="castes-search"
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
                                className="view-button"
                                onClick={() => handleView(taluka)}
                              >
                                <IonIcon icon={eyeOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="edit-button"
                                onClick={() => handleEdit(taluka)}
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
                  </div>
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

      {/* Add Taluka Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Taluka</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Create New Taluka</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Taluka Name"
                labelPlacement="stacked"
                placeholder="Enter taluka name"
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
                onClick={handleSaveTaluka}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Create Taluka
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Taluka Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Taluka</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Edit Taluka: {editingTaluka?.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Taluka Name"
                labelPlacement="stacked"
                value={editFormData.name}
                onIonInput={(e) => setEditFormData({name: e.detail.value!})}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonButton 
                expand="block" 
                style={{ 
                  '--background': 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                  '--color': 'white',
                  '--border-radius': '12px',
                  marginTop: '1rem'
                }}
                onClick={handleUpdateTaluka}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Update Taluka
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* View Taluka Modal */}
      <IonModal isOpen={showViewModal} onDidDismiss={() => setShowViewModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>View Taluka Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowViewModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Taluka Details: {viewingTaluka?.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Taluka Name</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0'
                }}>
                  {viewingTaluka?.name}
                </div>
              </div>
              
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Taluka ID</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  fontFamily: 'monospace'
                }}>
                  {viewingTaluka?.id}
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

      {/* Floating Action Button */}
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton className="fab-add-taluka" onClick={handleAddTaluka}>
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

export default TalukaMaster;
