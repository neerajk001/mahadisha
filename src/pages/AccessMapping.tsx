import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  chevronDownOutline, checkmark, closeOutline as closeOutlineIcon
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
    navbarAccess: [] as string[],
    masterAccess: [] as string[]
  });
  const [editAccess, setEditAccess] = useState({
    role: '',
    navbarAccess: [] as string[],
    masterAccess: [] as string[]
  });
  
  // Searchable dropdown states for Nav Access
  const [showNavAccessDropdown, setShowNavAccessDropdown] = useState(false);
  const [navAccessSearchQuery, setNavAccessSearchQuery] = useState('');
  const [showEditNavAccessDropdown, setShowEditNavAccessDropdown] = useState(false);
  const [editNavAccessSearchQuery, setEditNavAccessSearchQuery] = useState('');
  
  // Searchable dropdown states for Master Access
  const [showMasterAccessDropdown, setShowMasterAccessDropdown] = useState(false);
  const [masterAccessSearchQuery, setMasterAccessSearchQuery] = useState('');
  const [showEditMasterAccessDropdown, setShowEditMasterAccessDropdown] = useState(false);
  const [editMasterAccessSearchQuery, setEditMasterAccessSearchQuery] = useState('');
  
  // Refs for click outside detection
  const navAccessDropdownRef = useRef<HTMLDivElement>(null);
  const editNavAccessDropdownRef = useRef<HTMLDivElement>(null);
  const masterAccessDropdownRef = useRef<HTMLDivElement>(null);
  const editMasterAccessDropdownRef = useRef<HTMLDivElement>(null);

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

  // Nav Access options (from the images provided)
  const navAccessOptions = [
    { value: "Dashboard", label: "Dashboard", hasCheckmark: true },
    { value: "Reports", label: "Reports", hasCheckmark: true },
    { value: "Roles", label: "Roles", hasCheckmark: false },
    { value: "Database Access", label: "Database Access", hasCheckmark: false },
    { value: "Pincode Mapping", label: "Pincode Mapping", hasCheckmark: false },
    { value: "Access Mapping", label: "Access Mapping", hasCheckmark: false },
    { value: "Branch Master", label: "Branch Master", hasCheckmark: false },
    { value: "Status Master", label: "Status Master", hasCheckmark: false },
    { value: "Caste Master", label: "Caste Master", hasCheckmark: false },
    { value: "Status Mapping", label: "Status Mapping", hasCheckmark: false },
    { value: "Workflow", label: "Workflow", hasCheckmark: false },
    { value: "Organization Masters", label: "Organization Masters", hasCheckmark: false },
    { value: "Application Type", label: "Application Type", hasCheckmark: false },
    { value: "Partner Master", label: "Partner Master", hasCheckmark: false },
    { value: "Manage Pages", label: "Manage Pages", hasCheckmark: false },
    { value: "Partner Master", label: "Partner Master", hasCheckmark: false },
    { value: "Manage Pages", label: "Manage Pages", hasCheckmark: false },
    { value: "Action Masters", label: "Action Masters", hasCheckmark: false },
    { value: "Taluka Master", label: "Taluka Master", hasCheckmark: false },
    { value: "New Requests", label: "New Requests", hasCheckmark: false },
    { value: "Schemes", label: "Schemes", hasCheckmark: false },
    { value: "Members", label: "Members", hasCheckmark: false },
    { value: "New Loan", label: "New Loan", hasCheckmark: false },
    { value: "Branch Mapping", label: "Branch Mapping", hasCheckmark: false },
    { value: "Rejection Masters", label: "Rejection Masters", hasCheckmark: false },
    { value: "Dummy Page", label: "Dummy Page", hasCheckmark: false },
    { value: "Custom Reports", label: "Custom Reports", hasCheckmark: false }
  ];

  // Master Access options (CRUD operations)
  const masterAccessOptions = [
    { value: "Create", label: "Create", hasCheckmark: true },
    { value: "Read", label: "Read", hasCheckmark: true },
    { value: "Update", label: "Update", hasCheckmark: true },
    { value: "Delete", label: "Delete", hasCheckmark: true }
  ];

  // Filter options based on search query
  const filteredNavAccessOptions = navAccessOptions.filter(option =>
    option.label.toLowerCase().includes(navAccessSearchQuery.toLowerCase())
  );
  const filteredEditNavAccessOptions = navAccessOptions.filter(option =>
    option.label.toLowerCase().includes(editNavAccessSearchQuery.toLowerCase())
  );
  const filteredMasterAccessOptions = masterAccessOptions.filter(option =>
    option.label.toLowerCase().includes(masterAccessSearchQuery.toLowerCase())
  );
  const filteredEditMasterAccessOptions = masterAccessOptions.filter(option =>
    option.label.toLowerCase().includes(editMasterAccessSearchQuery.toLowerCase())
  );

  // Click outside detection for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNavAccessDropdown && navAccessDropdownRef.current && !navAccessDropdownRef.current.contains(event.target as Node)) {
        setShowNavAccessDropdown(false);
        setNavAccessSearchQuery('');
      }
      if (showEditNavAccessDropdown && editNavAccessDropdownRef.current && !editNavAccessDropdownRef.current.contains(event.target as Node)) {
        setShowEditNavAccessDropdown(false);
        setEditNavAccessSearchQuery('');
      }
      if (showMasterAccessDropdown && masterAccessDropdownRef.current && !masterAccessDropdownRef.current.contains(event.target as Node)) {
        setShowMasterAccessDropdown(false);
        setMasterAccessSearchQuery('');
      }
      if (showEditMasterAccessDropdown && editMasterAccessDropdownRef.current && !editMasterAccessDropdownRef.current.contains(event.target as Node)) {
        setShowEditMasterAccessDropdown(false);
        setEditMasterAccessSearchQuery('');
      }
    };

    if (showNavAccessDropdown || showEditNavAccessDropdown || showMasterAccessDropdown || showEditMasterAccessDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNavAccessDropdown, showEditNavAccessDropdown, showMasterAccessDropdown, showEditMasterAccessDropdown]);

  const handleAddMapping = () => {
    setNewAccess({
      role: '',
      navbarAccess: [],
      masterAccess: []
    });
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewAccess({
      role: '',
      navbarAccess: [],
      masterAccess: []
    });
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

    if (newAccess.masterAccess.length === 0) {
      setToastMessage('Please add at least one master access permission');
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
      pageAccess: '', // Remove pageAccess
      navbarAccess: newAccess.navbarAccess,
      masterAccess: newAccess.masterAccess, // Add masterAccess
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
      navbarAccess: [...mapping.navbarAccess],
      masterAccess: mapping.masterAccess ? [...mapping.masterAccess] : []
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingMapping(null);
    setEditAccess({
      role: '',
      navbarAccess: [],
      masterAccess: []
    });
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

    if (editAccess.masterAccess.length === 0) {
      setToastMessage('Please add at least one master access permission');
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
                pageAccess: '', // Remove pageAccess
                navbarAccess: editAccess.navbarAccess,
                masterAccess: editAccess.masterAccess, // Add masterAccess
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
                            <span>Navbar Access</span>
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Master Access</span>
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
                          <td className="navbar-access-cell">
                            <div className="navbar-access">
                              {renderNavbarAccess(mapping.navbarAccess)}
                            </div>
                          </td>
                          <td className="master-access-cell">
                            <div className="master-access">
                              {renderNavbarAccess(mapping.masterAccess || [])}
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
              <div className="form-group">
                <IonLabel className="form-label">Role Name *</IonLabel>
                <IonInput
                  value={newAccess.role}
                  onIonInput={(e) => setNewAccess(prev => ({ ...prev, role: e.detail.value! }))}
                  placeholder="Enter role name (e.g., Admin, User, Manager)"
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
              
              <div className="form-group">
                <IonLabel className="form-label">Navbar Access *</IonLabel>
                <div style={{ position: 'relative' }} ref={navAccessDropdownRef}>
                  <div
                    onClick={() => setShowNavAccessDropdown(!showNavAccessDropdown)}
                    style={{
                      background: '#e8e8e8',
                      border: '1px solid #ddd',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      minHeight: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    {newAccess.navbarAccess.length === 0 ? (
                      <span style={{ color: '#666', fontSize: '14px' }}>Select navbar access items</span>
                    ) : (
                      newAccess.navbarAccess.map((access, index) => (
                        <span
                          key={index}
                          style={{
                            background: '#4ecdc4',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '16px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {access}
                          <IonIcon
                            icon={closeOutlineIcon}
                            style={{ fontSize: '14px', cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewAccess(prev => ({
                                ...prev,
                                navbarAccess: prev.navbarAccess.filter(item => item !== access)
                              }));
                            }}
                          />
                        </span>
                      ))
                    )}
                  </div>
                  {showNavAccessDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      zIndex: 1000,
                      maxHeight: '500px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <IonInput
                          value={navAccessSearchQuery}
                          onIonInput={(e) => setNavAccessSearchQuery(e.detail.value!)}
                          placeholder="Search navbar access..."
                          style={{
                            '--background': '#f8f9fa',
                            '--border-radius': '8px',
                            '--padding-start': '12px',
                            '--padding-end': '12px',
                            '--padding-top': '8px',
                            '--padding-bottom': '8px'
                          }}
                        />
                      </div>
                      <div style={{ maxHeight: '450px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {filteredNavAccessOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              const isSelected = newAccess.navbarAccess.includes(option.value);
                              let newNavAccess;
                              if (isSelected) {
                                newNavAccess = newAccess.navbarAccess.filter(item => item !== option.value);
                              } else {
                                newNavAccess = [...newAccess.navbarAccess, option.value];
                              }
                              setNewAccess(prev => ({ ...prev, navbarAccess: newNavAccess }));
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: newAccess.navbarAccess.includes(option.value) ? '#2196f3' : 'white',
                              color: newAccess.navbarAccess.includes(option.value) ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (!newAccess.navbarAccess.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!newAccess.navbarAccess.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: newAccess.navbarAccess.includes(option.value) ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: newAccess.navbarAccess.includes(option.value) ? 'white' : '#00C851', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                  </div>
                  
              <div className="form-group">
                <IonLabel className="form-label">Master Access *</IonLabel>
                <div style={{ position: 'relative' }} ref={masterAccessDropdownRef}>
                  <div
                    onClick={() => setShowMasterAccessDropdown(!showMasterAccessDropdown)}
                    style={{
                      background: '#e8e8e8',
                      border: '1px solid #ddd',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      minHeight: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    {newAccess.masterAccess.length === 0 ? (
                      <span style={{ color: '#666', fontSize: '14px' }}>Select master access permissions</span>
                    ) : (
                      newAccess.masterAccess.map((access, index) => (
                        <span
                          key={index}
                          style={{
                            background: '#4ecdc4',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '16px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {access}
                          <IonIcon
                            icon={closeOutlineIcon}
                            style={{ fontSize: '14px', cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewAccess(prev => ({
                                ...prev,
                                masterAccess: prev.masterAccess.filter(item => item !== access)
                              }));
                            }}
                          />
                        </span>
                      ))
                    )}
                  </div>
                  {showMasterAccessDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      zIndex: 1000,
                      maxHeight: '500px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                        <IonInput
                          value={masterAccessSearchQuery}
                          onIonInput={(e) => setMasterAccessSearchQuery(e.detail.value!)}
                          placeholder="Search master access..."
                          style={{
                            '--background': '#f8f9fa',
                            '--border-radius': '8px',
                            '--padding-start': '12px',
                            '--padding-end': '12px',
                            '--padding-top': '8px',
                            '--padding-bottom': '8px'
                          }}
                        />
                      </div>
                      <div style={{ maxHeight: '450px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {filteredMasterAccessOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              const isSelected = newAccess.masterAccess.includes(option.value);
                              let newMasterAccess;
                              if (isSelected) {
                                newMasterAccess = newAccess.masterAccess.filter(item => item !== option.value);
                              } else {
                                newMasterAccess = [...newAccess.masterAccess, option.value];
                              }
                              setNewAccess(prev => ({ ...prev, masterAccess: newMasterAccess }));
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: newAccess.masterAccess.includes(option.value) ? '#2196f3' : 'white',
                              color: newAccess.masterAccess.includes(option.value) ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (!newAccess.masterAccess.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!newAccess.masterAccess.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: newAccess.masterAccess.includes(option.value) ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: newAccess.masterAccess.includes(option.value) ? 'white' : '#00C851', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                          </div>
                    ))}
                  </div>
                </div>
                  )}
                </div>
              </div>
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
              <div className="form-group">
                <IonLabel className="form-label">Role Name *</IonLabel>
                <IonInput
                  value={editAccess.role}
                  onIonInput={(e) => setEditAccess(prev => ({ ...prev, role: e.detail.value! }))}
                  placeholder="Enter role name (e.g., Admin, User, Manager)"
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
              
              <div className="form-group">
                <IonLabel className="form-label">Navbar Access *</IonLabel>
                <div style={{ position: 'relative' }} ref={editNavAccessDropdownRef}>
                  <div
                    onClick={() => setShowEditNavAccessDropdown(!showEditNavAccessDropdown)}
                    style={{
                      background: '#e8e8e8',
                      border: '1px solid #ddd',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      minHeight: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    {editAccess.navbarAccess.length === 0 ? (
                      <span style={{ color: '#666', fontSize: '14px' }}>Select navbar access items</span>
                    ) : (
                      editAccess.navbarAccess.map((access, index) => (
                        <span
                          key={index}
                          style={{
                            background: '#4ecdc4',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '16px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {access}
                          <IonIcon
                            icon={closeOutlineIcon}
                            style={{ fontSize: '14px', cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditAccess(prev => ({
                                ...prev,
                                navbarAccess: prev.navbarAccess.filter(item => item !== access)
                              }));
                            }}
                          />
                        </span>
                      ))
                    )}
                  </div>
                  {showEditNavAccessDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      zIndex: 1000,
                      maxHeight: '500px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <IonInput
                          value={editNavAccessSearchQuery}
                          onIonInput={(e) => setEditNavAccessSearchQuery(e.detail.value!)}
                          placeholder="Search navbar access..."
                          style={{
                            '--background': '#f8f9fa',
                            '--border-radius': '8px',
                            '--padding-start': '12px',
                            '--padding-end': '12px',
                            '--padding-top': '8px',
                            '--padding-bottom': '8px'
                          }}
                        />
                      </div>
                      <div style={{ maxHeight: '450px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {filteredEditNavAccessOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              const isSelected = editAccess.navbarAccess.includes(option.value);
                              let newNavAccess;
                              if (isSelected) {
                                newNavAccess = editAccess.navbarAccess.filter(item => item !== option.value);
                              } else {
                                newNavAccess = [...editAccess.navbarAccess, option.value];
                              }
                              setEditAccess(prev => ({ ...prev, navbarAccess: newNavAccess }));
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: editAccess.navbarAccess.includes(option.value) ? '#2196f3' : 'white',
                              color: editAccess.navbarAccess.includes(option.value) ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (!editAccess.navbarAccess.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!editAccess.navbarAccess.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: editAccess.navbarAccess.includes(option.value) ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: editAccess.navbarAccess.includes(option.value) ? 'white' : '#00C851', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                  </div>
                  
              <div className="form-group">
                <IonLabel className="form-label">Master Access *</IonLabel>
                <div style={{ position: 'relative' }} ref={editMasterAccessDropdownRef}>
                  <div
                    onClick={() => setShowEditMasterAccessDropdown(!showEditMasterAccessDropdown)}
                    style={{
                      background: '#e8e8e8',
                      border: '1px solid #ddd',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      minHeight: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    {editAccess.masterAccess.length === 0 ? (
                      <span style={{ color: '#666', fontSize: '14px' }}>Select master access permissions</span>
                    ) : (
                      editAccess.masterAccess.map((access, index) => (
                        <span
                          key={index}
                          style={{
                            background: '#4ecdc4',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '16px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {access}
                          <IonIcon
                            icon={closeOutlineIcon}
                            style={{ fontSize: '14px', cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditAccess(prev => ({
                                ...prev,
                                masterAccess: prev.masterAccess.filter(item => item !== access)
                              }));
                            }}
                          />
                        </span>
                      ))
                    )}
                  </div>
                  {showEditMasterAccessDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      zIndex: 1000,
                      maxHeight: '500px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                        <IonInput
                          value={editMasterAccessSearchQuery}
                          onIonInput={(e) => setEditMasterAccessSearchQuery(e.detail.value!)}
                          placeholder="Search master access..."
                          style={{
                            '--background': '#f8f9fa',
                            '--border-radius': '8px',
                            '--padding-start': '12px',
                            '--padding-end': '12px',
                            '--padding-top': '8px',
                            '--padding-bottom': '8px'
                          }}
                        />
                      </div>
                      <div style={{ maxHeight: '450px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {filteredEditMasterAccessOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              const isSelected = editAccess.masterAccess.includes(option.value);
                              let newMasterAccess;
                              if (isSelected) {
                                newMasterAccess = editAccess.masterAccess.filter(item => item !== option.value);
                              } else {
                                newMasterAccess = [...editAccess.masterAccess, option.value];
                              }
                              setEditAccess(prev => ({ ...prev, masterAccess: newMasterAccess }));
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: editAccess.masterAccess.includes(option.value) ? '#2196f3' : 'white',
                              color: editAccess.masterAccess.includes(option.value) ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (!editAccess.masterAccess.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!editAccess.masterAccess.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: editAccess.masterAccess.includes(option.value) ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: editAccess.masterAccess.includes(option.value) ? 'white' : '#00C851', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                          </div>
                    ))}
                  </div>
                </div>
                  )}
                </div>
              </div>
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