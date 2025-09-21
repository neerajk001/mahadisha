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
  eyeOutline, settingsOutline, copyOutline, linkOutline, timeOutline,
  peopleOutline, documentTextOutline, globeOutline, locationOutline,
  mapOutline, businessOutline, barChartOutline, fileTrayOutline, accessibilityOutline,
  keyOutline, homeOutline, gitBranchOutline, shieldOutline, shuffleOutline
} from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import ActionDropdown from '../components/common/ActionDropdown';
import { Pagination } from '../components/shared';
import { MasterCard, MasterControls, MasterHeader } from '../../components/shared';
import { mockDataService } from '../../services/api';
import type { StatusMasterData } from '../../types';
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
  const [addForm, setAddForm] = useState({
    name: ''
  });
  
  // Enhanced state for new functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 5;

  // State for managing status data - REAL-TIME CRUD
  const [allStatuses, setAllStatuses] = useState<StatusMasterData[]>(() => mockDataService.getStatusMasterData());
  
  // Filter and sort statuses
  const filteredAndSortedStatuses = useMemo(() => {
    let filtered = allStatuses.filter(status =>
      status.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort statuses
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
  }, [allStatuses, searchQuery, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedStatuses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStatuses = filteredAndSortedStatuses.slice(startIndex, endIndex);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'checkmarkOutline': return checkmarkOutline;
      case 'timeOutline': return timeOutline;
      case 'settingsOutline': return settingsOutline;
      case 'documentTextOutline': return documentTextOutline;
      case 'shieldOutline': return shieldOutline;
      default: return checkmarkOutline;
    }
  };

  const handleAddStatus = () => {
    setShowAddModal(true);
  };

  const handleView = (status: StatusMasterData) => {
    setToastMessage(`Viewing status: ${status.name}`);
    setShowToast(true);
  };

  const handleCopyName = (statusName: string) => {
    navigator.clipboard.writeText(statusName);
    setToastMessage('Status name copied to clipboard');
    setShowToast(true);
  };

  const handleSaveAdd = () => {
    if (addForm.name) {
      // Generate a new ID for the status
      const newId = `status-${Date.now()}`;
      
      // Create the new status object
      const newStatus: StatusMasterData = {
        id: newId,
        name: addForm.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add the new status to the state
      setAllStatuses(prevStatuses => [...prevStatuses, newStatus]);
      
      setToastMessage(`Status "${addForm.name}" created successfully`);
      setShowToast(true);
      setShowAddModal(false);
      setAddForm({ name: '' });
    } else {
      setToastMessage('Please fill in the status name');
      setShowToast(true);
    }
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
    if (editingStatus && editForm.name) {
      // Update the status in the state
      setAllStatuses(prevStatuses => 
        prevStatuses.map(status => 
          status.id === editingStatus.id 
            ? { ...status, name: editForm.name, updatedAt: new Date().toISOString() }
            : status
        )
      );
      
      setToastMessage(`Status "${editForm.name}" updated successfully`);
      setShowToast(true);
      setShowEditModal(false);
      setEditingStatus(null);
      setEditForm({ name: '' });
    } else {
      setToastMessage('Please fill in the status name');
      setShowToast(true);
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
      // Remove the status from state
      setAllStatuses(prevStatuses => prevStatuses.filter(status => status.id !== selectedStatusId));
      
      const statusToDelete = allStatuses.find(status => status.id === selectedStatusId);
      setToastMessage(`Status "${statusToDelete?.name || selectedStatusId}" deleted successfully`);
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
      <IonSplitPane contentId="dashboard-content" when="md">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="manage-pages-content">
            <div className="pages-container">
              {/* Header Section */}
              <MasterHeader
                title="Status Master"
                subtitle="Manage status categories and their names"
              />

              {/* Enhanced Search and Actions */}
              <MasterControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search statuses by name..."
                viewMode={viewMode}
                onViewModeToggle={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                onAddNew={handleAddStatus}
                addButtonText="Add New Status"
              />

              {/* Statuses Grid */}
              {viewMode === 'grid' ? (
                <div className="master-cards-grid" style={{ padding: '1rem' }}>
                  {currentStatuses.map((status) => (
                    <MasterCard
                      key={status.id}
                      id={status.id}
                      title={status.name}
                      subtitle="Status"
                      icon={checkmarkOutline}
                      metaItems={[
                        {
                          icon: documentTextOutline,
                          label: "Code",
                          value: `STAT-${status.id.slice(-3)}`
                        },
                        {
                          icon: timeOutline,
                          label: "Status",
                          value: "Active"
                        }
                      ]}
                      onView={() => handleView(status)}
                      onEdit={() => handleEdit(status.id)}
                      onDelete={() => handleDelete(status.id)}
                    />
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
                              <span>Status Code</span>
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
                              <IonIcon icon={searchOutline} className="filter-icon" />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentStatuses.map((status, index) => (
                          <tr key={status.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td className="name-cell">
                              <div className="page-name">
                                <IonIcon icon={checkmarkOutline} className="page-icon" />
                                <span>{status.name}</span>
                              </div>
                            </td>
                            <td className="url-cell">
                              <code className="url-code">STAT-{status.id.slice(-3)}</code>
                            </td>
                            <td className="icon-cell">
                              <div className="icon-display">
                                <IonIcon icon={checkmarkOutline} className="display-icon" />
                                <span className="icon-name">checkmarkOutline</span>
                              </div>
                            </td>
                            <td className="actions-cell">
                              <div className="action-buttons">
                                <ActionDropdown
                                  itemId={status.id}
                                  onEdit={() => handleEdit(status.id)}
                                  onDelete={() => handleDelete(status.id)}
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
              {filteredAndSortedStatuses.length > 0 && (
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

      {/* Add Status Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Status</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Create New Status</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Status Name"
                labelPlacement="stacked"
                placeholder="Enter status name"
                value={addForm.name}
                onIonInput={(e) => setAddForm({ ...addForm, name: e.detail.value! })}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonInput
                label="Status Code"
                labelPlacement="stacked"
                placeholder="Enter status code"
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
                Create Status
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Status Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Status</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Edit Status: {editingStatus?.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Status Name"
                labelPlacement="stacked"
                value={editForm.name}
                onIonChange={(e) => setEditForm({...editForm, name: e.detail.value!})}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonInput
                label="Status Code"
                labelPlacement="stacked"
                placeholder="Enter status code"
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
                Update Status
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
        message="Are you sure you want to delete this status? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Floating Action Button */}
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton className="fab-add-page" onClick={handleAddStatus}>
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

export default StatusMaster;
