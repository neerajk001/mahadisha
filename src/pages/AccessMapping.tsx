import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonInput, IonTextarea, IonChip, IonLabel, IonItem, IonList,
  IonSelect, IonSelectOption, IonPopover
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
  const [newAccess, setNewAccess] = useState({
    role: '',
    pageAccess: '',
    navbarAccess: [] as string[]
  });
  const [navbarAccessInput, setNavbarAccessInput] = useState('');
  const [showNavbarPopover, setShowNavbarPopover] = useState(false);

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

  const handleEdit = (mappingId: string) => {
    setToastMessage('Edit functionality will be implemented');
    setShowToast(true);
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
                              onEdit={() => handleEdit(mapping.id)}
                              onDelete={() => handleDelete(mapping.id)}
                              showView={false}
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