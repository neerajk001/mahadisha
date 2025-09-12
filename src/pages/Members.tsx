import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonChip, IonFab, IonFabButton, IonToast, IonSearchbar, IonPopover, IonList, IonItem, IonLabel,
  IonModal, IonInput, IonSelect, IonSelectOption, IonTextarea, IonAlert, IonButtons
} from '@ionic/react';
import { 
  searchOutline, accessibilityOutline,
  createOutline, trashOutline, checkmarkOutline, pauseOutline,
  ellipsisVerticalOutline, chevronDownOutline, addOutline, closeOutline, saveOutline,
  personOutline, mailOutline, callOutline, locationOutline, shieldOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { MembersData } from '../types';
import './Members.css';

const Members: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Advanced search states
  const [showSearchPopover, setShowSearchPopover] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showActionsPopover, setShowActionsPopover] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRoleHistoryModal, setShowRoleHistoryModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [editingMember, setEditingMember] = useState<MembersData | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    district: '',
    role: '',
    status: 'Active' as 'Active' | 'Suspended' | 'Inactive' | 'Deleted'
  });

  // Role history state
  const [roleHistory, setRoleHistory] = useState<Array<{
    id: string;
    role: string;
    changedAt: string;
    changedBy: string;
    reason: string;
  }>>([]);

  // State for managing members data
  const [allMembers, setAllMembers] = useState<MembersData[]>(mockDataService.getMembersData());
  
  // Generate search suggestions for autocomplete
  const generateSearchSuggestions = useMemo(() => {
    const suggestions = new Set<string>();
    
    allMembers.forEach(member => {
      // Add name suggestions
      if (member.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.add(member.name);
      }
      // Add email suggestions
      if (member.email.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.add(member.email);
      }
      // Add district suggestions
      if (member.district.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.add(member.district);
      }
      // Add role suggestions
      if (member.role.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.add(member.role);
      }
      // Add status suggestions
      if (member.status.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.add(member.status);
      }
    });
    
    return Array.from(suggestions).slice(0, 8); // Limit to 8 suggestions
  }, [allMembers, searchQuery]);

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return allMembers;
    
    return allMembers.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery) ||
      member.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allMembers, searchQuery]);


  // Form handlers
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      district: '',
      role: '',
      status: 'Active'
    });
  };

  const handleAddMember = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (memberId: string) => {
    const member = allMembers.find(m => m.id === memberId);
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        district: member.district,
        role: member.role,
        status: member.status
      });
      setShowEditModal(true);
    }
  };

  const handleSaveMember = () => {
    const errors: string[] = [];
    
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.phone.trim()) errors.push('Phone is required');
    if (!formData.district.trim()) errors.push('District is required');
    if (!formData.role.trim()) errors.push('Role is required');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      errors.push('Phone number must be exactly 10 digits');
    }
    
    // Check for duplicate email (only for new members or when email is changed)
    const existingMember = allMembers.find(member => 
      member.email.toLowerCase() === formData.email.toLowerCase() && 
      member.id !== editingMember?.id
    );
    if (existingMember) {
      errors.push('Email already exists');
    }
    
    if (errors.length > 0) {
      setToastMessage(`Validation errors: ${errors.join(', ')}`);
      setShowToast(true);
      return;
    }
    
    if (editingMember) {
      // Update existing member
      setAllMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === editingMember.id 
            ? {
                ...member,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                district: formData.district,
                role: formData.role,
                status: formData.status,
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : member
        )
      );
      setToastMessage('Member updated successfully');
    } else {
      // Add new member
      const newMember: MembersData = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        district: formData.district,
        role: formData.role,
        status: formData.status,
        roleHistoryCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setAllMembers(prevMembers => [...prevMembers, newMember]);
      setToastMessage('Member added successfully');
    }
    
    setShowToast(true);
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingMember(null);
    resetForm();
  };

  const handleActivate = (memberId: string) => {
    setAllMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === memberId 
          ? { ...member, status: 'Active', updatedAt: new Date().toISOString().split('T')[0] }
          : member
      )
    );
    setToastMessage('Member activated successfully');
    setShowToast(true);
  };

  const handleRestore = (memberId: string) => {
    setAllMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === memberId 
          ? { ...member, status: 'Active', updatedAt: new Date().toISOString().split('T')[0] }
          : member
      )
    );
    setToastMessage('Member restored successfully');
    setShowToast(true);
  };

  const handleSuspend = (memberId: string) => {
    setAllMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === memberId 
          ? { ...member, status: 'Suspended', updatedAt: new Date().toISOString().split('T')[0] }
          : member
      )
    );
    setToastMessage('Member suspended successfully');
    setShowToast(true);
  };

  const handleInactivate = (memberId: string) => {
    setAllMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === memberId 
          ? { ...member, status: 'Inactive', updatedAt: new Date().toISOString().split('T')[0] }
          : member
      )
    );
    setToastMessage('Member inactivated successfully');
    setShowToast(true);
  };

  const handleDelete = (memberId: string) => {
    setSelectedMemberId(memberId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedMemberId) {
      setAllMembers(prevMembers => 
        prevMembers.filter(member => member.id !== selectedMemberId)
      );
      setToastMessage('Member deleted successfully');
    setShowToast(true);
      setSelectedMemberId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedMemberId(null);
    setShowDeleteAlert(false);
  };

  const handleRoleHistory = (memberId: string) => {
    const member = allMembers.find(m => m.id === memberId);
    if (member) {
      setEditingMember(member);
      // Generate mock role history
      const mockHistory = [
        {
          id: '1',
          role: member.role,
          changedAt: member.updatedAt,
          changedBy: 'Admin',
          reason: 'Current role'
        },
        {
          id: '2',
          role: 'Previous Role',
          changedAt: '2024-01-01',
          changedBy: 'System',
          reason: 'Role change'
        }
      ];
      setRoleHistory(mockHistory);
      setShowRoleHistoryModal(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Suspended':
        return 'warning';
      case 'Inactive':
        return 'medium';
      case 'Deleted':
        return 'danger';
      default:
        return 'medium';
    }
  };

  // Handler functions for advanced search
  const handleSearchInput = (e: CustomEvent) => {
    const value = e.detail.value!;
    setSearchQuery(value);
    if (value.length > 0) {
      setShowSearchPopover(true);
    } else {
      setShowSearchPopover(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSearchPopover(false);
  };

  // Handler functions for actions dropdown
  const handleActionsClick = (memberId: string) => {
    setSelectedMemberId(memberId);
    setShowActionsPopover(true);
  };

  const handleActionSelect = (action: string) => {
    if (selectedMemberId) {
      switch (action) {
        case 'edit':
          handleEdit(selectedMemberId);
          break;
        case 'activate':
          handleActivate(selectedMemberId);
          break;
        case 'suspend':
          handleSuspend(selectedMemberId);
          break;
        case 'inactivate':
          handleInactivate(selectedMemberId);
          break;
        case 'delete':
          handleDelete(selectedMemberId);
          break;
        case 'restore':
          handleRestore(selectedMemberId);
          break;
        case 'roleHistory':
          handleRoleHistory(selectedMemberId);
          break;
      }
    }
    setShowActionsPopover(false);
    setSelectedMemberId(null);
  };

  const getMemberActions = (member: MembersData) => {
    if (member.status === 'Active') {
      return [
        { id: 'edit', label: 'Edit Member', icon: createOutline },
        { id: 'suspend', label: 'Suspend Member', icon: pauseOutline },
        { id: 'inactivate', label: 'Inactivate Member', icon: pauseOutline },
        { id: 'roleHistory', label: 'Role History', icon: accessibilityOutline },
        { id: 'delete', label: 'Delete Member', icon: trashOutline }
      ];
    } else if (member.status === 'Suspended') {
      return [
        { id: 'activate', label: 'Activate Member', icon: checkmarkOutline },
        { id: 'edit', label: 'Edit Member', icon: createOutline },
        { id: 'inactivate', label: 'Inactivate Member', icon: pauseOutline },
        { id: 'roleHistory', label: 'Role History', icon: accessibilityOutline },
        { id: 'delete', label: 'Delete Member', icon: trashOutline }
      ];
    } else if (member.status === 'Inactive') {
      return [
        { id: 'activate', label: 'Activate Member', icon: checkmarkOutline },
        { id: 'edit', label: 'Edit Member', icon: createOutline },
        { id: 'suspend', label: 'Suspend Member', icon: pauseOutline },
        { id: 'roleHistory', label: 'Role History', icon: accessibilityOutline },
        { id: 'delete', label: 'Delete Member', icon: trashOutline }
      ];
    } else { // Deleted
      return [
        { id: 'restore', label: 'Restore Member', icon: checkmarkOutline },
        { id: 'roleHistory', label: 'Role History', icon: accessibilityOutline }
      ];
    }
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="members-content">
            <div className="members-container">
              {/* Header Section */}
              <div className="members-header">
                <h1>Members ({filteredMembers.length})</h1>
              </div>

              {/* Advanced Search Section */}
              <div className="search-section">
                <div className="search-content">
                  <IonSearchbar
                    value={searchQuery}
                    onIonInput={handleSearchInput}
                    placeholder="Search members by name, email, phone, district, role, or status..."
                    className="advanced-search"
                    showClearButton="focus"
                  />
                  <IonButton 
                    fill="solid" 
                    className="add-members-button"
                    onClick={handleAddMember}
                  >
                    <IonIcon icon={addOutline} />
                    Add Member
                  </IonButton>
                </div>
                
                {/* Search Suggestions Popover */}
                <IonPopover
                  isOpen={showSearchPopover && generateSearchSuggestions.length > 0}
                  onDidDismiss={() => setShowSearchPopover(false)}
                  className="search-suggestions-popover"
                >
                  <IonList className="suggestions-list">
                    {generateSearchSuggestions.map((suggestion, index) => (
                      <IonItem 
                        key={index} 
                        button 
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className="suggestion-item"
                      >
                        <IonIcon icon={searchOutline} slot="start" />
                        <IonLabel>{suggestion}</IonLabel>
                      </IonItem>
                    ))}
                  </IonList>
                </IonPopover>
              </div>

              {/* Members Table */}
              <IonCard className="members-table-card">
                <IonCardContent className="table-container">
                  <table className="members-table">
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
                            <span>Email</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Phone</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>District</span>
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
                            <span>Status</span>
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
                      {filteredMembers.map((member, index) => (
                        <tr key={member.id} className={`${index % 2 === 0 ? 'even-row' : 'odd-row'} ${member.status === 'Deleted' ? 'deleted-row' : ''}`}>
                          <td className="name-cell">
                            <span className="member-name">{member.name}</span>
                          </td>
                          <td className="email-cell">
                            <span className="member-email">{member.email}</span>
                          </td>
                          <td className="phone-cell">
                            <span className="member-phone">{member.phone}</span>
                          </td>
                          <td className="district-cell">
                            <span className="member-district">{member.district || '-'}</span>
                          </td>
                          <td className="role-cell">
                            <div className="role-section">
                              <span className="member-role">{member.role}</span>
                              <IonButton 
                                fill="solid" 
                                size="small" 
                                className="role-history-button"
                                onClick={() => handleRoleHistory(member.id)}
                              >
                                Role History ({member.roleHistoryCount})
                              </IonButton>
                            </div>
                          </td>
                          <td className="status-cell">
                            <IonChip 
                              color={getStatusColor(member.status)}
                              className="status-chip"
                            >
                              {member.status}
                            </IonChip>
                          </td>
                          <td className="actions-cell">
                            <div className="actions-section">
                              <IonButton 
                                id={`actions-${member.id}`}
                                fill="outline" 
                                size="small" 
                                className="actions-dropdown-button"
                                onClick={() => handleActionsClick(member.id)}
                              >
                                <IonIcon icon={ellipsisVerticalOutline} />
                                Actions
                                <IonIcon icon={chevronDownOutline} slot="end" />
                              </IonButton>
                              
                              <IonPopover
                                trigger={`actions-${member.id}`}
                                isOpen={showActionsPopover && selectedMemberId === member.id}
                                onDidDismiss={() => {
                                  setShowActionsPopover(false);
                                  setSelectedMemberId(null);
                                }}
                                className="actions-popover"
                              >
                                <IonList className="actions-list">
                                  {getMemberActions(member).map((action) => (
                                    <IonItem 
                                      key={action.id} 
                                      button 
                                      onClick={() => handleActionSelect(action.id)}
                                      className="action-item"
                                    >
                                      <IonIcon icon={action.icon} slot="start" />
                                      <IonLabel>{action.label}</IonLabel>
                                    </IonItem>
                                  ))}
                                </IonList>
                              </IonPopover>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </IonCardContent>
              </IonCard>
            </div>
          </IonContent>
        </div>
      </IonSplitPane>

      {/* Floating Action Button */}
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton className="fab-button" onClick={handleAddMember}>
          <IonIcon icon={addOutline} />
        </IonFabButton>
      </IonFab>

      {/* Add Member Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Member</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="modal-content">
          <div className="form-container">
            <div className="form-section">
              <h3>Member Information</h3>
              <IonItem>
                <IonIcon icon={personOutline} slot="start" />
                <IonInput
                  label="Name"
                  labelPlacement="stacked"
                  value={formData.name}
                  onIonInput={(e) => setFormData({...formData, name: e.detail.value!})}
                  placeholder="Enter member name"
                />
              </IonItem>
              
              <IonItem>
                <IonIcon icon={mailOutline} slot="start" />
                <IonInput
                  label="Email"
                  labelPlacement="stacked"
                  type="email"
                  value={formData.email}
                  onIonInput={(e) => setFormData({...formData, email: e.detail.value!})}
                  placeholder="Enter email address"
                />
              </IonItem>
              
              <IonItem>
                <IonIcon icon={callOutline} slot="start" />
                <IonInput
                  label="Phone"
                  labelPlacement="stacked"
                  type="tel"
                  value={formData.phone}
                  onIonInput={(e) => setFormData({...formData, phone: e.detail.value!})}
                  placeholder="Enter phone number"
                />
              </IonItem>
              
              <IonItem>
                <IonIcon icon={locationOutline} slot="start" />
                <IonInput
                  label="District"
                  labelPlacement="stacked"
                  value={formData.district}
                  onIonInput={(e) => setFormData({...formData, district: e.detail.value!})}
                  placeholder="Enter district"
                />
              </IonItem>
              
              <IonItem>
                <IonIcon icon={shieldOutline} slot="start" />
                <IonInput
                  label="Role"
                  labelPlacement="stacked"
                  value={formData.role}
                  onIonInput={(e) => setFormData({...formData, role: e.detail.value!})}
                  placeholder="Enter role"
                />
              </IonItem>
              
              <IonItem>
                <IonSelect
                  label="Status"
                  labelPlacement="stacked"
                  value={formData.status}
                  onSelectionChange={(e) => setFormData({...formData, status: e.detail.value})}
                >
                  <IonSelectOption value="Active">Active</IonSelectOption>
                  <IonSelectOption value="Suspended">Suspended</IonSelectOption>
                  <IonSelectOption value="Inactive">Inactive</IonSelectOption>
                  <IonSelectOption value="Deleted">Deleted</IonSelectOption>
                </IonSelect>
              </IonItem>
            </div>
          </div>
        </IonContent>
        <div className="modal-actions">
          <IonButton fill="outline" onClick={() => setShowAddModal(false)}>
            Cancel
          </IonButton>
          <IonButton fill="solid" onClick={handleSaveMember}>
            <IonIcon icon={saveOutline} />
            Add Member
          </IonButton>
        </div>
      </IonModal>

      {/* Edit Member Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Member</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="modal-content">
          <div className="form-container">
            <div className="form-section">
              <h3>Member Information</h3>
              <IonItem>
                <IonIcon icon={personOutline} slot="start" />
                <IonInput
                  label="Name"
                  labelPlacement="stacked"
                  value={formData.name}
                  onIonInput={(e) => setFormData({...formData, name: e.detail.value!})}
                  placeholder="Enter member name"
                />
              </IonItem>
              
              <IonItem>
                <IonIcon icon={mailOutline} slot="start" />
                <IonInput
                  label="Email"
                  labelPlacement="stacked"
                  type="email"
                  value={formData.email}
                  onIonInput={(e) => setFormData({...formData, email: e.detail.value!})}
                  placeholder="Enter email address"
                />
              </IonItem>
              
              <IonItem>
                <IonIcon icon={callOutline} slot="start" />
                <IonInput
                  label="Phone"
                  labelPlacement="stacked"
                  type="tel"
                  value={formData.phone}
                  onIonInput={(e) => setFormData({...formData, phone: e.detail.value!})}
                  placeholder="Enter phone number"
                />
              </IonItem>
              
              <IonItem>
                <IonIcon icon={locationOutline} slot="start" />
                <IonInput
                  label="District"
                  labelPlacement="stacked"
                  value={formData.district}
                  onIonInput={(e) => setFormData({...formData, district: e.detail.value!})}
                  placeholder="Enter district"
                />
              </IonItem>
              
              <IonItem>
                <IonIcon icon={shieldOutline} slot="start" />
                <IonInput
                  label="Role"
                  labelPlacement="stacked"
                  value={formData.role}
                  onIonInput={(e) => setFormData({...formData, role: e.detail.value!})}
                  placeholder="Enter role"
                />
              </IonItem>
              
              <IonItem>
                <IonSelect
                  label="Status"
                  labelPlacement="stacked"
                  value={formData.status}
                  onSelectionChange={(e) => setFormData({...formData, status: e.detail.value})}
                >
                  <IonSelectOption value="Active">Active</IonSelectOption>
                  <IonSelectOption value="Suspended">Suspended</IonSelectOption>
                  <IonSelectOption value="Inactive">Inactive</IonSelectOption>
                  <IonSelectOption value="Deleted">Deleted</IonSelectOption>
                </IonSelect>
              </IonItem>
            </div>
          </div>
        </IonContent>
        <div className="modal-actions">
          <IonButton fill="outline" onClick={() => setShowEditModal(false)}>
            Cancel
          </IonButton>
          <IonButton fill="solid" onClick={handleSaveMember}>
            <IonIcon icon={saveOutline} />
            Update Member
          </IonButton>
        </div>
      </IonModal>

      {/* Role History Modal */}
      <IonModal isOpen={showRoleHistoryModal} onDidDismiss={() => setShowRoleHistoryModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Role History - {editingMember?.name}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowRoleHistoryModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="modal-content">
          <div className="role-history-container">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Role Changes</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="role-history-list">
                  {roleHistory.map((history, index) => (
                    <div key={history.id} className="role-history-item">
                      <div className="role-info">
                        <h4>{history.role}</h4>
                        <p>Changed by: {history.changedBy}</p>
                        <p>Date: {history.changedAt}</p>
                        <p>Reason: {history.reason}</p>
                      </div>
                      {index < roleHistory.length - 1 && <div className="timeline-connector" />}
                    </div>
                  ))}
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
        <div className="modal-actions">
          <IonButton fill="outline" onClick={() => setShowRoleHistoryModal(false)}>
            Close
          </IonButton>
        </div>
      </IonModal>

      {/* Delete Confirmation Alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={cancelDelete}
        header="Delete Member"
        message="Are you sure you want to delete this member? This action cannot be undone."
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: cancelDelete
          },
          {
            text: 'Delete',
            role: 'destructive',
            handler: confirmDelete
          }
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

export default Members;
