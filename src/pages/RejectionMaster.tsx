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
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  eyeOutline, settingsOutline, copyOutline, linkOutline, timeOutline,
  peopleOutline, documentTextOutline, globeOutline, locationOutline,
  mapOutline, businessOutline, barChartOutline, fileTrayOutline, accessibilityOutline,
  keyOutline, homeOutline, gitBranchOutline, shieldOutline, shuffleOutline,
  closeCircleOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import ActionDropdown from '../admin/components/common/ActionDropdown';
import { Pagination } from '../admin/components/shared';
import { MasterCard, MasterControls, MasterHeader, ScrollableTableContainer } from '../components/shared';
import { mockDataService } from '../services/api';
import type { RejectionMasterData } from '../types';
import './RejectionMaster.css';
import './shared/MasterMobile.css';

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
  
  // Enhanced state for new functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [newRejection, setNewRejection] = useState({
    name: ''
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Make it a state variable

  // State for managing rejection data - REAL-TIME CRUD
  const [allRejections, setAllRejections] = useState<RejectionMasterData[]>(() => mockDataService.getRejectionMasterData());
  
  // Filter and sort rejections
  const filteredAndSortedRejections = useMemo(() => {
    let filtered = allRejections.filter(rejection =>
      rejection.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort rejections
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
  }, [allRejections, searchQuery, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedRejections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRejections = filteredAndSortedRejections.slice(startIndex, endIndex);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'closeCircleOutline': return closeCircleOutline;
      case 'trashOutline': return trashOutline;
      case 'documentTextOutline': return documentTextOutline;
      case 'settingsOutline': return settingsOutline;
      case 'shieldOutline': return shieldOutline;
      default: return closeCircleOutline;
    }
  };

  const handleAddRejection = () => {
    setNewRejection({ name: '' });
    setShowAddModal(true);
  };

  const handleView = (rejection: RejectionMasterData) => {
    setEditingRejection(rejection);
    setEditForm({
      name: rejection.name
    });
    // Set view-only mode by showing the edit modal but disabling edits
    setShowEditModal(true);
  };

  const handleCopyName = (rejectionName: string) => {
    navigator.clipboard.writeText(rejectionName);
    setToastMessage('Rejection name copied to clipboard');
    setShowToast(true);
  };

  const handleSaveAdd = () => {
    if (newRejection.name.trim()) {
      // Generate a new ID for the rejection
      const newId = `rejection-${Date.now()}`;
      
      // Create the new rejection object
      const newRejectionData: RejectionMasterData = {
        id: newId,
        name: newRejection.name.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add the new rejection to the state
      setAllRejections(prevRejections => [...prevRejections, newRejectionData]);
      
      setToastMessage(`Rejection "${newRejection.name}" added successfully`);
      setShowToast(true);
      setShowAddModal(false);
      setNewRejection({ name: '' });
    } else {
      setToastMessage('Please enter a rejection name');
      setShowToast(true);
    }
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
    if (editingRejection && editForm.name.trim()) {
      // Update the rejection in the state
      setAllRejections(prevRejections => 
        prevRejections.map(rejection => 
          rejection.id === editingRejection.id 
            ? { ...rejection, name: editForm.name.trim(), updatedAt: new Date().toISOString() }
            : rejection
        )
      );
      
      setToastMessage(`Rejection "${editForm.name}" updated successfully`);
      setShowToast(true);
      setShowEditModal(false);
      setEditingRejection(null);
      setEditForm({ name: '' });
    } else {
      setToastMessage('Please enter a rejection name');
      setShowToast(true);
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
      // Remove the rejection from state
      setAllRejections(prevRejections => prevRejections.filter(rejection => rejection.id !== selectedRejectionId));
      
      const rejectionToDelete = allRejections.find(rejection => rejection.id === selectedRejectionId);
      setToastMessage(`Rejection "${rejectionToDelete?.name || selectedRejectionId}" deleted successfully`);
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
          
          <IonContent className="manage-pages-content">
            <div className="pages-container">
              {/* Header Section */}
              <MasterHeader
                title="Rejection Master"
                subtitle="Manage rejection reasons and their details"
              />

              {/* Enhanced Search and Actions */}
              <MasterControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search rejections by name..."
                viewMode={viewMode}
                onViewModeToggle={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                onAddNew={handleAddRejection}
                addButtonText="Add New Rejection"
              />

              {/* Rejections Grid */}
              {viewMode === 'grid' ? (
                <div className="master-cards-grid" style={{ padding: '1rem' }}>
                  {currentRejections.map((rejection) => (
                    <MasterCard
                      key={rejection.id}
                      id={rejection.id}
                      title={rejection.name}
                      subtitle="Rejection Reason"
                      icon={closeCircleOutline}
                      metaItems={[
                        {
                          icon: documentTextOutline,
                          label: "Code",
                          value: `REJ-${rejection.id.slice(-3)}`
                        },
                        {
                          icon: timeOutline,
                          label: "Type",
                          value: "Standard"
                        }
                      ]}
                      onView={() => handleView(rejection)}
                      onEdit={() => handleEdit(rejection.id)}
                      onDelete={() => handleDelete(rejection.id)}
                    />
                  ))}
                </div>
              ) : (
                <ScrollableTableContainer cardClassName="rejections-table-card">
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
                            <span>Rejection Code</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Icon</span>
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
                          <td className="name-cell">
                            <div className="page-name">
                              <IonIcon icon={closeCircleOutline} className="page-icon" />
                              <span>{rejection.name}</span>
                            </div>
                          </td>
                          <td className="url-cell">
                            <code className="url-code">REJ-{rejection.id.slice(-3)}</code>
                          </td>
                          <td className="icon-cell">
                            <div className="icon-display">
                              <IonIcon icon={closeCircleOutline} className="display-icon" />
                              <span className="icon-name">closeCircleOutline</span>
                            </div>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <ActionDropdown
                                itemId={rejection.id}
                                onView={() => handleView(rejection)}
                                onEdit={() => handleEdit(rejection.id)}
                                onDelete={() => handleDelete(rejection.id)}
                                size="small"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollableTableContainer>
              )}

              {/* Pagination */}
              {filteredAndSortedRejections.length > 0 && (
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

      {/* Add Rejection Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Rejection</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Create New Rejection</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Rejection Name"
                labelPlacement="stacked"
                placeholder="Enter rejection reason name"
                value={newRejection.name}
                onIonChange={(e) => setNewRejection({...newRejection, name: e.detail.value!})}
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
                onClick={handleSaveAdd}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Create Rejection
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Rejection Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Rejection</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Edit Rejection: {editingRejection?.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Rejection Name"
                labelPlacement="stacked"
                value={editForm.name}
                onIonChange={(e) => setEditForm({...editForm, name: e.detail.value!})}
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
                onClick={handleSaveEdit}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Update Rejection
              </IonButton>
            </div>
          </div>
        </IonContent>
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
