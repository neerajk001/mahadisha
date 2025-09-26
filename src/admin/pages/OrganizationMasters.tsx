import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonButtons, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonBadge, IonChip, IonLabel
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
import { MasterCard, MasterControls, MasterHeader, ScrollableTableContainer } from '../../components/shared';
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
  const [addForm, setAddForm] = useState({
    name: ''
  });
  
  // Enhanced state for new functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 5;

  // State for managing organizations data - REAL-TIME CRUD
  const [allOrganizations, setAllOrganizations] = useState<OrganizationMasterData[]>(() => mockDataService.getOrganizationMasterData());
  
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

  const handleSaveAdd = () => {
    if (addForm.name) {
      // Generate a new ID for the organization
      const newId = `org-${Date.now()}`;
      
      // Create the new organization object
      const newOrganization: OrganizationMasterData = {
        id: newId,
        name: addForm.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add the new organization to the state
      setAllOrganizations(prevOrganizations => [...prevOrganizations, newOrganization]);
      
      setToastMessage(`Organization "${addForm.name}" created successfully`);
      setShowToast(true);
      setShowAddModal(false);
      setAddForm({ name: '' });
    } else {
      setToastMessage('Please fill in the organization name');
      setShowToast(true);
    }
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
    if (editingOrg && editForm.name) {
      // Update the organization in the state
      setAllOrganizations(prevOrganizations => 
        prevOrganizations.map(org => 
          org.id === editingOrg.id 
            ? { ...org, name: editForm.name, updatedAt: new Date().toISOString() }
            : org
        )
      );
      
      setToastMessage(`Organization "${editForm.name}" updated successfully`);
      setShowToast(true);
      setShowEditModal(false);
      setEditingOrg(null);
      setEditForm({ name: '' });
    } else {
      setToastMessage('Please fill in the organization name');
      setShowToast(true);
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
      // Remove the organization from state
      setAllOrganizations(prevOrganizations => prevOrganizations.filter(org => org.id !== selectedOrgId));
      
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
      <IonSplitPane contentId="dashboard-content" when="md">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="manage-pages-content">
            <div className="pages-container">
              {/* Header Section */}
              <MasterHeader
                title="Organization Masters"
                subtitle="Manage organization categories and their names"
              />

              {/* Enhanced Search and Actions */}
              <MasterControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search organizations by name..."
                viewMode={viewMode}
                onViewModeToggle={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                onAddNew={handleAddOrganization}
                addButtonText="Add New Organization"
              />

              {/* Organizations Grid */}
              {viewMode === 'grid' ? (
                <div className="master-cards-grid" style={{ padding: '1rem' }}>
                  {currentOrganizations.map((org) => (
                    <MasterCard
                      key={org.id}
                      id={org.id}
                      title={org.name}
                      subtitle="Organization"
                      icon={businessOutline}
                      metaItems={[
                        {
                          icon: documentTextOutline,
                          label: "Code",
                          value: `ORG-${org.id.slice(-3)}`
                        },
                        {
                          icon: timeOutline,
                          label: "Status",
                          value: "Active"
                        }
                      ]}
                      onView={() => handleView(org)}
                      onEdit={() => handleEdit(org.id)}
                      onDelete={() => handleDelete(org.id)}
                    />
                  ))}
                </div>
              ) : (
                <ScrollableTableContainer cardClassName="pages-table-card">
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
                              <ActionDropdown
                                itemId={org.id}
                                onView={() => handleView(org)}
                                onEdit={() => handleEdit(org.id)}
                                onDelete={() => handleDelete(org.id)}
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
              {filteredAndSortedOrganizations.length > 0 && (
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

      {/* Add Organization Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => {
        setShowAddModal(false);
        setAddForm({ name: '' });
      }}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Organization</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => {
                setShowAddModal(false);
                setAddForm({ name: '' });
              }}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea', textAlign: 'center' }}>Create New Organization</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Organization Name
                </IonLabel>
                <IonInput
                  value={addForm.name}
                  onIonChange={(e) => setAddForm({...addForm, name: e.detail.value!})}
                  placeholder="Enter organization name"
                  style={{ 
                    '--background': '#e8e8e8',
                    '--border-radius': '12px',
                    '--padding-start': '16px',
                    '--padding-end': '16px',
                    '--padding-top': '12px',
                    '--padding-bottom': '12px',
                    '--color': '#333',
                    '--placeholder-color': '#666'
                  }}
                />
              </div>
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
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea', textAlign: 'center' }}>Edit Organization: {editingOrg?.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Organization Name
                </IonLabel>
                <IonInput
                  value={editForm.name}
                  onIonChange={(e) => setEditForm({...editForm, name: e.detail.value!})}
                  placeholder="Enter organization name"
                  style={{ 
                    '--background': '#e8e8e8',
                    '--border-radius': '12px',
                    '--padding-start': '16px',
                    '--padding-end': '16px',
                    '--padding-top': '12px',
                    '--padding-bottom': '12px',
                    '--color': '#333',
                    '--placeholder-color': '#666'
                  }}
                />
              </div>
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
