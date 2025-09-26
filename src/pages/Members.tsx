import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  personOutline, mailOutline, callOutline, locationOutline, shieldOutline,
  checkmark, closeOutline as closeOutlineIcon
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { MembersData } from '../types';
import { Pagination } from '../admin/components/shared';
import { RBACControls, RBACHeader, ScrollableTableContainer } from '../components/shared';
import './Members.css';

const Members: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
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
    officeType: '',
    aadharNumber: '',
    panNumber: '',
    selectedUsers: [] as string[],
    status: 'Active' as 'Active' | 'Suspended' | 'Inactive' | 'Deleted'
  });

  // Dropdown states for Office Type and Users
  const [showOfficeTypeDropdown, setShowOfficeTypeDropdown] = useState(false);
  const [officeTypeSearchQuery, setOfficeTypeSearchQuery] = useState('');
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);
  const [usersSearchQuery, setUsersSearchQuery] = useState('');
  
  // Refs for click outside detection
  const officeTypeDropdownRef = useRef<HTMLDivElement>(null);
  const usersDropdownRef = useRef<HTMLDivElement>(null);

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
  
  // Office Type options
  const officeTypeOptions = [
    { value: "Head Office", label: "Head Office", hasCheckmark: true },
    { value: "Regional Office", label: "Regional Office", hasCheckmark: true },
    { value: "District Office", label: "District Office", hasCheckmark: true },
    { value: "Branch Office", label: "Branch Office", hasCheckmark: true },
    { value: "Sub Office", label: "Sub Office", hasCheckmark: true }
  ];

  // Users options (district-based roles from StatusMapping)
  const usersOptions = [
    { value: "Wardha_District Accountant", label: "Wardha_District Accountant", hasCheckmark: true },
    { value: "Thane_District Accountant", label: "Thane_District Accountant", hasCheckmark: true },
    { value: "Thane_District Scrutiny Clerk", label: "Thane_District Scrutiny Clerk", hasCheckmark: true },
    { value: "Nashik_District Assistant", label: "Nashik_District Assistant", hasCheckmark: true },
    { value: "Nagpur_Scrutiny Clerk", label: "Nagpur_Scrutiny Clerk", hasCheckmark: true },
    { value: "Aurangabad(Chh. Sambhaji Nagar)_District Accountant", label: "Aurangabad(Chh. Sambhaji Nagar)_District Accountant", hasCheckmark: true },
    { value: "Buldhana_District Manager", label: "Buldhana_District Manager", hasCheckmark: true },
    { value: "Nashik_District Manager", label: "Nashik_District Manager", hasCheckmark: true },
    { value: "Aurangabad (Chh.Sambhaji Nagar) Region_Regional Accountant", label: "Aurangabad (Chh.Sambhaji Nagar) Region_Regional Accountant", hasCheckmark: true },
    { value: "Nanded_District Assistant", label: "Nanded_District Assistant", hasCheckmark: true },
    { value: "Wardha_Scrutiny Clerk", label: "Wardha_Scrutiny Clerk", hasCheckmark: true },
    { value: "Solapur_District Assistant", label: "Solapur_District Assistant", hasCheckmark: true },
    { value: "General Manager P2", label: "General Manager P2", hasCheckmark: true },
    { value: "Amravati_District Manager", label: "Amravati_District Manager", hasCheckmark: true },
    { value: "Hingoli_District Assistant", label: "Hingoli_District Assistant", hasCheckmark: true },
    { value: "Ratnagiri_District Manager", label: "Ratnagiri_District Manager", hasCheckmark: true },
    { value: "Sindhudurg_District Accountant", label: "Sindhudurg_District Accountant", hasCheckmark: true },
    { value: "Sindhudurg_District Scrutiny Clerk", label: "Sindhudurg_District Scrutiny Clerk", hasCheckmark: true },
    { value: "Mumbai Suburban_District Manager", label: "Mumbai Suburban_District Manager", hasCheckmark: true },
    { value: "Aurangabad(Chh. Sambhaji Nagar)_District Assistant", label: "Aurangabad(Chh. Sambhaji Nagar)_District Assistant", hasCheckmark: true },
    { value: "Chandrapur_District Accountant", label: "Chandrapur_District Accountant", hasCheckmark: true },
    { value: "Satara_District_Selection Committee", label: "Satara_District_Selection Committee", hasCheckmark: true },
    { value: "Beed_District_Selection Committee", label: "Beed_District_Selection Committee", hasCheckmark: true },
    { value: "Nanded_District_Selection Committee", label: "Nanded_District_Selection Committee", hasCheckmark: true },
    { value: "Nagpur_District_Selection Committee", label: "Nagpur_District_Selection Committee", hasCheckmark: true },
    { value: "Nandurbar_District Assistant", label: "Nandurbar_District Assistant", hasCheckmark: true },
    { value: "Dhule_District Assistant", label: "Dhule_District Assistant", hasCheckmark: true },
    { value: "Raigad_District Manager", label: "Raigad_District Manager", hasCheckmark: true },
    { value: "Raigad_District Assistant", label: "Raigad_District Assistant", hasCheckmark: true },
    { value: "Latur_District Accountant", label: "Latur_District Accountant", hasCheckmark: true },
    { value: "Jalgaon_District Assistant", label: "Jalgaon_District Assistant", hasCheckmark: true },
    { value: "Amravati Region_Regional Manager", label: "Amravati Region_Regional Manager", hasCheckmark: true },
    { value: "Solapur_Scrutiny Clerk", label: "Solapur_Scrutiny Clerk", hasCheckmark: true },
    { value: "Managing Director", label: "Managing Director", hasCheckmark: true },
    { value: "Gondia_District Scrutiny Clerk", label: "Gondia_District Scrutiny Clerk", hasCheckmark: true },
    { value: "Assistant General Manager P2 / P3", label: "Assistant General Manager P2 / P3", hasCheckmark: true },
    { value: "Mumbai Suburban_District Accountant", label: "Mumbai Suburban_District Accountant", hasCheckmark: true },
    { value: "Parbhani_District_Selection Committee", label: "Parbhani_District_Selection Committee", hasCheckmark: true },
    { value: "Latur_District_Selection Committee", label: "Latur_District_Selection Committee", hasCheckmark: true },
    { value: "Dhule_District Assistant", label: "Dhule_District Assistant", hasCheckmark: true },
    { value: "Kolhapur_District_Selection Committee", label: "Kolhapur_District_Selection Committee", hasCheckmark: true },
    { value: "Solapur_District_Selection Committee", label: "Solapur_District_Selection Committee", hasCheckmark: true },
    { value: "Mumbai City_District_Selection Committee", label: "Mumbai City_District_Selection Committee", hasCheckmark: true },
    { value: "Hingoli_District_Selection Committee", label: "Hingoli_District_Selection Committee", hasCheckmark: true },
    { value: "Jalgaon_District_Selection Committee", label: "Jalgaon_District_Selection Committee", hasCheckmark: true },
    { value: "Latur_District Manager", label: "Latur_District Manager", hasCheckmark: true },
    { value: "Parbhani_Scrutiny Clerk", label: "Parbhani_Scrutiny Clerk", hasCheckmark: true }
  ];

  // Filter options based on search query
  const filteredOfficeTypeOptions = officeTypeOptions.filter(option =>
    option.label.toLowerCase().includes(officeTypeSearchQuery.toLowerCase())
  );
  const filteredUsersOptions = usersOptions.filter(option =>
    option.label.toLowerCase().includes(usersSearchQuery.toLowerCase())
  );

  // Click outside detection for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showOfficeTypeDropdown && officeTypeDropdownRef.current && !officeTypeDropdownRef.current.contains(event.target as Node)) {
        setShowOfficeTypeDropdown(false);
        setOfficeTypeSearchQuery('');
      }
      if (showUsersDropdown && usersDropdownRef.current && !usersDropdownRef.current.contains(event.target as Node)) {
        setShowUsersDropdown(false);
        setUsersSearchQuery('');
      }
    };

    if (showOfficeTypeDropdown || showUsersDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOfficeTypeDropdown, showUsersDropdown]);

  // Handle adding/removing users from multi-select
  const toggleUser = (userValue: string) => {
    setFormData(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userValue)
        ? prev.selectedUsers.filter(user => user !== userValue)
        : [...prev.selectedUsers, userValue]
    }));
  };

  const removeUser = (userValue: string) => {
    setFormData(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.filter(user => user !== userValue)
    }));
  };
  
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

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  // Pagination handlers
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


  // Form handlers
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      officeType: '',
      aadharNumber: '',
      panNumber: '',
      selectedUsers: [],
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
        officeType: member.officeType || '',
        aadharNumber: member.aadharNumber || '',
        panNumber: member.panNumber || '',
        selectedUsers: member.selectedUsers || [],
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
    if (!formData.officeType.trim()) errors.push('Office Type is required');
    if (!formData.aadharNumber.trim()) errors.push('Aadhar Number is required');
    if (!formData.panNumber.trim()) errors.push('PAN Number is required');
    
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
    
    // Aadhar validation
    const aadharRegex = /^\d{12}$/;
    if (formData.aadharNumber && !aadharRegex.test(formData.aadharNumber)) {
      errors.push('Aadhar number must be exactly 12 digits');
    }
    
    // PAN validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (formData.panNumber && !panRegex.test(formData.panNumber)) {
      errors.push('PAN number must be in format: ABCDE1234F');
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
    setCurrentPage(1); // Reset to first page when search changes
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
              <RBACHeader
                title={`Members (${filteredMembers.length})`}
                subtitle="Manage user members and their roles"
              />

              {/* Advanced Search Section */}
              <RBACControls
                searchQuery={searchQuery}
                onSearchChange={(value) => {
                  setSearchQuery(value);
                  setCurrentPage(1); // Reset to first page when search changes
                  if (value.length > 0) {
                    setShowSearchPopover(true);
                  } else {
                    setShowSearchPopover(false);
                  }
                }}
                searchPlaceholder="Search members by name, email, phone, district, role, or status..."
                onAddNew={handleAddMember}
                addButtonText="Add Member"
              />
                
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

              {/* Members Table */}
              <ScrollableTableContainer cardClassName="members-table-card">
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
                      {currentMembers.map((member, index) => (
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
              </ScrollableTableContainer>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
              />
              
              {/* Bottom spacing for pagination visibility */}
              <div style={{ height: '3rem' }}></div>
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
          <IonToolbar style={{ '--background': '#4ecdc4', '--color': 'white' }}>
            <IonTitle>Add Member</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)} style={{ '--color': 'white' }}>
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
                  Enter member's name *
                </IonLabel>
                <IonInput
                  value={formData.name}
                  onIonInput={(e) => setFormData({...formData, name: e.detail.value!})}
                  placeholder="Enter member's name"
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
              
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Enter email address's *
                </IonLabel>
                <IonInput
                  type="email"
                  value={formData.email}
                  onIonInput={(e) => setFormData({...formData, email: e.detail.value!})}
                  placeholder="Enter email address"
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
              
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Enter phone number *
                </IonLabel>
                <IonInput
                  type="tel"
                  value={formData.phone}
                  onIonInput={(e) => setFormData({...formData, phone: e.detail.value!})}
                  placeholder="Enter phone number"
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
              
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Select Office Type *
                </IonLabel>
                <div style={{ position: 'relative' }} ref={officeTypeDropdownRef}>
                  <IonInput
                    value={formData.officeType || ''}
                    placeholder="Select Office Type"
                    readonly
                    onClick={() => setShowOfficeTypeDropdown(!showOfficeTypeDropdown)}
                    style={{ 
                      '--background': '#e8e8e8',
                      '--border-radius': '12px',
                      '--padding-start': '16px',
                      '--padding-end': '16px',
                      '--padding-top': '12px',
                      '--padding-bottom': '12px',
                      '--color': '#333',
                      '--placeholder-color': '#666',
                      cursor: 'pointer'
                    }}
                  />
                  {showOfficeTypeDropdown && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        maxHeight: '300px',
                        overflow: 'hidden'
                      }}>
                      <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                        <IonInput
                          value={officeTypeSearchQuery}
                          onIonChange={(e) => setOfficeTypeSearchQuery(e.detail.value!)}
                          placeholder="Search office types..."
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
                      <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {filteredOfficeTypeOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, officeType: option.value }));
                              setShowOfficeTypeDropdown(false);
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: formData.officeType === option.value ? '#2196f3' : 'white',
                              color: formData.officeType === option.value ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (formData.officeType !== option.value) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (formData.officeType !== option.value) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: formData.officeType === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: formData.officeType === option.value ? 'white' : '#00C851', 
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
                  Enter aadhar number *
                </IonLabel>
                <IonInput
                  value={formData.aadharNumber}
                  onIonInput={(e) => setFormData({...formData, aadharNumber: e.detail.value!})}
                  placeholder="Enter aadhar number"
                  maxlength={12}
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
              
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Enter PAN number *
                </IonLabel>
                <IonInput
                  value={formData.panNumber}
                  onIonInput={(e) => setFormData({...formData, panNumber: e.detail.value!})}
                  placeholder="Enter PAN number"
                  maxlength={10}
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
              
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Select users
                </IonLabel>
                <div style={{ position: 'relative' }} ref={usersDropdownRef}>
                  <div
                    onClick={() => setShowUsersDropdown(!showUsersDropdown)}
                    style={{
                      minHeight: '48px',
                      padding: '12px 16px',
                      backgroundColor: '#e8e8e8',
                      borderRadius: '12px',
                      border: '1px solid #e0e0e0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    {formData.selectedUsers.length > 0 ? (
                      formData.selectedUsers.map((user, index) => (
                        <IonChip key={index} color="primary" style={{ margin: '2px' }}>
                          <IonLabel>{user}</IonLabel>
                          <IonIcon 
                            icon={closeOutlineIcon} 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeUser(user);
                            }}
                            style={{ cursor: 'pointer', marginLeft: '4px' }}
                          />
                        </IonChip>
                      ))
                    ) : (
                      <span style={{ color: '#666', fontSize: '14px' }}>Select users</span>
                    )}
                  </div>
                  {showUsersDropdown && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        maxHeight: '300px',
                        overflow: 'hidden'
                      }}>
                      <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                        <IonInput
                          value={usersSearchQuery}
                          onIonChange={(e) => setUsersSearchQuery(e.detail.value!)}
                          placeholder="Search users..."
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
                      <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {filteredUsersOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => toggleUser(option.value)}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: formData.selectedUsers.includes(option.value) ? '#2196f3' : 'white',
                              color: formData.selectedUsers.includes(option.value) ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (!formData.selectedUsers.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!formData.selectedUsers.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: formData.selectedUsers.includes(option.value) ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: formData.selectedUsers.includes(option.value) ? 'white' : '#00C851', 
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
                onClick={() => setShowAddModal(false)}
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
                onClick={handleSaveMember}
                style={{
                  '--background': '#4ecdc4',
                  '--color': 'white',
                  '--border-radius': '8px',
                  '--padding-start': '1.5rem',
                  '--padding-end': '1.5rem'
                }}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                SAVE CHANGES
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Member Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar style={{ '--background': '#4ecdc4', '--color': 'white' }}>
            <IonTitle>Edit Member</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)} style={{ '--color': 'white' }}>
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
                  Enter member's name *
                </IonLabel>
                <IonInput
                  value={formData.name}
                  onIonInput={(e) => setFormData({...formData, name: e.detail.value!})}
                  placeholder="Enter member's name"
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
              
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Enter email address's *
                </IonLabel>
                <IonInput
                  type="email"
                  value={formData.email}
                  onIonInput={(e) => setFormData({...formData, email: e.detail.value!})}
                  placeholder="Enter email address"
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
              
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Enter phone number *
                </IonLabel>
                <IonInput
                  type="tel"
                  value={formData.phone}
                  onIonInput={(e) => setFormData({...formData, phone: e.detail.value!})}
                  placeholder="Enter phone number"
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
              
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Select Office Type *
                </IonLabel>
                <div style={{ position: 'relative' }} ref={officeTypeDropdownRef}>
                  <IonInput
                    value={formData.officeType || ''}
                    placeholder="Select Office Type"
                    readonly
                    onClick={() => setShowOfficeTypeDropdown(!showOfficeTypeDropdown)}
                    style={{ 
                      '--background': '#e8e8e8',
                      '--border-radius': '12px',
                      '--padding-start': '16px',
                      '--padding-end': '16px',
                      '--padding-top': '12px',
                      '--padding-bottom': '12px',
                      '--color': '#333',
                      '--placeholder-color': '#666',
                      cursor: 'pointer'
                    }}
                  />
                  {showOfficeTypeDropdown && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        maxHeight: '300px',
                        overflow: 'hidden'
                      }}>
                      <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                        <IonInput
                          value={officeTypeSearchQuery}
                          onIonChange={(e) => setOfficeTypeSearchQuery(e.detail.value!)}
                          placeholder="Search office types..."
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
                      <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {filteredOfficeTypeOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, officeType: option.value }));
                              setShowOfficeTypeDropdown(false);
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: formData.officeType === option.value ? '#2196f3' : 'white',
                              color: formData.officeType === option.value ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (formData.officeType !== option.value) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (formData.officeType !== option.value) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: formData.officeType === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: formData.officeType === option.value ? 'white' : '#00C851', 
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
                  Enter aadhar number *
                </IonLabel>
                <IonInput
                  value={formData.aadharNumber}
                  onIonInput={(e) => setFormData({...formData, aadharNumber: e.detail.value!})}
                  placeholder="Enter aadhar number"
                  maxlength={12}
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
              
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Enter PAN number *
                </IonLabel>
                <IonInput
                  value={formData.panNumber}
                  onIonInput={(e) => setFormData({...formData, panNumber: e.detail.value!})}
                  placeholder="Enter PAN number"
                  maxlength={10}
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
              
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Select users
                </IonLabel>
                <div style={{ position: 'relative' }} ref={usersDropdownRef}>
                  <div
                    onClick={() => setShowUsersDropdown(!showUsersDropdown)}
                    style={{
                      minHeight: '48px',
                      padding: '12px 16px',
                      backgroundColor: '#e8e8e8',
                      borderRadius: '12px',
                      border: '1px solid #e0e0e0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    {formData.selectedUsers.length > 0 ? (
                      formData.selectedUsers.map((user, index) => (
                        <IonChip key={index} color="primary" style={{ margin: '2px' }}>
                          <IonLabel>{user}</IonLabel>
                          <IonIcon 
                            icon={closeOutlineIcon} 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeUser(user);
                            }}
                            style={{ cursor: 'pointer', marginLeft: '4px' }}
                          />
                        </IonChip>
                      ))
                    ) : (
                      <span style={{ color: '#666', fontSize: '14px' }}>Select users</span>
                    )}
                  </div>
                  {showUsersDropdown && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        maxHeight: '300px',
                        overflow: 'hidden'
                      }}>
                      <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                        <IonInput
                          value={usersSearchQuery}
                          onIonChange={(e) => setUsersSearchQuery(e.detail.value!)}
                          placeholder="Search users..."
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
                      <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {filteredUsersOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => toggleUser(option.value)}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: formData.selectedUsers.includes(option.value) ? '#2196f3' : 'white',
                              color: formData.selectedUsers.includes(option.value) ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (!formData.selectedUsers.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!formData.selectedUsers.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: formData.selectedUsers.includes(option.value) ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: formData.selectedUsers.includes(option.value) ? 'white' : '#00C851', 
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
                onClick={() => setShowEditModal(false)}
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
                onClick={handleSaveMember}
                style={{
                  '--background': '#4ecdc4',
                  '--color': 'white',
                  '--border-radius': '8px',
                  '--padding-start': '1.5rem',
                  '--padding-end': '1.5rem'
                }}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                SAVE CHANGES
              </IonButton>
            </div>
          </div>
        </IonContent>
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
