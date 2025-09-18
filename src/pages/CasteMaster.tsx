import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonButtons, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonBadge, IonChip, IonFab, IonFabButton
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  eyeOutline, peopleOutline, documentTextOutline, timeOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { CasteData } from '../types';
import './CasteMaster.css';
import './shared/MasterMobile.css';

const CasteMaster: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedCasteId, setSelectedCasteId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Enhanced state for new functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingCaste, setEditingCaste] = useState<CasteData | null>(null);
  const [viewingCaste, setViewingCaste] = useState<CasteData | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '' });
  const [addFormData, setAddFormData] = useState({ name: '' });

  const itemsPerPage = 6;

  // State for managing castes data - EXACTLY LIKE MANAGEPAGES AND BRANCHMASTER
  const [allCastes, setAllCastes] = useState<CasteData[]>(() => mockDataService.getCasteData());
  
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
    setShowAddModal(true);
  };

  const handleEdit = (caste: CasteData) => {
    setEditingCaste(caste);
    setEditFormData({ name: caste.name });
    setShowEditModal(true);
  };

  const handleView = (caste: CasteData) => {
    setViewingCaste(caste);
    setShowViewModal(true);
  };

  const handleUpdateCaste = () => {
    if (editingCaste) {
      // Update the caste in the state - EXACTLY LIKE MANAGEPAGES
      setAllCastes(prevCastes => 
        prevCastes.map(caste => 
          caste.id === editingCaste.id 
            ? { ...caste, name: editFormData.name, updatedAt: new Date().toISOString() }
            : caste
        )
      );
      
      setToastMessage(`Caste "${editFormData.name}" updated successfully`);
      setShowToast(true);
      setShowEditModal(false);
      setEditingCaste(null);
      setEditFormData({ name: '' });
    }
  };

  const handleSaveNewCaste = () => {
    if (addFormData.name) {
      // Generate a new ID for the caste - EXACTLY LIKE MANAGEPAGES
      const newId = `caste-${Date.now()}`;
      
      // Create the new caste object - EXACTLY LIKE MANAGEPAGES
      const newCaste: CasteData = {
        id: newId,
        name: addFormData.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add the new caste to the state - EXACTLY LIKE MANAGEPAGES
      setAllCastes(prevCastes => [...prevCastes, newCaste]);
      
      setToastMessage(`Caste "${addFormData.name}" created successfully`);
      setShowToast(true);
      setShowAddModal(false);
      setAddFormData({ name: '' });
    } else {
      setToastMessage('Please enter a caste name');
      setShowToast(true);
    }
  };

  const handleDelete = (casteId: string) => {
    setSelectedCasteId(casteId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedCasteId) {
      // Get the caste name before deletion for the toast message - EXACTLY LIKE MANAGEPAGES
      const casteToDelete = allCastes.find(caste => caste.id === selectedCasteId);
      
      // Actually remove the caste from the state - EXACTLY LIKE MANAGEPAGES
      setAllCastes(prevCastes => prevCastes.filter(caste => caste.id !== selectedCasteId));
      
      setToastMessage(`Caste "${casteToDelete?.name || selectedCasteId}" deleted successfully`);
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
      <IonSplitPane contentId="dashboard-content">
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
                  onIonInput={(e) => setSearchQuery(e.detail.value!)}
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
                                className="view-button"
                                onClick={() => handleView(caste)}
                              >
                                <IonIcon icon={eyeOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="edit-button"
                                onClick={() => handleEdit(caste)}
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
                  </div>
                </IonCardContent>
              </IonCard>

              {/* Pagination - Show if there are castes */}
              {filteredCastes.length > 0 && (
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
              )}
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

      {/* Add Caste Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Caste</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Create New Caste</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Caste Name"
                labelPlacement="stacked"
                placeholder="Enter caste name"
                value={addFormData.name}
                onIonInput={(e) => setAddFormData(prev => ({ ...prev, name: e.detail.value! }))}
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
                onClick={handleSaveNewCaste}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Create Caste
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Caste Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Caste</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Edit Caste: {editingCaste?.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Caste Name"
                labelPlacement="stacked"
                value={editFormData.name}
                onIonInput={(e) => setEditFormData(prev => ({ ...prev, name: e.detail.value! }))}
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
                onClick={handleUpdateCaste}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Update Caste
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* View Caste Modal */}
      <IonModal isOpen={showViewModal} onDidDismiss={() => setShowViewModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>View Caste Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowViewModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Caste Details: {viewingCaste?.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Caste Name</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0'
                }}>
                  {viewingCaste?.name}
                </div>
              </div>
              
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Caste ID</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  fontFamily: 'monospace'
                }}>
                  {viewingCaste?.id}
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
        <IonFabButton className="fab-add-caste" onClick={handleAddCaste}>
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

export default CasteMaster;
