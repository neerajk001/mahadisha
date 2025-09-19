import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonButtons, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonBadge, IonChip
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  keyOutline, homeOutline, gitBranchOutline, shieldOutline,
  shuffleOutline, barChartOutline, fileTrayOutline, accessibilityOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  eyeOutline, settingsOutline, copyOutline, linkOutline, timeOutline,
  peopleOutline, documentTextOutline, globeOutline
} from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import ActionDropdown from '../components/common/ActionDropdown';
import { Pagination } from '../components/shared';
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
  
  // Enhanced state for new functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCaste, setEditingCaste] = useState<CasteData | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 6;

  // Get caste data from mock service
  const allCastes = mockDataService.getCasteData();
  
  // Filter and sort castes
  const filteredAndSortedCastes = useMemo(() => {
    let filtered = allCastes.filter(caste =>
      caste.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort castes
    filtered.sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];
      
      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    });

    return filtered;
  }, [allCastes, searchQuery, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedCastes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCastes = filteredAndSortedCastes.slice(startIndex, endIndex);

  const handleAddCaste = () => {
    setShowAddModal(true);
  };

  const handleEdit = (caste: CasteData) => {
    setEditingCaste(caste);
    setShowEditModal(true);
  };

  const handleView = (caste: CasteData) => {
    setToastMessage(`Viewing caste: ${caste.name}`);
    setShowToast(true);
  };

  const handleCopyName = (casteName: string) => {
    navigator.clipboard.writeText(casteName);
    setToastMessage('Caste name copied to clipboard');
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

  const handleSaveCaste = () => {
    setToastMessage('Caste saved successfully');
    setShowToast(true);
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingCaste(null);
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content" when="md">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="manage-pages-content">
            <div className="pages-container">
              {/* Header Section */}
              <div className="pages-header">
                <h1>Caste Master</h1>
                <p>Manage caste categories and their names</p>
              </div>

              {/* Enhanced Search and Actions */}
              <div className="pages-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search castes by name..."
                  className="pages-search"
                />
                <IonButton 
                  fill="outline" 
                  size="small"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                >
                  <IonIcon icon={viewMode === 'grid' ? barChartOutline : eyeOutline} />
                  {viewMode === 'grid' ? 'Table View' : 'Grid View'}
                </IonButton>
                <IonButton 
                  fill="solid" 
                  className="add-page-button"
                  onClick={handleAddCaste}
                >
                  <IonIcon icon={addOutline} />
                  Add New Caste
                </IonButton>
              </div>

              {/* Castes Grid */}
              {viewMode === 'grid' ? (
                <div className="branches-grid">
                  {currentCastes.map((caste) => (
                    <div key={caste.id} className="branch-card">
                      <div className="branch-card-header">
                        <div className="branch-card-icon">
                          <IonIcon icon={peopleOutline} />
                        </div>
                        <div className="branch-card-title">
                          <h3 className="branch-card-name">{caste.name}</h3>
                          <div className="branch-card-type">Caste Category</div>
                        </div>
                      </div>
                      
                      <div className="branch-card-content">
                        <div className="branch-card-meta">
                          <div className="branch-card-meta-item">
                            <IonIcon icon={documentTextOutline} className="branch-card-meta-icon" />
                            <span>ID: {caste.id}</span>
                          </div>
                        </div>
                        
                        <div className="branch-card-meta">
                          <div className="branch-card-meta-item">
                            <IonIcon icon={timeOutline} className="branch-card-meta-icon" />
                            <span>Status: Active</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="branch-card-actions">
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button view"
                          onClick={() => handleView(caste)}
                        >
                          <IonIcon icon={eyeOutline} />
                          View
                        </IonButton>
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button edit"
                          onClick={() => handleEdit(caste)}
                        >
                          <IonIcon icon={createOutline} />
                          Edit
                        </IonButton>
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button delete"
                          onClick={() => handleDelete(caste.id)}
                        >
                          <IonIcon icon={trashOutline} />
                          Delete
                        </IonButton>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <IonCard className="pages-table-card">
                  <IonCardContent className="table-container">
                    <table className="pages-table">
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
                              <span>ID</span>
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
                            <td className="name-cell">
                              <div className="page-name">
                                <IonIcon icon={peopleOutline} className="page-icon" />
                                <span>{caste.name}</span>
                              </div>
                            </td>
                            <td className="url-cell">
                              <code className="url-code">{caste.id}</code>
                            </td>
                            <td className="actions-cell">
                              <div className="action-buttons">
                                <ActionDropdown
                                  itemId={caste.id}
                                  onEdit={() => handleEdit(caste)}
                                  onDelete={() => handleDelete(caste.id)}
                                  size="small"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </IonCardContent>
                </IonCard>
              )}

              {/* Pagination */}
              {filteredAndSortedCastes.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPreviousPage={handlePreviousPage}
                  onNextPage={handleNextPage}
                />
              )}
              
              {/* Bottom spacing for pagination visibility */}
              <div style={{ height: '3rem' }}></div>
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
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonTextarea
                label="Description (Optional)"
                labelPlacement="stacked"
                placeholder="Enter description"
                rows={3}
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
                onClick={handleSaveCaste}
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
                value={editingCaste?.name}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonTextarea
                label="Description (Optional)"
                labelPlacement="stacked"
                placeholder="Enter description"
                rows={3}
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
                onClick={handleSaveCaste}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Update Caste
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>


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