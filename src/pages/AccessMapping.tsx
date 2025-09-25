import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonInput, IonTextarea, IonChip, IonLabel, IonItem, IonList,
  IonSelect, IonSelectOption, IonPopover, IonButtons
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  chevronDownOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import ActionDropdown from '../admin/components/common/ActionDropdown';
import { Pagination } from '../admin/components/shared';
import { RBACControls, RBACHeader, ScrollableTableContainer } from '../components/shared';
import { mockDataService } from '../services/api';
import type { AccessMappingData } from '../types';
import './AccessMapping.css';

const AccessMapping: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Add Access Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewingMapping, setViewingMapping] = useState<AccessMappingData | null>(null);
  const [editingMapping, setEditingMapping] = useState<AccessMappingData | null>(null);
  const [newAccess, setNewAccess] = useState({
    role: '',
    pageAccess: '',
    navbarAccess: [] as string[]
  });
  const [editAccess, setEditAccess] = useState({
    role: '',
    pageAccess: '',
    navbarAccess: [] as string[]
  });
  const [navbarAccessInput, setNavbarAccessInput] = useState('');
  const [editNavbarAccessInput, setEditNavbarAccessInput] = useState('');
  const [showNavbarPopover, setShowNavbarPopover] = useState(false);
  const [showEditNavbarPopover, setShowEditNavbarPopover] = useState(false);

  const itemsPerPage = 5;

  // State for managing access mapping data - EXACTLY LIKE MANAGEPAGES
  const [allMappings, setAllMappings] = useState<AccessMappingData[]>(() => mockDataService.getAccessMappingData());
  
  // Filter mappings based on search query
  const filteredMappings = useMemo(() => {
    return allMappings.filter(mapping =>
      mapping.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.navbarAccess.some(access => access.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allMappings, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredMappings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMappings = filteredMappings.slice(startIndex, endIndex);

  // All sidebar options for navbar access
  const sidebarOptions = [
    'Dashboard',
    'Application Type',
    'New Requests', 
    'Schemes',
    'Custom Reports',
    'Manage Pages',
    'Branch Master',
    'Caste Master',
    'Taluka Master',
    'Action Masters',
    'Organization Masters',
    'Status Master',
    'Partner Master',
    'Status Mapping',
    'Rejection Masters',
    'Database Access',
    'Roles',
    'Workflow',
    'Access Mapping',
    'Branch Mapping',
    'Pincode Mapping',
    'Members',
    'Config',
    'Reports',
    'Others'
  ];

  const handleAddMapping = () => {
    setNewAccess({
      role: '',
      pageAccess: '',
      navbarAccess: []
    });
    setNavbarAccessInput('');
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewAccess({
      role: '',
      pageAccess: '',
      navbarAccess: []
    });
    setNavbarAccessInput('');
  };

  const handleAddNavbarAccess = () => {
    if (navbarAccessInput.trim() && !newAccess.navbarAccess.includes(navbarAccessInput.trim())) {
      setNewAccess(prev => ({
        ...prev,
        navbarAccess: [...prev.navbarAccess, navbarAccessInput.trim()]
      }));
      setNavbarAccessInput('');
    }
  };

  const handleRemoveNavbarAccess = (accessToRemove: string) => {
    setNewAccess(prev => ({
      ...prev,
      navbarAccess: prev.navbarAccess.filter(access => access !== accessToRemove)
    }));
  };

  const handleSelectNavbarOption = (option: string) => {
    if (!newAccess.navbarAccess.includes(option)) {
      setNewAccess(prev => ({
        ...prev,
        navbarAccess: [...prev.navbarAccess, option]
      }));
    }
    setShowNavbarPopover(false);
  };

  const handleSaveNewAccess = () => {
    if (!newAccess.role.trim()) {
      setToastMessage('Please enter a role name');
      setShowToast(true);
      return;
    }

    if (newAccess.navbarAccess.length === 0) {
      setToastMessage('Please add at least one navbar access item');
      setShowToast(true);
      return;
    }

    // Check if role already exists
    if (allMappings.some(mapping => mapping.role.toLowerCase() === newAccess.role.toLowerCase())) {
      setToastMessage('Role already exists. Please choose a different role name.');
      setShowToast(true);
      return;
    }

    const newMapping: AccessMappingData = {
      id: `mapping_${Date.now()}`,
      role: newAccess.role.trim(),
      pageAccess: newAccess.pageAccess.trim(),
      navbarAccess: newAccess.navbarAccess,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add the new mapping to the state - EXACTLY LIKE MANAGEPAGES
    setAllMappings(prevMappings => [...prevMappings, newMapping]);
    setToastMessage(`Access mapping for "${newAccess.role}" added successfully`);
    setShowToast(true);
    handleCloseAddModal();
  };

  const handleView = (mapping: AccessMappingData) => {
    setViewingMapping(mapping);
    setShowViewModal(true);
  };

  const handleEdit = (mapping: AccessMappingData) => {
    setEditingMapping(mapping);
    setEditAccess({
      role: mapping.role,
      pageAccess: mapping.pageAccess,
      navbarAccess: [...mapping.navbarAccess]
    });
    setEditNavbarAccessInput('');
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingMapping(null);
    setEditAccess({
      role: '',
      pageAccess: '',
      navbarAccess: []
    });
    setEditNavbarAccessInput('');
  };

  const handleAddEditNavbarAccess = () => {
    if (editNavbarAccessInput.trim() && !editAccess.navbarAccess.includes(editNavbarAccessInput.trim())) {
      setEditAccess(prev => ({
        ...prev,
        navbarAccess: [...prev.navbarAccess, editNavbarAccessInput.trim()]
      }));
      setEditNavbarAccessInput('');
    }
  };

  const handleRemoveEditNavbarAccess = (accessToRemove: string) => {
    setEditAccess(prev => ({
      ...prev,
      navbarAccess: prev.navbarAccess.filter(access => access !== accessToRemove)
    }));
  };

  const handleSelectEditNavbarOption = (option: string) => {
    if (!editAccess.navbarAccess.includes(option)) {
      setEditAccess(prev => ({
        ...prev,
        navbarAccess: [...prev.navbarAccess, option]
      }));
    }
    setShowEditNavbarPopover(false);
  };

  const handleUpdateAccess = () => {
    if (!editAccess.role.trim()) {
      setToastMessage('Please enter a role name');
      setShowToast(true);
      return;
    }

    if (editAccess.navbarAccess.length === 0) {
      setToastMessage('Please add at least one navbar access item');
      setShowToast(true);
      return;
    }

    // Check if role already exists (excluding current mapping)
    if (allMappings.some(mapping => 
      mapping.id !== editingMapping?.id && 
      mapping.role.toLowerCase() === editAccess.role.toLowerCase()
    )) {
      setToastMessage('Role already exists. Please choose a different role name.');
      setShowToast(true);
      return;
    }

    if (editingMapping) {
      // Update the mapping in the state
      setAllMappings(prevMappings => 
        prevMappings.map(mapping => 
          mapping.id === editingMapping.id 
            ? {
                ...mapping,
                role: editAccess.role.trim(),
                pageAccess: editAccess.pageAccess.trim(),
                navbarAccess: editAccess.navbarAccess,
                updatedAt: new Date().toISOString()
              }
            : mapping
        )
      );
      setToastMessage(`Access mapping for "${editAccess.role}" updated successfully`);
      setShowToast(true);
      handleCloseEditModal();
    }
  };

  const handleDelete = (mappingId: string) => {
    setSelectedMappingId(mappingId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedMappingId) {
      // Actually remove the mapping from the state - EXACTLY LIKE MANAGEPAGES
      setAllMappings(prevMappings => prevMappings.filter(mapping => mapping.id !== selectedMappingId));
      setToastMessage('Access mapping deleted successfully');
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

  const renderNavbarAccess = (navbarAccess: string[]) => {
    if (navbarAccess.length === 0) return <span className="no-access">No access</span>;
    
    return (
      <div className="navbar-access-chips">
        {navbarAccess.slice(0, 2).map((access, index) => (
          <IonChip key={index} className="access-chip-small">
            <IonLabel>{access}</IonLabel>
          </IonChip>
        ))}
        {navbarAccess.length > 2 && (
          <IonChip className="access-chip-small more-chip">
            <IonLabel>+{navbarAccess.length - 2} more</IonLabel>
          </IonChip>
        )}
      </div>
    );
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="access-mapping-content">
            <div className="mapping-container">
              {/* Header Section */}
              <RBACHeader
                title="Access Mapping"
                subtitle="Manage role-based access control and permissions"
              />

              {/* Search and Actions */}
              <RBACControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search by role or access..."
                onAddNew={handleAddMapping}
                addButtonText="+ ADD MAPPING"
              />

              {/* Mappings Table */}
              <ScrollableTableContainer cardClassName="mappings-table-card">
                <table className="mappings-table">
                    <thead>
                      <tr>
                        <th>
                          <div className="table-header">
                            <span>Role</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Page Access</span>
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Navbar Access</span>
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
                          <td className="role-cell">
                            <span className="role-name">{mapping.role}</span>
                          </td>
                          <td className="page-access-cell">
                            <span className="page-access-text">{mapping.pageAccess || 'N/A'}</span>
                          </td>
                          <td className="navbar-access-cell">
                            <div className="navbar-access">
                              {renderNavbarAccess(mapping.navbarAccess)}
                            </div>
                          </td>
                          <td className="actions-cell">
                            <ActionDropdown
                              itemId={mapping.id}
                              onView={() => handleView(mapping)}
                              onEdit={() => handleEdit(mapping)}
                              onDelete={() => handleDelete(mapping.id)}
                              showView={true}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </ScrollableTableContainer>

              {/* Pagination */}
              {filteredMappings.length > 0 && (
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
        message="Are you sure you want to delete this access mapping? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Add Access Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={handleCloseAddModal}>
        <IonContent className="add-access-modal">
          <div className="modal-header">
            <h2>Add New Access Mapping</h2>
            <IonButton fill="clear" onClick={handleCloseAddModal}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Role Name *</IonLabel>
                <IonInput
                  value={newAccess.role}
                  onIonInput={(e) => setNewAccess(prev => ({ ...prev, role: e.detail.value! }))}
                  placeholder="Enter role name (e.g., Admin, User, Manager)"
                  className="role-input"
                />
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Page Access</IonLabel>
                <IonTextarea
                  value={newAccess.pageAccess}
                  onIonInput={(e) => setNewAccess(prev => ({ ...prev, pageAccess: e.detail.value! }))}
                  placeholder="Enter page access permissions (optional)"
                  rows={3}
                  className="page-access-input"
                />
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Navbar Access *</IonLabel>
                <div className="navbar-access-section">
                  <div className="navbar-access-input">
                    <IonInput
                      value={navbarAccessInput}
                      onIonInput={(e) => setNavbarAccessInput(e.detail.value!)}
                      placeholder="Enter navbar access item"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddNavbarAccess()}
                    />
                    <IonButton fill="outline" onClick={handleAddNavbarAccess}>
                      <IonIcon icon={addOutline} />
                    </IonButton>
                    <IonButton 
                      fill="outline" 
                      id="navbar-options-trigger"
                      onClick={() => setShowNavbarPopover(true)}
                    >
                      <IonIcon icon={chevronDownOutline} />
                    </IonButton>
                  </div>
                  
                  <div className="navbar-access-chips">
                    {newAccess.navbarAccess.map((access, index) => (
                      <IonChip key={index} className="access-chip">
                        <IonLabel>{access}</IonLabel>
                        <IonButton
                          fill="clear"
                          size="small"
                          onClick={() => handleRemoveNavbarAccess(access)}
                        >
                          <IonIcon icon={closeOutline} />
                        </IonButton>
                      </IonChip>
                    ))}
                  </div>
                </div>
              </IonItem>
            </IonList>
          </div>
          
          <div className="modal-actions">
            <IonButton fill="outline" onClick={handleCloseAddModal}>
              CANCEL
            </IonButton>
            <IonButton fill="solid" onClick={handleSaveNewAccess}>
              <IonIcon icon={checkmarkOutline} slot="start" />
              SAVE ACCESS MAPPING
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* Navbar Options Popover */}
      <IonPopover
        isOpen={showNavbarPopover}
        onDidDismiss={() => setShowNavbarPopover(false)}
        trigger="navbar-options-trigger"
        side="bottom"
        alignment="start"
      >
        <IonContent>
          <IonList>
            <IonItem>
              <IonLabel>
                <h3>Select Navbar Access Options</h3>
                <p>Choose from available sidebar options</p>
              </IonLabel>
            </IonItem>
            {sidebarOptions.map((option, index) => (
              <IonItem 
                key={index} 
                button 
                onClick={() => handleSelectNavbarOption(option)}
                disabled={newAccess.navbarAccess.includes(option)}
              >
                <IonLabel>{option}</IonLabel>
                {newAccess.navbarAccess.includes(option) && (
                  <IonIcon icon={checkmarkOutline} slot="end" color="success" />
                )}
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonPopover>

      {/* View Access Mapping Modal */}
      <IonModal isOpen={showViewModal} onDidDismiss={() => setShowViewModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>View Access Mapping Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowViewModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="view-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>
              Access Mapping Details: {viewingMapping?.role}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Role Name</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0'
                }}>
                  {viewingMapping?.role}
                </div>
              </div>
              
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Page Access</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0'
                }}>
                  {viewingMapping?.pageAccess || 'No specific page access defined'}
                </div>
              </div>
              
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Navbar Access Permissions</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0'
                }}>
                  {viewingMapping?.navbarAccess && viewingMapping.navbarAccess.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {viewingMapping.navbarAccess.map((access, index) => (
                        <IonChip key={index} style={{ 
                          '--background': '#667eea', 
                          '--color': 'white',
                          fontSize: '0.9rem'
                        }}>
                          <IonLabel>{access}</IonLabel>
                        </IonChip>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#999', fontStyle: 'italic' }}>No navbar access permissions</span>
                  )}
                </div>
              </div>
              
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Created At</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  fontFamily: 'monospace'
                }}>
                  {viewingMapping?.createdAt ? new Date(viewingMapping.createdAt).toLocaleString() : 'N/A'}
                </div>
              </div>
              
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Last Updated</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  fontFamily: 'monospace'
                }}>
                  {viewingMapping?.updatedAt ? new Date(viewingMapping.updatedAt).toLocaleString() : 'N/A'}
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

      {/* Edit Access Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={handleCloseEditModal}>
        <IonContent className="edit-access-modal">
          <div className="modal-header">
            <h2>Edit Access Mapping</h2>
            <IonButton fill="clear" onClick={handleCloseEditModal}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Role Name *</IonLabel>
                <IonInput
                  value={editAccess.role}
                  onIonInput={(e) => setEditAccess(prev => ({ ...prev, role: e.detail.value! }))}
                  placeholder="Enter role name (e.g., Admin, User, Manager)"
                  className="role-input"
                />
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Page Access</IonLabel>
                <IonTextarea
                  value={editAccess.pageAccess}
                  onIonInput={(e) => setEditAccess(prev => ({ ...prev, pageAccess: e.detail.value! }))}
                  placeholder="Enter page access permissions (optional)"
                  rows={3}
                  className="page-access-input"
                />
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Navbar Access *</IonLabel>
                <div className="navbar-access-section">
                  <div className="navbar-access-input">
                    <IonInput
                      value={editNavbarAccessInput}
                      onIonInput={(e) => setEditNavbarAccessInput(e.detail.value!)}
                      placeholder="Enter navbar access item"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddEditNavbarAccess()}
                    />
                    <IonButton fill="outline" onClick={handleAddEditNavbarAccess}>
                      <IonIcon icon={addOutline} />
                    </IonButton>
                    <IonButton 
                      fill="outline" 
                      id="edit-navbar-options-trigger"
                      onClick={() => setShowEditNavbarPopover(true)}
                    >
                      <IonIcon icon={chevronDownOutline} />
                    </IonButton>
                  </div>
                  
                  <div className="navbar-access-chips">
                    {editAccess.navbarAccess.map((access, index) => (
                      <IonChip key={index} className="access-chip">
                        <IonLabel>{access}</IonLabel>
                        <IonButton
                          fill="clear"
                          size="small"
                          onClick={() => handleRemoveEditNavbarAccess(access)}
                        >
                          <IonIcon icon={closeOutline} />
                        </IonButton>
                      </IonChip>
                    ))}
                  </div>
                </div>
              </IonItem>
            </IonList>
          </div>
          
          <div className="modal-actions">
            <IonButton fill="outline" onClick={handleCloseEditModal}>
              CANCEL
            </IonButton>
            <IonButton fill="solid" onClick={handleUpdateAccess}>
              <IonIcon icon={checkmarkOutline} slot="start" />
              UPDATE ACCESS MAPPING
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Navbar Options Popover */}
      <IonPopover
        isOpen={showEditNavbarPopover}
        onDidDismiss={() => setShowEditNavbarPopover(false)}
        trigger="edit-navbar-options-trigger"
        side="bottom"
        alignment="start"
      >
        <IonContent>
          <IonList>
            <IonItem>
              <IonLabel>
                <h3>Select Navbar Access Options</h3>
                <p>Choose from available sidebar options</p>
              </IonLabel>
            </IonItem>
            {sidebarOptions.map((option, index) => (
              <IonItem 
                key={index} 
                button 
                onClick={() => handleSelectEditNavbarOption(option)}
                disabled={editAccess.navbarAccess.includes(option)}
              >
                <IonLabel>{option}</IonLabel>
                {editAccess.navbarAccess.includes(option) && (
                  <IonIcon icon={checkmarkOutline} slot="end" color="success" />
                )}
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonPopover>

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

export default AccessMapping;