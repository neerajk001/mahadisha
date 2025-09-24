import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonAlert, IonToast, IonSearchbar,
  IonModal, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonChip, IonBadge, IonButtons
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  filterOutline
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

  // Form state
  const [formData, setFormData] = useState<PincodeMappingFormData>({
    district: '',
    pincodes: [],
    state: '',
    region: '',
    description: ''
  });

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
  const [pincodeInput, setPincodeInput] = useState('');

  const itemsPerPage = 5;

  // State for managing mappings data
  const [allMappings, setAllMappings] = useState<PincodeMappingData[]>(mockDataService.getPincodeMappingData());
  
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

  // Add pincode to form
  const addPincode = () => {
    const validation = validatePincode(pincodeInput);
    
    if (validation.isValid) {
      const pincode = pincodeInput.trim();
      if (!formData.pincodes.includes(pincode)) {
        setFormData(prev => ({
          ...prev,
          pincodes: [...prev.pincodes, pincode]
        }));
        setPincodeInput('');
        setValidationErrors([]);
      } else {
        setValidationErrors(['Pincode already exists in the list']);
      }
    } else {
      setValidationErrors(validation.errors);
    }
  };

  // Remove pincode from form
  const removePincode = (pincodeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      pincodes: prev.pincodes.filter(pincode => pincode !== pincodeToRemove)
    }));
  };

  // Add pincode range
  const addPincodeRange = (start: string, end: string) => {
    const startNum = parseInt(start);
    const endNum = parseInt(end);
    const newPincodes: string[] = [];
    
    for (let i = startNum; i <= endNum; i++) {
      const pincode = i.toString().padStart(6, '0');
      if (validatePincode(pincode).isValid && !formData.pincodes.includes(pincode)) {
        newPincodes.push(pincode);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      pincodes: [...prev.pincodes, ...newPincodes]
    }));
  };

  // Handle form submission
  const handleSaveMapping = () => {
    const errors: string[] = [];
    
    if (!formData.district.trim()) errors.push('District is required');
    if (!formData.state.trim()) errors.push('State is required');
    if (!formData.region.trim()) errors.push('Region is required');
    if (formData.pincodes.length === 0) errors.push('At least one pincode is required');
    
    // Check for duplicate district
    const existingMapping = allMappings.find(mapping => 
      mapping.district.toLowerCase() === formData.district.toLowerCase() && 
      mapping.id !== editingMapping?.id
    );
    if (existingMapping) {
      errors.push('District already exists');
    }
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Update mappings state
    if (editingMapping) {
      // Update existing mapping
      setAllMappings(prevMappings => 
        prevMappings.map(mapping => 
          mapping.id === editingMapping.id 
            ? {
                ...mapping,
                district: formData.district,
                pincodes: formData.pincodes,
                state: formData.state,
                region: formData.region,
                description: formData.description,
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : mapping
        )
      );
      setToastMessage('Mapping updated successfully');
    } else {
      // Add new mapping
      const newMapping: PincodeMappingData = {
        id: Date.now().toString(),
        district: formData.district,
        pincodes: formData.pincodes,
        state: formData.state,
        region: formData.region,
        description: formData.description,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setAllMappings(prevMappings => [...prevMappings, newMapping]);
      setToastMessage('Mapping added successfully');
    }
    
    setShowToast(true);
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingMapping(null);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      district: '',
      pincodes: [],
      state: '',
      region: '',
      description: ''
    });
    setPincodeInput('');
    setValidationErrors([]);
  };

  // Handle add mapping
  const handleAddMapping = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Handle edit mapping
  const handleEdit = (mapping: PincodeMappingData) => {
    setEditingMapping(mapping);
    setFormData({
      district: mapping.district,
      pincodes: [...mapping.pincodes],
      state: mapping.state || '',
      region: mapping.region || '',
      description: mapping.description || ''
    });
    setShowEditModal(true);
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
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Pincode Mapping</IonTitle>
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
              <h3>Basic Information</h3>
              <IonItem>
                <IonLabel position="stacked">District *</IonLabel>
                <IonInput
                  value={formData.district}
                  onIonChange={(e) => setFormData(prev => ({ ...prev, district: e.detail.value! }))}
                  placeholder="Enter district name"
                />
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">State *</IonLabel>
                <IonSelect
                  value={formData.state}
                  onIonChange={(e) => setFormData(prev => ({ ...prev, state: e.detail.value }))}
                  placeholder="Select state"
                >
                  {uniqueStates.map(state => (
                    <IonSelectOption key={state} value={state}>{state}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Region *</IonLabel>
                <IonSelect
                  value={formData.region}
                  onIonChange={(e) => setFormData(prev => ({ ...prev, region: e.detail.value }))}
                  placeholder="Select region"
                >
                  {uniqueRegions.map(region => (
                    <IonSelectOption key={region} value={region}>{region}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Description</IonLabel>
                <IonTextarea
                  value={formData.description}
                  onIonChange={(e) => setFormData(prev => ({ ...prev, description: e.detail.value! }))}
                  placeholder="Enter description (optional)"
                  rows={3}
                />
              </IonItem>
            </div>

            <div className="form-section">
              <h3>Pincode Management</h3>
              
              <div className="pincode-input-section">
                <IonItem>
                  <IonLabel position="stacked">Add Pincode *</IonLabel>
                  <IonInput
                    value={pincodeInput}
                    onIonChange={(e) => setPincodeInput(e.detail.value!)}
                    placeholder="Enter 6-digit pincode"
                    maxlength={6}
                  />
                </IonItem>
                <IonButton 
                  fill="outline" 
                  onClick={addPincode}
                  disabled={!pincodeInput.trim()}
                >
                  <IonIcon icon={addOutline} />
                  Add
                </IonButton>
              </div>

              {validationErrors.length > 0 && (
                <div className="validation-errors">
                  {validationErrors.map((error, index) => (
                    <IonChip key={index} color="danger">
                      <IonLabel>{error}</IonLabel>
                    </IonChip>
                  ))}
                </div>
              )}

              <div className="pincode-range-section">
                <h4>Add Pincode Range</h4>
                <div className="range-inputs">
                  <IonItem>
                    <IonLabel position="stacked">Start Pincode</IonLabel>
                    <IonInput
                      placeholder="e.g., 413510"
                      maxlength={6}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">End Pincode</IonLabel>
                    <IonInput
                      placeholder="e.g., 413530"
                      maxlength={6}
                    />
                  </IonItem>
                  <IonButton fill="outline">
                    <IonIcon icon={addOutline} />
                    Add Range
                  </IonButton>
                </div>
              </div>

              <div className="pincodes-list-section">
                <h4>Added Pincodes ({formData.pincodes.length})</h4>
                <div className="pincodes-chips">
                  {formData.pincodes.map((pincode, index) => (
                    <IonChip key={index} color="primary">
                      <IonLabel>{pincode}</IonLabel>
                      <IonIcon 
                        icon={closeOutline} 
                        onClick={() => removePincode(pincode)}
                        className="remove-chip-icon"
                      />
                    </IonChip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </IonContent>
        <div className="modal-actions">
          <IonButton 
            fill="outline" 
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </IonButton>
          <IonButton 
            fill="solid" 
            onClick={handleSaveMapping}
            disabled={formData.pincodes.length === 0}
          >
            <IonIcon icon={checkmarkOutline} />
            Save Mapping
          </IonButton>
        </div>
      </IonModal>

      {/* Edit Mapping Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Pincode Mapping</IonTitle>
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
              <h3>Basic Information</h3>
              <IonItem>
                <IonLabel position="stacked">District *</IonLabel>
                <IonInput
                  value={formData.district}
                  onIonChange={(e) => setFormData(prev => ({ ...prev, district: e.detail.value! }))}
                  placeholder="Enter district name"
                />
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">State *</IonLabel>
                <IonSelect
                  value={formData.state}
                  onIonChange={(e) => setFormData(prev => ({ ...prev, state: e.detail.value }))}
                  placeholder="Select state"
                >
                  {uniqueStates.map(state => (
                    <IonSelectOption key={state} value={state}>{state}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Region *</IonLabel>
                <IonSelect
                  value={formData.region}
                  onIonChange={(e) => setFormData(prev => ({ ...prev, region: e.detail.value }))}
                  placeholder="Select region"
                >
                  {uniqueRegions.map(region => (
                    <IonSelectOption key={region} value={region}>{region}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Description</IonLabel>
                <IonTextarea
                  value={formData.description}
                  onIonChange={(e) => setFormData(prev => ({ ...prev, description: e.detail.value! }))}
                  placeholder="Enter description (optional)"
                  rows={3}
                />
              </IonItem>
            </div>

            <div className="form-section">
              <h3>Pincode Management</h3>
              
              <div className="pincode-input-section">
                <IonItem>
                  <IonLabel position="stacked">Add Pincode *</IonLabel>
                  <IonInput
                    value={pincodeInput}
                    onIonChange={(e) => setPincodeInput(e.detail.value!)}
                    placeholder="Enter 6-digit pincode"
                    maxlength={6}
                  />
                </IonItem>
                <IonButton 
                  fill="outline" 
                  onClick={addPincode}
                  disabled={!pincodeInput.trim()}
                >
                  <IonIcon icon={addOutline} />
                  Add
                </IonButton>
              </div>

              {validationErrors.length > 0 && (
                <div className="validation-errors">
                  {validationErrors.map((error, index) => (
                    <IonChip key={index} color="danger">
                      <IonLabel>{error}</IonLabel>
                    </IonChip>
                  ))}
                </div>
              )}

              <div className="pincodes-list-section">
                <h4>Current Pincodes ({formData.pincodes.length})</h4>
                <div className="pincodes-chips">
                  {formData.pincodes.map((pincode, index) => (
                    <IonChip key={index} color="primary">
                      <IonLabel>{pincode}</IonLabel>
                      <IonIcon 
                        icon={closeOutline} 
                        onClick={() => removePincode(pincode)}
                        className="remove-chip-icon"
                      />
                    </IonChip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </IonContent>
        <div className="modal-actions">
          <IonButton 
            fill="outline" 
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </IonButton>
          <IonButton 
            fill="solid" 
            onClick={handleSaveMapping}
            disabled={formData.pincodes.length === 0}
          >
            <IonIcon icon={checkmarkOutline} />
            Update Mapping
          </IonButton>
        </div>
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
