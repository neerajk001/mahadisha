import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonButtons, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonAlert, IonToast, IonSearchbar,
  IonModal, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonChip, IonBadge
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  filterOutline, checkmark, closeOutline as closeOutlineIcon
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import ActionDropdown from '../admin/components/common/ActionDropdown';
import { Pagination } from '../admin/components/shared';
import { RBACControls, RBACHeader, ScrollableTableContainer } from '../components/shared';
import { mockDataService } from '../services/api';
import type { 
  PincodeMappingData, 
  PincodeMappingFormData, 
  PincodeValidation, 
  PincodeFilters
} from '../types';
import './PincodeMapping.css';

const PincodeMapping: React.FC = () => {
  // Basic state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Enhanced state for new features
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [editingMapping, setEditingMapping] = useState<PincodeMappingData | null>(null);

  // Form state - simplified to only district and pincodes array
  const [addForm, setAddForm] = useState({
    district: '',
    pincodes: [] as string[]
  });
  const [editForm, setEditForm] = useState({
    district: '',
    pincodes: [] as string[]
  });
  
  // Pincode input state
  const [pincodeInput, setPincodeInput] = useState('');
  const [editPincodeInput, setEditPincodeInput] = useState('');

  // Dropdown states for District
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [districtSearchQuery, setDistrictSearchQuery] = useState('');
  const [showEditDistrictDropdown, setShowEditDistrictDropdown] = useState(false);
  const [editDistrictSearchQuery, setEditDistrictSearchQuery] = useState('');
  
  // Refs for click outside detection
  const districtDropdownRef = useRef<HTMLDivElement>(null);
  const editDistrictDropdownRef = useRef<HTMLDivElement>(null);

  // Filters state
  const [filters, setFilters] = useState<PincodeFilters>({
    state: '',
    region: '',
    pincodeRange: { start: '', end: '' },
    districtType: '',
    pincodeCount: { min: 0, max: 1000 }
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const itemsPerPage = 5;

  // State for managing mappings data
  const [allMappings, setAllMappings] = useState<PincodeMappingData[]>(mockDataService.getPincodeMappingData());
  
  // District options from BranchMapping
  const districtOptions = [
    { value: "Gadchiroli", label: "Gadchiroli", hasCheckmark: true },
    { value: "Jalgaon", label: "Jalgaon", hasCheckmark: true },
    { value: "Nagpur", label: "Nagpur", hasCheckmark: true },
    { value: "Dharashiv", label: "Dharashiv", hasCheckmark: true },
    { value: "Nanded", label: "Nanded", hasCheckmark: true },
    { value: "Amrut Nagar", label: "Amrut Nagar", hasCheckmark: true },
    { value: "Ratnagiri", label: "Ratnagiri", hasCheckmark: true },
    { value: "Jalna", label: "Jalna", hasCheckmark: true },
    { value: "Yavatmal", label: "Yavatmal", hasCheckmark: true },
    { value: "Kolhapur", label: "Kolhapur", hasCheckmark: true },
    { value: "Nandurbar", label: "Nandurbar", hasCheckmark: true },
    { value: "Pune", label: "Pune", hasCheckmark: true },
    { value: "Nashik", label: "Nashik", hasCheckmark: true },
    { value: "Sindhudurg", label: "Sindhudurg", hasCheckmark: true },
    { value: "Raigad", label: "Raigad", hasCheckmark: true },
    { value: "Hingoli", label: "Hingoli", hasCheckmark: true },
    { value: "Beed", label: "Beed", hasCheckmark: true },
    { value: "Akola", label: "Akola", hasCheckmark: true },
    { value: "Gondia", label: "Gondia", hasCheckmark: true },
    { value: "Solapur", label: "Solapur", hasCheckmark: true },
    { value: "Dhule", label: "Dhule", hasCheckmark: true },
    { value: "Latur", label: "Latur", hasCheckmark: true },
    { value: "Sangli", label: "Sangli", hasCheckmark: true },
    { value: "Bhandara", label: "Bhandara", hasCheckmark: true },
    { value: "Chandrapur", label: "Chandrapur", hasCheckmark: true },
    { value: "Wardha", label: "Wardha", hasCheckmark: true },
    { value: "Satara", label: "Satara", hasCheckmark: true },
    { value: "Amravati", label: "Amravati", hasCheckmark: true },
    { value: "Mumbai Suburban", label: "Mumbai Suburban", hasCheckmark: true },
    { value: "Parbhani", label: "Parbhani", hasCheckmark: true },
    { value: "Mumbai City", label: "Mumbai City", hasCheckmark: true },
    { value: "Palghar", label: "Palghar", hasCheckmark: true },
    { value: "Aurangabad (Chh. Sambhaji Nagar)", label: "Aurangabad (Chh. Sambhaji Nagar)", hasCheckmark: true },
    { value: "Buldhana", label: "Buldhana", hasCheckmark: true },
    { value: "Washim", label: "Washim", hasCheckmark: true },
    { value: "Ahilyanagar", label: "Ahilyanagar", hasCheckmark: true }
  ];

  // Filter district options based on search query
  const filteredDistrictOptions = districtOptions.filter(option =>
    option.label.toLowerCase().includes(districtSearchQuery.toLowerCase())
  );
  const filteredEditDistrictOptions = districtOptions.filter(option =>
    option.label.toLowerCase().includes(editDistrictSearchQuery.toLowerCase())
  );

  // Click outside detection for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDistrictDropdown && districtDropdownRef.current && !districtDropdownRef.current.contains(event.target as Node)) {
        setShowDistrictDropdown(false);
        setDistrictSearchQuery('');
      }
      if (showEditDistrictDropdown && editDistrictDropdownRef.current && !editDistrictDropdownRef.current.contains(event.target as Node)) {
        setShowEditDistrictDropdown(false);
        setEditDistrictSearchQuery('');
      }
    };

    if (showDistrictDropdown || showEditDistrictDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDistrictDropdown, showEditDistrictDropdown]);

  // Add pincode to form
  const addPincode = () => {
    const pincode = pincodeInput.trim();
    if (pincode && /^\d{6}$/.test(pincode) && !addForm.pincodes.includes(pincode)) {
      setAddForm(prev => ({
        ...prev,
        pincodes: [...prev.pincodes, pincode]
      }));
      setPincodeInput('');
    }
  };

  const addEditPincode = () => {
    const pincode = editPincodeInput.trim();
    if (pincode && /^\d{6}$/.test(pincode) && !editForm.pincodes.includes(pincode)) {
      setEditForm(prev => ({
        ...prev,
        pincodes: [...prev.pincodes, pincode]
      }));
      setEditPincodeInput('');
    }
  };

  // Remove pincode from form
  const removePincode = (pincodeToRemove: string) => {
    setAddForm(prev => ({
      ...prev,
      pincodes: prev.pincodes.filter(pincode => pincode !== pincodeToRemove)
    }));
  };

  const removeEditPincode = (pincodeToRemove: string) => {
    setEditForm(prev => ({
      ...prev,
      pincodes: prev.pincodes.filter(pincode => pincode !== pincodeToRemove)
    }));
  };

  // Handle Enter key press
  const handlePincodeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPincode();
    }
  };

  const handleEditPincodeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEditPincode();
    }
  };

  // Enhanced filtering with multiple criteria
  const filteredMappings = useMemo(() => {
    let filtered = allMappings;

    // Basic search
    if (searchQuery) {
      filtered = filtered.filter(mapping =>
        mapping.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mapping.pincodes.some(pincode => pincode.includes(searchQuery)) ||
        (mapping.state && mapping.state.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (mapping.region && mapping.region.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Advanced filters
    if (filters.state) {
      filtered = filtered.filter(mapping => mapping.state === filters.state);
    }
    if (filters.region) {
      filtered = filtered.filter(mapping => mapping.region === filters.region);
    }
    if (filters.pincodeRange.start || filters.pincodeRange.end) {
      filtered = filtered.filter(mapping => {
        const hasPincodeInRange = mapping.pincodes.some(pincode => {
          const pincodeNum = parseInt(pincode);
          const start = filters.pincodeRange.start ? parseInt(filters.pincodeRange.start) : 0;
          const end = filters.pincodeRange.end ? parseInt(filters.pincodeRange.end) : 999999;
          return pincodeNum >= start && pincodeNum <= end;
        });
        return hasPincodeInRange;
      });
    }
    if (filters.pincodeCount.min > 0 || filters.pincodeCount.max < 1000) {
      filtered = filtered.filter(mapping => {
        const count = mapping.pincodes.length;
        return count >= filters.pincodeCount.min && count <= filters.pincodeCount.max;
      });
    }

    return filtered;
  }, [allMappings, searchQuery, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredMappings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMappings = filteredMappings.slice(startIndex, endIndex);

  // Pincode validation function
  const validatePincode = (pincode: string): PincodeValidation => {
    const errors: string[] = [];
    
    if (!pincode.trim()) {
      errors.push('Pincode cannot be empty');
    } else if (!/^\d{6}$/.test(pincode.trim())) {
      errors.push('Pincode must be exactly 6 digits');
    } else if (pincode.startsWith('0')) {
      errors.push('Pincode cannot start with 0');
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions: errors.length > 0 ? getPincodeSuggestions(pincode) : []
    };
  };

  // Get pincode suggestions for invalid pincodes
  const getPincodeSuggestions = (pincode: string): string[] => {
    const suggestions: string[] = [];
    
    if (pincode.length < 6) {
      // Suggest pincodes that start with the same digits
      const prefix = pincode;
      const matchingPincodes = allMappings
        .flatMap(mapping => mapping.pincodes)
        .filter(p => p.startsWith(prefix))
        .slice(0, 5);
      suggestions.push(...matchingPincodes);
    }
    
    return suggestions;
  };


  // Handle form submission
  const handleSaveAdd = () => {
    const errors: string[] = [];
    
    if (!addForm.district.trim()) errors.push('District is required');
    if (addForm.pincodes.length === 0) errors.push('At least one pincode is required');
    
    if (errors.length > 0) {
      setToastMessage(errors.join(', '));
      setShowToast(true);
      return;
    }
    
    // Add new mapping
    const newMapping: PincodeMappingData = {
      id: Date.now().toString(),
      district: addForm.district,
      pincodes: addForm.pincodes,
      state: '',
      region: '',
      description: '',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setAllMappings(prevMappings => [...prevMappings, newMapping]);
    setToastMessage('Pincode mapping added successfully');
    setShowToast(true);
    setShowAddModal(false);
    setAddForm({ district: '', pincodes: [] });
    setPincodeInput('');
  };

  const handleSaveEdit = () => {
    const errors: string[] = [];
    
    if (!editForm.district.trim()) errors.push('District is required');
    if (editForm.pincodes.length === 0) errors.push('At least one pincode is required');
    
    if (errors.length > 0) {
      setToastMessage(errors.join(', '));
      setShowToast(true);
      return;
    }
    
    // Update existing mapping
    if (editingMapping) {
      setAllMappings(prevMappings => 
        prevMappings.map(mapping => 
          mapping.id === editingMapping.id 
            ? {
                ...mapping,
                district: editForm.district,
                pincodes: editForm.pincodes,
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : mapping
        )
      );
      setToastMessage('Pincode mapping updated successfully');
      setShowToast(true);
      setShowEditModal(false);
      setEditingMapping(null);
      setEditForm({ district: '', pincodes: [] });
      setEditPincodeInput('');
    }
  };

  // Handle add mapping
  const handleAddMapping = () => {
    setAddForm({ district: '', pincodes: [] });
    setPincodeInput('');
    setShowAddModal(true);
  };

  // Handle edit mapping
  const handleEdit = (mapping: PincodeMappingData) => {
    setEditingMapping(mapping);
    setEditForm({
      district: mapping.district,
      pincodes: [...mapping.pincodes]
    });
    setEditPincodeInput('');
    setShowEditModal(true);
  };

  // Handle close modals
  const handleCloseAdd = () => {
    setShowAddModal(false);
    setAddForm({ district: '', pincodes: [] });
    setPincodeInput('');
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingMapping(null);
    setEditForm({ district: '', pincodes: [] });
    setEditPincodeInput('');
  };

  // Handle delete
  const handleDelete = (mappingId: string) => {
    setSelectedMappingId(mappingId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedMappingId) {
      setAllMappings(prevMappings => 
        prevMappings.filter(mapping => mapping.id !== selectedMappingId)
      );
      setToastMessage(`Pincode mapping deleted successfully`);
      setShowToast(true);
      setSelectedMappingId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedMappingId(null);
    setShowDeleteAlert(false);
  };


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

  // Render pincodes with better formatting
  const renderPincodes = (pincodes: string[]) => {
    if (pincodes.length <= 5) {
      return pincodes.map((pincode, index) => (
        <span key={index} className="pincode-item">
          {pincode}
          {index < pincodes.length - 1 && ', '}
        </span>
      ));
    } else {
      return (
        <span>
          {pincodes.slice(0, 3).map((pincode, index) => (
            <span key={index} className="pincode-item">
              {pincode}
              {index < 2 && ', '}
            </span>
          ))}
          <span className="pincode-more">... +{pincodes.length - 3} more</span>
        </span>
      );
    }
  };

  // Get unique states and regions for filters
  const uniqueStates = [...new Set(allMappings.map(m => m.state).filter(Boolean))];
  const uniqueRegions = [...new Set(allMappings.map(m => m.region).filter(Boolean))];

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="pincode-mapping-content">
            <div className="mappings-container">
              {/* Header Section */}
              <RBACHeader
                title="Pincode Mapping"
                subtitle="Manage district to pincode mapping with advanced features"
              />


              {/* Enhanced Actions Bar */}
              <RBACControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search by district, pincode, state, or region..."
                onAddNew={handleAddMapping}
                addButtonText="Add Mapping"
                showFilterButton={true}
                onFilterClick={() => setShowFiltersModal(true)}
              />

              {/* Enhanced Table */}
              <ScrollableTableContainer cardClassName="mappings-table-card">
                <table className="mappings-table">
                    <thead>
                      <tr>
                        <th>
                          <div className="table-header">
                            <span>District</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>State</span>
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Region</span>
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Pincodes ({allMappings.reduce((sum, mapping) => sum + mapping.pincodes.length, 0)})</span>
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
                          <td className="district-cell">
                            <div className="district-info">
                              <span className="district-name">{mapping.district}</span>
                              {mapping.description && (
                                <span className="district-description">{mapping.description}</span>
                              )}
                            </div>
                          </td>
                          <td className="state-cell">
                            <IonChip color="primary">
                              <IonLabel>{mapping.state || 'N/A'}</IonLabel>
                            </IonChip>
                          </td>
                          <td className="region-cell">
                            <IonChip color="secondary">
                              <IonLabel>{mapping.region || 'N/A'}</IonLabel>
                            </IonChip>
                          </td>
                          <td className="pincodes-cell">
                            <div className="pincodes-list">
                              {renderPincodes(mapping.pincodes)}
                            </div>
                            <div className="pincode-count">
                              <IonBadge color="medium">{mapping.pincodes.length} pincodes</IonBadge>
                            </div>
                          </td>
                          <td className="actions-cell">
                            <ActionDropdown
                              itemId={mapping.id}
                              onEdit={() => handleEdit(mapping)}
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
            </div>
          </IonContent>
        </div>
      </IonSplitPane>

      {/* Add Mapping Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={handleCloseAdd}>
        <IonHeader>
          <IonToolbar style={{ '--background': '#4ecdc4', '--color': 'white' }}>
            <IonTitle>Add Pincode Mapping</IonTitle>
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
                  District *
                </IonLabel>
                <div style={{ position: 'relative' }} ref={districtDropdownRef}>
                  <IonInput
                    value={addForm.district || ''}
                    placeholder="Select district"
                    readonly
                    onClick={() => setShowDistrictDropdown(!showDistrictDropdown)}
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
                  {showDistrictDropdown && (
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
                          value={districtSearchQuery}
                          onIonChange={(e) => setDistrictSearchQuery(e.detail.value!)}
                          placeholder="Search districts..."
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
                        {filteredDistrictOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setAddForm(prev => ({ ...prev, district: option.value }));
                              setShowDistrictDropdown(false);
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: addForm.district === option.value ? '#2196f3' : 'white',
                              color: addForm.district === option.value ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (addForm.district !== option.value) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (addForm.district !== option.value) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: addForm.district === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: addForm.district === option.value ? 'white' : '#00C851', 
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
                  Add Pincode *
                </IonLabel>
                <IonInput
                  value={pincodeInput}
                  onIonInput={(e) => setPincodeInput(e.detail.value!)}
                  onKeyPress={handlePincodeKeyPress}
                  placeholder="Enter 6-digit pincode and press Enter"
                  maxlength={6}
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
              
              {/* Display added pincodes */}
              {addForm.pincodes.length > 0 && (
                <div>
                  <IonLabel style={{ 
                    display: 'block', 
                    marginBottom: '0.75rem', 
                    fontWeight: '600', 
                    color: '#333',
                    fontSize: '1rem'
                  }}>
                    Added Pincodes ({addForm.pincodes.length})
                  </IonLabel>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.5rem',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0'
                  }}>
                    {addForm.pincodes.map((pincode, index) => (
                      <IonChip key={index} color="primary" style={{ margin: '2px' }}>
                        <IonLabel>{pincode}</IonLabel>
                        <IonIcon 
                          icon={closeOutlineIcon} 
                          onClick={() => removePincode(pincode)}
                          style={{ cursor: 'pointer', marginLeft: '4px' }}
                        />
                      </IonChip>
                    ))}
                  </div>
                </div>
              )}
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
                SAVE MAPPING
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Mapping Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={handleCloseEdit}>
        <IonHeader>
          <IonToolbar style={{ '--background': '#4ecdc4', '--color': 'white' }}>
            <IonTitle>Edit Pincode Mapping</IonTitle>
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
                  District *
                </IonLabel>
                <div style={{ position: 'relative' }} ref={editDistrictDropdownRef}>
                  <IonInput
                    value={editForm.district || ''}
                    placeholder="Select district"
                    readonly
                    onClick={() => setShowEditDistrictDropdown(!showEditDistrictDropdown)}
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
                  {showEditDistrictDropdown && (
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
                          value={editDistrictSearchQuery}
                          onIonChange={(e) => setEditDistrictSearchQuery(e.detail.value!)}
                          placeholder="Search districts..."
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
                        {filteredEditDistrictOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setEditForm(prev => ({ ...prev, district: option.value }));
                              setShowEditDistrictDropdown(false);
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: editForm.district === option.value ? '#2196f3' : 'white',
                              color: editForm.district === option.value ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (editForm.district !== option.value) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (editForm.district !== option.value) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: editForm.district === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: editForm.district === option.value ? 'white' : '#00C851', 
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
                  Add Pincode *
                </IonLabel>
                <IonInput
                  value={editPincodeInput}
                  onIonInput={(e) => setEditPincodeInput(e.detail.value!)}
                  onKeyPress={handleEditPincodeKeyPress}
                  placeholder="Enter 6-digit pincode and press Enter"
                  maxlength={6}
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
              
              {/* Display added pincodes */}
              {editForm.pincodes.length > 0 && (
                <div>
                  <IonLabel style={{ 
                    display: 'block', 
                    marginBottom: '0.75rem', 
                    fontWeight: '600', 
                    color: '#333',
                    fontSize: '1rem'
                  }}>
                    Added Pincodes ({editForm.pincodes.length})
                  </IonLabel>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.5rem',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0'
                  }}>
                    {editForm.pincodes.map((pincode, index) => (
                      <IonChip key={index} color="primary" style={{ margin: '2px' }}>
                        <IonLabel>{pincode}</IonLabel>
                        <IonIcon 
                          icon={closeOutlineIcon} 
                          onClick={() => removeEditPincode(pincode)}
                          style={{ cursor: 'pointer', marginLeft: '4px' }}
                        />
                      </IonChip>
                    ))}
                  </div>
                </div>
              )}
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
                UPDATE MAPPING
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>


      {/* Advanced Filters Modal */}
      <IonModal isOpen={showFiltersModal} onDidDismiss={() => setShowFiltersModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Advanced Filters</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowFiltersModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="modal-content">
          <div className="filters-container">
            <IonItem>
              <IonLabel position="stacked">State</IonLabel>
              <IonSelect
                value={filters.state}
                onIonChange={(e) => setFilters(prev => ({ ...prev, state: e.detail.value }))}
                placeholder="All States"
              >
                <IonSelectOption value="">All States</IonSelectOption>
                {uniqueStates.map(state => (
                  <IonSelectOption key={state} value={state}>{state}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Region</IonLabel>
              <IonSelect
                value={filters.region}
                onIonChange={(e) => setFilters(prev => ({ ...prev, region: e.detail.value }))}
                placeholder="All Regions"
              >
                <IonSelectOption value="">All Regions</IonSelectOption>
                {uniqueRegions.map(region => (
                  <IonSelectOption key={region} value={region}>{region}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <div className="range-filters">
              <h4>Pincode Range</h4>
              <IonItem>
                <IonLabel position="stacked">Start Pincode</IonLabel>
                <IonInput
                  value={filters.pincodeRange.start}
                  onIonChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    pincodeRange: { ...prev.pincodeRange, start: e.detail.value! }
                  }))}
                  placeholder="e.g., 400000"
                  maxlength={6}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">End Pincode</IonLabel>
                <IonInput
                  value={filters.pincodeRange.end}
                  onIonChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    pincodeRange: { ...prev.pincodeRange, end: e.detail.value! }
                  }))}
                  placeholder="e.g., 500000"
                  maxlength={6}
                />
              </IonItem>
            </div>

            <div className="count-filters">
              <h4>Pincode Count Range</h4>
              <IonItem>
                <IonLabel position="stacked">Minimum Count</IonLabel>
                <IonInput
                  type="number"
                  value={filters.pincodeCount.min}
                  onIonChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    pincodeCount: { ...prev.pincodeCount, min: parseInt(e.detail.value!) || 0 }
                  }))}
                  placeholder="0"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Maximum Count</IonLabel>
                <IonInput
                  type="number"
                  value={filters.pincodeCount.max}
                  onIonChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    pincodeCount: { ...prev.pincodeCount, max: parseInt(e.detail.value!) || 1000 }
                  }))}
                  placeholder="1000"
                />
              </IonItem>
            </div>
          </div>
        </IonContent>
        <div className="modal-actions">
          <IonButton 
            fill="outline" 
            onClick={() => {
              setFilters({
                state: '',
                region: '',
                pincodeRange: { start: '', end: '' },
                districtType: '',
                pincodeCount: { min: 0, max: 1000 }
              });
            }}
          >
            Clear Filters
          </IonButton>
          <IonButton 
            fill="solid" 
            onClick={() => setShowFiltersModal(false)}
          >
            Apply Filters
          </IonButton>
        </div>
      </IonModal>

      {/* Delete Confirmation Alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={cancelDelete}
        header="Confirm Delete"
        message="Are you sure you want to delete this pincode mapping? This action cannot be undone."
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

export default PincodeMapping;
