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
  chevronBackOutline, chevronForwardOutline, closeOutline,
  checkmarkOutline, documentTextOutline, closeCircleOutline,
  swapVerticalOutline, eyeOutline, settingsOutline, copyOutline, linkOutline, timeOutline,
  peopleOutline, globeOutline, locationOutline, mapOutline, businessOutline, 
  barChartOutline, fileTrayOutline, accessibilityOutline, keyOutline, homeOutline, 
  gitBranchOutline, shieldOutline, shuffleOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import ActionDropdown from '../admin/components/common/ActionDropdown';
import { mockDataService } from '../services/api';
import type { StatusMappingData } from '../types';
import './StatusMapping.css';
import './shared/MasterMobile.css';

const StatusMapping: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMapping, setEditingMapping] = useState<StatusMappingData | null>(null);
  const [formData, setFormData] = useState({
    currentStatus: '',
    role: '',
    visibleFields: [] as string[],
    nextPossibleStatuses: [] as string[]
  });
  
  // Enhanced state for new functionality
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'status' | 'role'>('status');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 5;

  // Get status mapping data from mock service
  const allMappings = mockDataService.getStatusMappingData();
  
  // Filter and sort mappings
  const filteredAndSortedMappings = useMemo(() => {
    let filtered = allMappings.filter(mapping =>
      mapping.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.visibleFields.some(field => field.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Sort mappings
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
  }, [allMappings, searchQuery, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedMappings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMappings = filteredAndSortedMappings.slice(startIndex, endIndex);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'swapVerticalOutline': return swapVerticalOutline;
      case 'settingsOutline': return settingsOutline;
      case 'documentTextOutline': return documentTextOutline;
      case 'checkmarkOutline': return checkmarkOutline;
      case 'closeCircleOutline': return closeCircleOutline;
      default: return swapVerticalOutline;
    }
  };

  const handleAddNewMapping = () => {
    setFormData({
      currentStatus: '',
      role: '',
      visibleFields: [],
      nextPossibleStatuses: []
    });
    setShowAddModal(true);
  };

  const handleView = (mapping: StatusMappingData) => {
    setToastMessage(`Viewing status mapping: ${mapping.status}`);
    setShowToast(true);
  };

  const handleCopyName = (mappingStatus: string) => {
    navigator.clipboard.writeText(mappingStatus);
    setToastMessage('Status mapping copied to clipboard');
    setShowToast(true);
  };

  const handleEdit = (mappingId: string) => {
    const mapping = allMappings.find(m => m.id === mappingId);
    if (mapping) {
      setEditingMapping(mapping);
      setFormData({
        currentStatus: mapping.status,
        role: mapping.role,
        visibleFields: mapping.visibleFields,
        nextPossibleStatuses: mapping.nextPossibleStatuses
      });
      setShowEditModal(true);
    }
  };

  const handleSaveMapping = () => {
    if (editingMapping) {
      setToastMessage(`Status mapping "${formData.currentStatus}" updated successfully`);
    } else {
      setToastMessage(`New status mapping "${formData.currentStatus}" created successfully`);
    }
    setShowToast(true);
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingMapping(null);
    setFormData({
      currentStatus: '',
      role: '',
      visibleFields: [],
      nextPossibleStatuses: []
    });
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingMapping(null);
    setFormData({
      currentStatus: '',
      role: '',
      visibleFields: [],
      nextPossibleStatuses: []
    });
  };

  const handleDelete = (mappingId: string) => {
    setSelectedMappingId(mappingId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedMappingId) {
      setToastMessage(`Delete status mapping ${selectedMappingId} functionality will be implemented`);
      setShowToast(true);
      setSelectedMappingId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedMappingId(null);
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

  const getStatusIcon = (status: string) => {
    if (status.includes('Submitted') || status.includes('Sanctioned')) {
      return <IonIcon icon={checkmarkOutline} className="status-icon success" />;
    } else if (status.includes('Rejected') || status.includes('Incomplete')) {
      return <IonIcon icon={closeCircleOutline} className="status-icon error" />;
    } else if (status.includes('Incomplete')) {
      return <IonIcon icon={documentTextOutline} className="status-icon warning" />;
    }
    return null;
  };

  const renderVisibleFields = (fields: string[]) => {
    return fields.map((field, index) => (
      <span key={index} className="visible-field">
        {field}
        {getStatusIcon(field)}
        {index < fields.length - 1 && ', '}
      </span>
    ));
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
              <div className="pages-header">
                <h1>Status Mapping</h1>
                <p>Manage workflow status mappings and role assignments</p>
              </div>

              {/* Enhanced Search and Actions */}
              <div className="pages-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search mappings by status, role, or fields..."
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
                  onClick={handleAddNewMapping}
                >
                  <IonIcon icon={addOutline} />
                  Add New Mapping
                </IonButton>
              </div>

              {/* Status Mappings Grid */}
              {viewMode === 'grid' ? (
                <div className="branches-grid">
                  {currentMappings.map((mapping) => (
                    <div key={mapping.id} className="branch-card">
                      <div className="branch-card-header">
                        <div className="branch-card-icon">
                          <IonIcon icon={swapVerticalOutline} />
                        </div>
                        <div className="branch-card-title">
                          <h3 className="branch-card-name">{mapping.status}</h3>
                          <div className="branch-card-type">Status Mapping</div>
                        </div>
                      </div>
                      
                      <div className="branch-card-content">
                        <div className="branch-card-meta">
                          <div className="branch-card-meta-item">
                            <IonIcon icon={peopleOutline} className="branch-card-meta-icon" />
                            <span>Role: {mapping.role}</span>
                          </div>
                        </div>
                        
                        <div className="branch-card-meta">
                          <div className="branch-card-meta-item">
                            <IonIcon icon={documentTextOutline} className="branch-card-meta-icon" />
                            <span>Fields: {mapping.visibleFields.length}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="branch-card-actions">
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button view"
                          onClick={() => handleView(mapping)}
                        >
                          <IonIcon icon={eyeOutline} />
                          View
                        </IonButton>
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button edit"
                          onClick={() => handleEdit(mapping.id)}
                        >
                          <IonIcon icon={createOutline} />
                          Edit
                        </IonButton>
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button delete"
                          onClick={() => handleDelete(mapping.id)}
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
                              <span>Status</span>
                              <IonIcon icon={searchOutline} className="filter-icon" />
                            </div>
                          </th>
                          <th>
                            <div className="table-header">
                              <span>Role</span>
                              <IonIcon icon={searchOutline} className="filter-icon" />
                            </div>
                          </th>
                          <th>
                            <div className="table-header">
                              <span>Visible Fields</span>
                            </div>
                          </th>
                          <th>
                            <div className="table-header">
                              <span>Mapping Code</span>
                            </div>
                          </th>
                          <th>
                            <div className="table-header">
                              <span>Icon</span>
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
                        {currentMappings.map((mapping, index) => (
                          <tr key={mapping.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td className="name-cell">
                              <div className="page-name">
                                <IonIcon icon={swapVerticalOutline} className="page-icon" />
                                <span>{mapping.status}</span>
                              </div>
                            </td>
                            <td className="url-cell">
                              <span className="role-text">{mapping.role}</span>
                            </td>
                            <td className="url-cell">
                              <div className="visible-fields">
                                {mapping.visibleFields.slice(0, 2).map((field, idx) => (
                                  <span key={idx} className="visible-field">
                                    {field}
                                    {idx < Math.min(mapping.visibleFields.length, 2) - 1 && ', '}
                                  </span>
                                ))}
                                {mapping.visibleFields.length > 2 && (
                                  <span className="visible-field">+{mapping.visibleFields.length - 2} more</span>
                                )}
                              </div>
                            </td>
                            <td className="url-cell">
                              <code className="url-code">MAP-{mapping.id.slice(-3)}</code>
                            </td>
                            <td className="icon-cell">
                              <div className="icon-display">
                                <IonIcon icon={swapVerticalOutline} className="display-icon" />
                                <span className="icon-name">swapVerticalOutline</span>
                              </div>
                            </td>
                            <td className="actions-cell">
                              <div className="action-buttons">
                                <ActionDropdown
                                  itemId={mapping.id}
                                  onView={() => handleView(mapping)}
                                  onEdit={() => handleEdit(mapping.id)}
                                  onDelete={() => handleDelete(mapping.id)}
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
              <div className="pagination-container">
                <div className="pagination-info">
                  <p>
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedMappings.length)} of {filteredAndSortedMappings.length} mappings
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

      {/* Add Mapping Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Status Mapping</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Create New Status Mapping</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Current Status"
                labelPlacement="stacked"
                value={formData.currentStatus}
                onIonChange={(e) => setFormData({...formData, currentStatus: e.detail.value!})}
                placeholder="Search and select status"
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonInput
                label="Role"
                labelPlacement="stacked"
                value={formData.role}
                onIonChange={(e) => setFormData({...formData, role: e.detail.value!})}
                placeholder="Search and select role"
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonTextarea
                label="Visible Fields (comma separated)"
                labelPlacement="stacked"
                placeholder="Enter visible fields separated by commas"
                rows={3}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonTextarea
                label="Next Possible Statuses (comma separated)"
                labelPlacement="stacked"
                value={formData.nextPossibleStatuses.join(', ')}
                onIonChange={(e) => setFormData({...formData, nextPossibleStatuses: e.detail.value!.split(', ').filter(s => s.trim())})}
                placeholder="Enter next possible statuses separated by commas"
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
                onClick={handleSaveMapping}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Create Status Mapping
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Mapping Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Status Mapping</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Edit Status Mapping: {editingMapping?.status}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Current Status"
                labelPlacement="stacked"
                value={formData.currentStatus}
                onIonChange={(e) => setFormData({...formData, currentStatus: e.detail.value!})}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonInput
                label="Role"
                labelPlacement="stacked"
                value={formData.role}
                onIonChange={(e) => setFormData({...formData, role: e.detail.value!})}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonTextarea
                label="Visible Fields (comma separated)"
                labelPlacement="stacked"
                value={formData.visibleFields.join(', ')}
                onIonChange={(e) => setFormData({...formData, visibleFields: e.detail.value!.split(', ').filter(s => s.trim())})}
                rows={3}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonTextarea
                label="Next Possible Statuses (comma separated)"
                labelPlacement="stacked"
                value={formData.nextPossibleStatuses.join(', ')}
                onIonChange={(e) => setFormData({...formData, nextPossibleStatuses: e.detail.value!.split(', ').filter(s => s.trim())})}
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
                onClick={handleSaveMapping}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Update Status Mapping
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
        message="Are you sure you want to delete this status mapping? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Floating Action Button */}
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton className="fab-add-page" onClick={handleAddNewMapping}>
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

export default StatusMapping;
