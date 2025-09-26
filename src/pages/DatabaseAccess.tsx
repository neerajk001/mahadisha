import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonButtons
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  eyeOutline, checkmark, closeOutline as closeOutlineIcon, chevronDownOutline, chevronUpOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import ActionDropdown from '../admin/components/common/ActionDropdown';
import { Pagination } from '../admin/components/shared';
import { RBACControls, RBACHeader, ScrollableTableContainer } from '../components/shared';
import { mockDataService } from '../services/api';
import type { DatabaseAccessData } from '../types';
import './DatabaseAccess.css';

const DatabaseAccess: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedAccessId, setSelectedAccessId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // RBAC modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingAccess, setViewingAccess] = useState<DatabaseAccessData | null>(null);
  const [editingAccess, setEditingAccess] = useState<DatabaseAccessData | null>(null);
  const [addForm, setAddForm] = useState({
    name: '',
    permissions: [] as string[]
  });
  const [editForm, setEditForm] = useState({
    name: '',
    permissions: [] as string[]
  });

  // Searchable dropdown state
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [nameSearchQuery, setNameSearchQuery] = useState('');
  const [showEditNameDropdown, setShowEditNameDropdown] = useState(false);
  const [editNameSearchQuery, setEditNameSearchQuery] = useState('');
  const [showPermissionsDropdown, setShowPermissionsDropdown] = useState(false);
  const [permissionsSearchQuery, setPermissionsSearchQuery] = useState('');
  const [showEditPermissionsDropdown, setShowEditPermissionsDropdown] = useState(false);
  const [editPermissionsSearchQuery, setEditPermissionsSearchQuery] = useState('');
  const nameDropdownRef = useRef<HTMLDivElement>(null);
  const editNameDropdownRef = useRef<HTMLDivElement>(null);
  const permissionsDropdownRef = useRef<HTMLDivElement>(null);
  const editPermissionsDropdownRef = useRef<HTMLDivElement>(null);
  
  const itemsPerPage = 5;

  // Database access permissions options (simplified to 4 basic options)
  const permissionsOptions = [
    { value: "Create", label: "Create", hasCheckmark: true },
    { value: "View", label: "View", hasCheckmark: true },
    { value: "Edit", label: "Edit", hasCheckmark: true },
    { value: "Delete", label: "Delete", hasCheckmark: true }
  ];

  // Database access name options
  const nameOptions = [
    { value: "Dashboard", label: "Dashboard", hasCheckmark: true },
    { value: "Reports", label: "Reports", hasCheckmark: true },
    { value: "Database Access", label: "Database Access", hasCheckmark: true },
    { value: "Branch Master", label: "Branch Master", hasCheckmark: true },
    { value: "Roles", label: "Roles", hasCheckmark: true },
    { value: "Manage Pages", label: "Manage Pages", hasCheckmark: true },
    { value: "Members", label: "Members", hasCheckmark: true },
    { value: "New Loan", label: "New Loan", hasCheckmark: true },
    { value: "Caste Master", label: "Caste Master", hasCheckmark: true },
    { value: "Taluka Master", label: "Taluka Master", hasCheckmark: true },
    { value: "Action Masters", label: "Action Masters", hasCheckmark: true },
    { value: "Organization Masters", label: "Organization Masters", hasCheckmark: true },
    { value: "Status Master", label: "Status Master", hasCheckmark: true },
    { value: "Partner Master", label: "Partner Master", hasCheckmark: true },
    { value: "Status Mapping", label: "Status Mapping", hasCheckmark: true },
    { value: "Rejection Master", label: "Rejection Master", hasCheckmark: true },
    { value: "User Management", label: "User Management", hasCheckmark: true },
    { value: "Settings", label: "Settings", hasCheckmark: true },
    { value: "Configuration", label: "Configuration", hasCheckmark: true },
    { value: "System Logs", label: "System Logs", hasCheckmark: true }
  ];

  // State for managing database access data - EXACTLY LIKE MANAGEPAGES
  const [allAccess, setAllAccess] = useState<DatabaseAccessData[]>(() => mockDataService.getDatabaseAccessData());
  
  // Filter name options based on search query
  const filteredNameOptions = nameOptions.filter(option =>
    option.label.toLowerCase().includes(nameSearchQuery.toLowerCase())
  );

  const filteredEditNameOptions = nameOptions.filter(option =>
    option.label.toLowerCase().includes(editNameSearchQuery.toLowerCase())
  );

  // Filter permissions options based on search query
  const filteredPermissionsOptions = permissionsOptions.filter(option =>
    option.label.toLowerCase().includes(permissionsSearchQuery.toLowerCase())
  );

  const filteredEditPermissionsOptions = permissionsOptions.filter(option =>
    option.label.toLowerCase().includes(editPermissionsSearchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNameDropdown && nameDropdownRef.current && !nameDropdownRef.current.contains(event.target as Node)) {
        setShowNameDropdown(false);
        setNameSearchQuery('');
      }
      if (showEditNameDropdown && editNameDropdownRef.current && !editNameDropdownRef.current.contains(event.target as Node)) {
        setShowEditNameDropdown(false);
        setEditNameSearchQuery('');
      }
      if (showPermissionsDropdown && permissionsDropdownRef.current && !permissionsDropdownRef.current.contains(event.target as Node)) {
        setShowPermissionsDropdown(false);
        setPermissionsSearchQuery('');
      }
      if (showEditPermissionsDropdown && editPermissionsDropdownRef.current && !editPermissionsDropdownRef.current.contains(event.target as Node)) {
        setShowEditPermissionsDropdown(false);
        setEditPermissionsSearchQuery('');
      }
    };

    if (showNameDropdown || showEditNameDropdown || showPermissionsDropdown || showEditPermissionsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNameDropdown, showEditNameDropdown, showPermissionsDropdown, showEditPermissionsDropdown]);
  
  // Filter access based on search query
  const filteredAccess = useMemo(() => {
    return allAccess.filter(access =>
      access.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      access.permissions.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allAccess, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAccess.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAccess = filteredAccess.slice(startIndex, endIndex);

  // RBAC handlers
  const handleAddAccess = () => {
    setAddForm({ name: '', permissions: [] });
    setShowAddModal(true);
  };

  const handleSaveAdd = () => {
    if (!addForm.name.trim() || addForm.permissions.length === 0) {
      setToastMessage('Please fill in all required fields');
      setShowToast(true);
      return;
    }

    // Check if access name already exists
    if (allAccess.some(access => access.name.toLowerCase() === addForm.name.toLowerCase())) {
      setToastMessage('Access name already exists. Please choose a different name.');
      setShowToast(true);
      return;
    }
    
    // Create new database access item
    const newAccess: DatabaseAccessData = {
      id: `db_access_${Date.now()}`,
      name: addForm.name.trim(),
      permissions: addForm.permissions.join(', '),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add the new access to the state - EXACTLY LIKE MANAGEPAGES
    setAllAccess(prevAccess => [...prevAccess, newAccess]);
    
    setToastMessage(`Database access "${addForm.name}" added successfully`);
    setShowToast(true);
    setShowAddModal(false);
    setAddForm({ name: '', permissions: [] });
  };

  const handleCloseAdd = () => {
    setShowAddModal(false);
    setAddForm({ name: '', permissions: [] });
  };

  const handleEdit = (accessId: string) => {
    const access = allAccess.find(a => a.id === accessId);
    if (access) {
      setEditingAccess(access);
      setEditForm({ 
        name: access.name, 
        permissions: access.permissions ? access.permissions.split(', ').filter(p => p.trim()) : []
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (!editForm.name.trim() || editForm.permissions.length === 0) {
      setToastMessage('Please fill in all required fields');
      setShowToast(true);
      return;
    }

    if (!editingAccess) return;

    // Check if access name already exists (excluding current item)
    if (allAccess.some(access => 
      access.id !== editingAccess.id && 
      access.name.toLowerCase() === editForm.name.toLowerCase()
    )) {
      setToastMessage('Access name already exists. Please choose a different name.');
      setShowToast(true);
      return;
    }
    
    // Update the access in the state - EXACTLY LIKE MANAGEPAGES
    setAllAccess(prevAccess => 
      prevAccess.map(access => 
        access.id === editingAccess.id 
          ? { ...access, name: editForm.name.trim(), permissions: editForm.permissions.join(', '), updatedAt: new Date().toISOString() }
          : access
      )
    );
    
    setToastMessage(`Database access "${editForm.name}" updated successfully`);
    setShowToast(true);
    setShowEditModal(false);
    setEditingAccess(null);
    setEditForm({ name: '', permissions: [] });
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingAccess(null);
    setEditForm({ name: '', permissions: [] });
  };

  const handleView = (accessId: string) => {
    const access = allAccess.find(a => a.id === accessId);
    if (access) {
      setViewingAccess(access);
      setShowViewModal(true);
    }
  };

  const handleCloseView = () => {
    setShowViewModal(false);
    setViewingAccess(null);
  };

  const handleDelete = (accessId: string) => {
    setSelectedAccessId(accessId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedAccessId) {
      // Actually remove the access from the state - EXACTLY LIKE MANAGEPAGES
      setAllAccess(prevAccess => prevAccess.filter(access => access.id !== selectedAccessId));
      
      const accessToDelete = allAccess.find(access => access.id === selectedAccessId);
      setToastMessage(`Database access "${accessToDelete?.name || selectedAccessId}" deleted successfully`);
      setShowToast(true);
      setSelectedAccessId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedAccessId(null);
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
          
          <IonContent className="database-access-content">
            <div className="access-container">
              {/* Header Section */}
              <RBACHeader
                title="Database Access"
                subtitle="Manage database access permissions and roles"
              />

              {/* Search and Actions */}
              <RBACControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search by name or permissions..."
                onAddNew={handleAddAccess}
                addButtonText="+ ADD ACCESS"
              />

              {/* Access Table */}
              <ScrollableTableContainer cardClassName="access-table-card">
                <table className="access-table">
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
                            <span>Permissions</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Action</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentAccess.map((access, index) => (
                        <tr key={access.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="access-name-cell">
                            <span className="access-name">{access.name}</span>
                          </td>
                          <td className="permissions-cell">
                            <span className="permissions-text">{access.permissions}</span>
                          </td>
                          <td className="actions-cell">
                            <ActionDropdown
                              itemId={access.id}
                              onView={() => handleView(access.id)}
                              onEdit={() => handleEdit(access.id)}
                              onDelete={() => handleDelete(access.id)}
                              showView={true}
                              size="small"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </ScrollableTableContainer>

              {/* Pagination */}
              {filteredAccess.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPreviousPage={handlePreviousPage}
                  onNextPage={handleNextPage}
                />
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
        message="Are you sure you want to delete this database access? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Add Access Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={handleCloseAdd}>
        <IonHeader>
          <IonToolbar style={{ '--background': '#4ecdc4', '--color': 'white' }}>
            <IonTitle>Add Database Access</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleCloseAdd} style={{ '--color': 'white' }}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Name *
                </IonLabel>
                <div style={{ position: 'relative' }} ref={nameDropdownRef}>
                <IonInput
                  value={addForm.name || ''}
                  placeholder="Search and select access name"
                  readonly
                  onClick={() => setShowNameDropdown(!showNameDropdown)}
                  style={{ 
                    '--background': '#e8e8e8',
                    '--border-radius': showNameDropdown ? '12px 12px 0 0' : '12px',
                    '--padding-start': '16px',
                    '--padding-end': '50px',
                    '--padding-top': '12px',
                    '--padding-bottom': '12px',
                    '--color': '#333',
                    '--placeholder-color': '#666'
                  }}
                >
                  <IonIcon 
                    icon={showNameDropdown ? chevronUpOutline : chevronDownOutline} 
                    slot="end" 
                    style={{ color: '#666', fontSize: '20px', cursor: 'pointer' }} 
                  />
                </IonInput>
                {showNameDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '0 0 12px 12px',
                    borderTop: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    maxHeight: '300px',
                    overflow: 'hidden'
                  }}>
              <IonInput
                      value={nameSearchQuery}
                      onIonInput={(e) => setNameSearchQuery(e.detail.value!)}
                      placeholder="Search names..."
                      style={{
                        '--background': '#f5f5f5',
                        '--border': 'none',
                        '--border-radius': '0',
                        '--padding-start': '16px',
                        '--padding-end': '16px',
                        '--padding-top': '12px',
                        '--padding-bottom': '12px',
                        '--color': '#333',
                        '--placeholder-color': '#666'
                      }}
                    />
                    <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                      {filteredNameOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setAddForm(prev => ({ ...prev, name: option.value }));
                            setShowNameDropdown(false);
                            setNameSearchQuery('');
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: addForm.name === option.value ? '#2196f3' : 'white',
                            color: addForm.name === option.value ? 'white' : '#333'
                          }}
                          onMouseEnter={(e) => {
                            if (addForm.name !== option.value) {
                              e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (addForm.name !== option.value) {
                              e.currentTarget.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          <span style={{ color: addForm.name === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                          {option.hasCheckmark && (
                            <IonIcon 
                              icon={checkmark} 
                              style={{ 
                                color: addForm.name === option.value ? 'white' : '#00C851', 
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
              
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Permissions *
                </IonLabel>
                <div style={{ position: 'relative' }} ref={permissionsDropdownRef}>
                <div
                  onClick={() => setShowPermissionsDropdown(!showPermissionsDropdown)}
                  style={{ 
                    background: '#e8e8e8',
                    borderRadius: showPermissionsDropdown ? '12px 12px 0 0' : '12px',
                    padding: '12px 16px',
                    minHeight: '48px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'space-between',
                    border: '1px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1, alignItems: 'center', minHeight: '24px' }}>
                    {addForm.permissions.length > 0 ? (
                      addForm.permissions.map((permission, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#2196f3',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          <span>{permission}</span>
                          <IonIcon
                            icon={closeOutline}
                            style={{
                              fontSize: '16px',
                              cursor: 'pointer',
                              color: 'white'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const newPermissions = addForm.permissions.filter((_, i) => i !== index);
                              setAddForm({...addForm, permissions: newPermissions});
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <span style={{ color: '#666', fontSize: '16px' }}>
                        Search and select permissions
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '24px', width: '24px', marginRight: '30px' }}>
                    <IonIcon 
                      icon={showPermissionsDropdown ? chevronUpOutline : chevronDownOutline} 
                      style={{ 
                        color: '#666', 
                        fontSize: '20px',
                        cursor: 'pointer'
                      }} 
                    />
                  </div>
                </div>
                {showPermissionsDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '0 0 12px 12px',
                    borderTop: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    maxHeight: '300px',
                    overflow: 'hidden'
                  }}>
                    <IonInput
                      value={permissionsSearchQuery}
                      onIonInput={(e) => setPermissionsSearchQuery(e.detail.value!)}
                      placeholder="Search permissions..."
                      style={{
                        '--background': '#f5f5f5',
                        '--border': 'none',
                        '--border-radius': '0',
                        '--padding-start': '16px',
                        '--padding-end': '16px',
                        '--padding-top': '12px',
                        '--padding-bottom': '12px',
                        '--color': '#333',
                        '--placeholder-color': '#666'
                      }}
                    />
                    <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                      {filteredPermissionsOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            const isSelected = addForm.permissions.includes(option.value);
                            let newPermissions;
                            if (isSelected) {
                              newPermissions = addForm.permissions.filter(p => p !== option.value);
                            } else {
                              newPermissions = [...addForm.permissions, option.value];
                            }
                            setAddForm(prev => ({ ...prev, permissions: newPermissions }));
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: addForm.permissions.includes(option.value) ? '#2196f3' : 'white',
                            color: addForm.permissions.includes(option.value) ? 'white' : '#333'
                          }}
                          onMouseEnter={(e) => {
                            if (!addForm.permissions.includes(option.value)) {
                              e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!addForm.permissions.includes(option.value)) {
                              e.currentTarget.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              border: `2px solid ${addForm.permissions.includes(option.value) ? 'white' : '#ddd'}`,
                              backgroundColor: addForm.permissions.includes(option.value) ? 'white' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative'
                            }}>
                              {addForm.permissions.includes(option.value) && (
                                <div style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: '#2196f3'
                                }} />
                              )}
                            </div>
                            <span style={{ color: addForm.permissions.includes(option.value) ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                          </div>
                          {option.hasCheckmark && (
                            <IonIcon 
                              icon={checkmark} 
                              style={{ 
                                color: addForm.permissions.includes(option.value) ? 'white' : '#00C851', 
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
            </div>
            
            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center', 
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e0e0e0'
            }}>
              <IonButton 
                fill="outline" 
                onClick={handleCloseAdd}
                style={{
                  '--border-color': '#4ecdc4',
                  '--color': '#4ecdc4',
                  '--border-radius': '8px',
                  '--padding-start': '1.5rem',
                  '--padding-end': '1.5rem'
                }}
              >
                CANCEL
              </IonButton>
              <IonButton 
                fill="solid" 
                onClick={handleSaveAdd}
                style={{
                  '--background': '#4ecdc4',
                  '--color': 'white',
                  '--border-radius': '8px',
                  '--padding-start': '1.5rem',
                  '--padding-end': '1.5rem'
                }}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                ADD ACCESS
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Access Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={handleCloseEdit}>
        <IonHeader>
          <IonToolbar style={{ '--background': '#4ecdc4', '--color': 'white' }}>
            <IonTitle>Edit Database Access</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleCloseEdit} style={{ '--color': 'white' }}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Name *
                </IonLabel>
                <div style={{ position: 'relative' }} ref={editNameDropdownRef}>
              <IonInput
                value={editForm.name || ''}
                placeholder="Search and select access name"
                readonly
                onClick={() => setShowEditNameDropdown(!showEditNameDropdown)}
                style={{ 
                  '--background': '#e8e8e8',
                  '--border-radius': showEditNameDropdown ? '12px 12px 0 0' : '12px',
                  '--padding-start': '16px',
                  '--padding-end': '50px',
                  '--padding-top': '12px',
                  '--padding-bottom': '12px',
                  '--color': '#333',
                  '--placeholder-color': '#666'
                }}
              >
                <IonIcon 
                  icon={showEditNameDropdown ? chevronUpOutline : chevronDownOutline} 
                  slot="end" 
                  style={{ color: '#666', fontSize: '20px', cursor: 'pointer' }} 
                />
              </IonInput>
              {showEditNameDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '0 0 12px 12px',
                  borderTop: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  maxHeight: '300px',
                  overflow: 'hidden'
                }}>
            <IonInput
                    value={editNameSearchQuery}
                    onIonInput={(e) => setEditNameSearchQuery(e.detail.value!)}
                    placeholder="Search names..."
                    style={{
                      '--background': '#f5f5f5',
                      '--border': 'none',
                      '--border-radius': '0',
                      '--padding-start': '16px',
                      '--padding-end': '16px',
                      '--padding-top': '12px',
                      '--padding-bottom': '12px',
                      '--color': '#333',
                      '--placeholder-color': '#666'
                    }}
                  />
                  <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                    {filteredEditNameOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setEditForm(prev => ({ ...prev, name: option.value }));
                          setShowEditNameDropdown(false);
                          setEditNameSearchQuery('');
                        }}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid #f0f0f0',
                          backgroundColor: editForm.name === option.value ? '#2196f3' : 'white',
                          color: editForm.name === option.value ? 'white' : '#333'
                        }}
                        onMouseEnter={(e) => {
                          if (editForm.name !== option.value) {
                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (editForm.name !== option.value) {
                            e.currentTarget.style.backgroundColor = 'white';
                          }
                        }}
                      >
                        <span style={{ color: editForm.name === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                        {option.hasCheckmark && (
                          <IonIcon 
                            icon={checkmark} 
                            style={{ 
                              color: editForm.name === option.value ? 'white' : '#00C851', 
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
              
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Permissions *
                </IonLabel>
                <div style={{ position: 'relative' }} ref={editPermissionsDropdownRef}>
              <div
                onClick={() => setShowEditPermissionsDropdown(!showEditPermissionsDropdown)}
                style={{ 
                  background: '#e8e8e8',
                  borderRadius: showEditPermissionsDropdown ? '12px 12px 0 0' : '12px',
                  padding: '12px 16px',
                  minHeight: '48px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexWrap: 'nowrap',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'space-between',
                  border: '1px solid transparent'
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1, alignItems: 'center', minHeight: '24px' }}>
                  {editForm.permissions.length > 0 ? (
                    editForm.permissions.map((permission, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#2196f3',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        <span>{permission}</span>
                        <IonIcon
                          icon={closeOutline}
                          style={{
                            fontSize: '16px',
                            cursor: 'pointer',
                            color: 'white'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const newPermissions = editForm.permissions.filter((_, i) => i !== index);
                            setEditForm({...editForm, permissions: newPermissions});
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <span style={{ color: '#666', fontSize: '16px' }}>
                      Search and select permissions
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '24px', width: '24px', marginRight: '30px' }}>
                  <IonIcon 
                    icon={showEditPermissionsDropdown ? chevronUpOutline : chevronDownOutline} 
                    style={{ 
                      color: '#666', 
                      fontSize: '20px',
                      cursor: 'pointer'
                    }} 
                  />
                </div>
              </div>
              {showEditPermissionsDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '0 0 12px 12px',
                  borderTop: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  maxHeight: '300px',
                  overflow: 'hidden'
                }}>
                  <IonInput
                    value={editPermissionsSearchQuery}
                    onIonInput={(e) => setEditPermissionsSearchQuery(e.detail.value!)}
                    placeholder="Search permissions..."
                    style={{
                      '--background': '#f5f5f5',
                      '--border': 'none',
                      '--border-radius': '0',
                      '--padding-start': '16px',
                      '--padding-end': '16px',
                      '--padding-top': '12px',
                      '--padding-bottom': '12px',
                      '--color': '#333',
                      '--placeholder-color': '#666'
                    }}
                  />
                  <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                    {filteredEditPermissionsOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          const isSelected = editForm.permissions.includes(option.value);
                          let newPermissions;
                          if (isSelected) {
                            newPermissions = editForm.permissions.filter(p => p !== option.value);
                          } else {
                            newPermissions = [...editForm.permissions, option.value];
                          }
                          setEditForm(prev => ({ ...prev, permissions: newPermissions }));
                        }}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid #f0f0f0',
                          backgroundColor: editForm.permissions.includes(option.value) ? '#2196f3' : 'white',
                          color: editForm.permissions.includes(option.value) ? 'white' : '#333'
                        }}
                        onMouseEnter={(e) => {
                          if (!editForm.permissions.includes(option.value)) {
                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!editForm.permissions.includes(option.value)) {
                            e.currentTarget.style.backgroundColor = 'white';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: `2px solid ${editForm.permissions.includes(option.value) ? 'white' : '#ddd'}`,
                            backgroundColor: editForm.permissions.includes(option.value) ? 'white' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                          }}>
                            {editForm.permissions.includes(option.value) && (
                              <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#2196f3'
                              }} />
                            )}
                          </div>
                          <span style={{ color: editForm.permissions.includes(option.value) ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                        </div>
                        {option.hasCheckmark && (
                          <IonIcon 
                            icon={checkmark} 
                            style={{ 
                              color: editForm.permissions.includes(option.value) ? 'white' : '#00C851', 
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
            </div>
            
            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center', 
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e0e0e0'
            }}>
              <IonButton 
                fill="outline" 
                onClick={handleCloseEdit}
                style={{
                  '--border-color': '#4ecdc4',
                  '--color': '#4ecdc4',
                  '--border-radius': '8px',
                  '--padding-start': '1.5rem',
                  '--padding-end': '1.5rem'
                }}
              >
                CANCEL
              </IonButton>
              <IonButton 
                fill="solid" 
                onClick={handleSaveEdit}
                style={{
                  '--background': '#4ecdc4',
                  '--color': 'white',
                  '--border-radius': '8px',
                  '--padding-start': '1.5rem',
                  '--padding-end': '1.5rem'
                }}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                UPDATE ACCESS
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* View Access Modal */}
      <IonModal isOpen={showViewModal} onDidDismiss={handleCloseView}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Database Access Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleCloseView}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="view-modal-content">
          {viewingAccess && (
            <div>
              <IonItem>
                <IonLabel>
                  <h2>Name</h2>
                  <p>{viewingAccess.name}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Permissions</h2>
                  <p>{viewingAccess.permissions}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Created At</h2>
                  <p>{new Date(viewingAccess.createdAt).toLocaleDateString()}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Updated At</h2>
                  <p>{new Date(viewingAccess.updatedAt).toLocaleDateString()}</p>
                </IonLabel>
              </IonItem>
            </div>
          )}
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

export default DatabaseAccess;
