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
  
  // Enhanced state for new functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 5;

  // Get organization master data from mock service
  const allOrganizations = mockDataService.getOrganizationMasterData();
  
  // Filter and sort organizations
  const filteredAndSortedOrganizations = useMemo(() => {
    let filtered = allOrganizations.filter(org =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort organizations
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
  }, [allOrganizations, searchQuery, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedOrganizations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrganizations = filteredAndSortedOrganizations.slice(startIndex, endIndex);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'businessOutline': return businessOutline;
      case 'peopleOutline': return peopleOutline;
      case 'globeOutline': return globeOutline;
      case 'homeOutline': return homeOutline;
      case 'settingsOutline': return settingsOutline;
      default: return businessOutline;
    }
  };

  const handleAddOrganization = () => {
    setShowAddModal(true);
  };

  const handleView = (org: OrganizationMasterData) => {
    setToastMessage(`Viewing organization: ${org.name}`);
    setShowToast(true);
  };

  const handleCopyName = (orgName: string) => {
    navigator.clipboard.writeText(orgName);
    setToastMessage('Organization name copied to clipboard');
    setShowToast(true);
  };

  const handleSaveOrganization = () => {
    setToastMessage('Organization saved successfully');
    setShowToast(true);
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingOrg(null);
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
          
          <IonContent className="manage-pages-content">
            <div className="pages-container">
              {/* Header Section */}
              <div className="pages-header">
                <h1>Organization Masters</h1>
                <p>Manage organization categories and their names</p>
              </div>

              {/* Enhanced Search and Actions */}
              <div className="pages-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search organizations by name..."
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
                  onClick={handleAddOrganization}
                >
                  <IonIcon icon={addOutline} />
                  Add New Organization
                </IonButton>
              </div>

              {/* Modern Organizations Grid */}
              {viewMode === 'grid' ? (
                <div className="pages-grid">
                  {currentOrganizations.map((org) => (
                    <div key={org.id} className="page-card">
                      <div className="page-card-header">
                        <div className="page-card-icon">
                          <IonIcon icon={businessOutline} />
                        </div>
                        <div className="page-card-title">
                          <h3 className="page-card-name">{org.name}</h3>
                          <div className="page-card-url">Organization</div>
                        </div>
                      </div>
                      
                      <div className="page-card-content">
                        <div className="page-card-meta">
                          <div className="page-card-meta-item">
                            <IonIcon icon={documentTextOutline} className="page-card-meta-icon" />
                            <span>ID: {org.id}</span>
                          </div>
                          <div className="page-card-meta-item">
                            <IonIcon icon={timeOutline} className="page-card-meta-icon" />
                            <span>Active</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="page-card-actions">
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="page-card-button edit"
                          onClick={() => handleView(org)}
                        >
                          <IonIcon icon={eyeOutline} />
                          View
                        </IonButton>
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="page-card-button edit"
                          onClick={() => handleEdit(org.id)}
                        >
                          <IonIcon icon={createOutline} />
                          Edit
                        </IonButton>
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="page-card-button delete"
                          onClick={() => handleDelete(org.id)}
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
                              <span>Organization Code</span>
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
                        {currentOrganizations.map((org, index) => (
                          <tr key={org.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td className="name-cell">
                              <div className="page-name">
                                <IonIcon icon={businessOutline} className="page-icon" />
                                <span>{org.name}</span>
                              </div>
                            </td>
                            <td className="url-cell">
                              <code className="url-code">ORG-{org.id.slice(-3)}</code>
                            </td>
                            <td className="icon-cell">
                              <div className="icon-display">
                                <IonIcon icon={businessOutline} className="display-icon" />
                                <span className="icon-name">businessOutline</span>
                              </div>
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
              )}

              {/* Pagination */}
              <div className="pagination-container">
                <div className="pagination-info">
                  <p>
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedOrganizations.length)} of {filteredAndSortedOrganizations.length} organizations
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

      {/* Add Organization Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Organization</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>
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
                placeholder="Enter organization name"
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonInput
                label="Organization Code"
                labelPlacement="stacked"
                placeholder="Enter organization code"
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
                onClick={handleSaveOrganization}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Create Organization
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Organization Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Organization</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Edit Organization: {editingOrg?.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Organization Name"
                labelPlacement="stacked"
                value={editForm.name}
                onIonChange={(e) => setEditForm({...editForm, name: e.detail.value!})}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonInput
                label="Organization Code"
                labelPlacement="stacked"
                placeholder="Enter organization code"
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
                Update Organization
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
        message="Are you sure you want to delete this organization? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Floating Action Button */}
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton className="fab-add-page" onClick={handleAddOrganization}>
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
