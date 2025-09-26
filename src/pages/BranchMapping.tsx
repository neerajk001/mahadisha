import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonButtons, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonInput, IonSelect, IonSelectOption, IonChip, IonLabel, IonItem, IonList, IonTextarea
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  eyeOutline, gridOutline, listOutline, locationOutline, documentTextOutline, timeOutline,
  checkmark, closeOutline as closeOutlineIcon
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import ActionDropdown from '../admin/components/common/ActionDropdown';
import { Pagination } from '../admin/components/shared';
import { MasterCard, MasterHeader, MasterControls, ScrollableTableContainer } from '../components/shared';
import '../components/shared/MasterCard.css';
import { mockDataService } from '../services/api';
import type { BranchMappingData } from '../types';
import './BranchMapping.css';

const BranchMapping: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Add Mapping Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingMapping, setViewingMapping] = useState<BranchMappingData | null>(null);
  const [editingMapping, setEditingMapping] = useState<BranchMappingData | null>(null);
  const [addForm, setAddForm] = useState({
    region: '',
    districts: [] as string[]
  });
  const [editForm, setEditForm] = useState({
    region: '',
    districts: [] as string[]
  });
  // Searchable dropdown states for Region
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showEditRegionDropdown, setShowEditRegionDropdown] = useState(false);
  // Searchable dropdown states for Districts
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [districtSearchQuery, setDistrictSearchQuery] = useState('');
  const [showEditDistrictDropdown, setShowEditDistrictDropdown] = useState(false);
  const [editDistrictSearchQuery, setEditDistrictSearchQuery] = useState('');
  
  // Refs for click outside detection
  const regionDropdownRef = useRef<HTMLDivElement>(null);
  const editRegionDropdownRef = useRef<HTMLDivElement>(null);
  const districtDropdownRef = useRef<HTMLDivElement>(null);
  const editDistrictDropdownRef = useRef<HTMLDivElement>(null);
  
  const itemsPerPage = 5;

  // State for managing branch mapping data - EXACTLY LIKE MANAGEPAGES
  const [allMappings, setAllMappings] = useState<BranchMappingData[]>(() => mockDataService.getBranchMappingData());
  
  // Filter mappings based on search query
  const filteredMappings = useMemo(() => {
    return allMappings.filter(mapping =>
      mapping.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.districts.some(district => district.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allMappings, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredMappings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMappings = filteredMappings.slice(startIndex, endIndex);

  // Region options from the images provided
  const regionOptions = [
    { value: "Nashik Region", label: "Nashik Region", hasCheckmark: true },
    { value: "Aurangabad (Chh.Sambhaji Nagar) Region", label: "Aurangabad (Chh.Sambhaji Nagar) Region", hasCheckmark: true },
    { value: "Nagpur Region", label: "Nagpur Region", hasCheckmark: true },
    { value: "Pune Region", label: "Pune Region", hasCheckmark: true },
    { value: "Ghatkopar Region", label: "Ghatkopar Region", hasCheckmark: true },
    { value: "Amravati Region", label: "Amravati Region", hasCheckmark: true },
    { value: "Mumbai Region", label: "Mumbai Region", hasCheckmark: true }
  ];

  // District options from the images provided
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
      if (showRegionDropdown && regionDropdownRef.current && !regionDropdownRef.current.contains(event.target as Node)) {
        setShowRegionDropdown(false);
      }
      if (showEditRegionDropdown && editRegionDropdownRef.current && !editRegionDropdownRef.current.contains(event.target as Node)) {
        setShowEditRegionDropdown(false);
      }
      if (showDistrictDropdown && districtDropdownRef.current && !districtDropdownRef.current.contains(event.target as Node)) {
        setShowDistrictDropdown(false);
        setDistrictSearchQuery('');
      }
      if (showEditDistrictDropdown && editDistrictDropdownRef.current && !editDistrictDropdownRef.current.contains(event.target as Node)) {
        setShowEditDistrictDropdown(false);
        setEditDistrictSearchQuery('');
      }
    };

    if (showRegionDropdown || showEditRegionDropdown || showDistrictDropdown || showEditDistrictDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRegionDropdown, showEditRegionDropdown, showDistrictDropdown, showEditDistrictDropdown]);

  const handleAddMapping = () => {
    setAddForm({
      region: '',
      districts: []
    });
    setShowAddModal(true);
  };

  const handleSaveAdd = () => {
    if (!addForm.region.trim()) {
      setToastMessage('Please enter a region name');
      setShowToast(true);
      return;
    }

    if (addForm.districts.length === 0) {
      setToastMessage('Please add at least one district');
      setShowToast(true);
      return;
    }

    // Check if region already exists
    if (allMappings.some(mapping => mapping.region.toLowerCase() === addForm.region.toLowerCase())) {
      setToastMessage('Region already exists. Please choose a different region name.');
      setShowToast(true);
      return;
    }

    const newMapping: BranchMappingData = {
      id: `mapping_${Date.now()}`,
      region: addForm.region.trim(),
      districts: addForm.districts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add the new mapping to the state - EXACTLY LIKE MANAGEPAGES
    setAllMappings(prevMappings => [...prevMappings, newMapping]);
    setToastMessage(`Branch mapping for "${addForm.region}" added successfully`);
    setShowToast(true);
    setShowAddModal(false);
  };

  const handleCloseAdd = () => {
    setShowAddModal(false);
    setAddForm({
      region: '',
      districts: []
    });
  };

  const handleEdit = (mappingId: string) => {
    const mapping = allMappings.find(m => m.id === mappingId);
    if (mapping) {
      setEditingMapping(mapping);
      setEditForm({
        region: mapping.region,
        districts: [...mapping.districts]
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (!editingMapping) return;

    if (!editForm.region.trim()) {
      setToastMessage('Please enter a region name');
      setShowToast(true);
      return;
    }

    if (editForm.districts.length === 0) {
      setToastMessage('Please add at least one district');
      setShowToast(true);
      return;
    }

    // Check if region already exists (excluding current mapping)
    if (allMappings.some(mapping => 
      mapping.id !== editingMapping.id && 
      mapping.region.toLowerCase() === editForm.region.toLowerCase()
    )) {
      setToastMessage('Region already exists. Please choose a different region name.');
      setShowToast(true);
      return;
    }

    // Update the mapping in the state - EXACTLY LIKE MANAGEPAGES
    setAllMappings(prevMappings => prevMappings.map(mapping => 
      mapping.id === editingMapping.id 
        ? { ...mapping, ...editForm, updatedAt: new Date().toISOString() }
        : mapping
    ));

    setToastMessage(`Branch mapping for "${editForm.region}" updated successfully`);
    setShowToast(true);
    setShowEditModal(false);
    setEditingMapping(null);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingMapping(null);
    setEditForm({
      region: '',
      districts: []
    });
  };

  const handleView = (mappingId: string) => {
    const mapping = allMappings.find(m => m.id === mappingId);
    if (mapping) {
      setViewingMapping(mapping);
      setShowViewModal(true);
    }
  };

  const handleCloseView = () => {
    setShowViewModal(false);
    setViewingMapping(null);
  };


  const handleDelete = (mappingId: string) => {
    setSelectedMappingId(mappingId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedMappingId) {
      // Actually remove the mapping from the state - EXACTLY LIKE MANAGEPAGES
      setAllMappings(prevMappings => prevMappings.filter(mapping => mapping.id !== selectedMappingId));
      setToastMessage('Branch mapping deleted successfully');
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

  const renderDistricts = (districts: string[]) => {
    if (districts.length === 0) return <span className="no-districts">No districts</span>;
    
    return (
      <div className="districts-chips">
        {districts.slice(0, 3).map((district, index) => (
          <IonChip key={index} className="district-chip-small">
            <IonLabel>{district}</IonLabel>
          </IonChip>
        ))}
        {districts.length > 3 && (
          <IonChip className="district-chip-small more-chip">
            <IonLabel>+{districts.length - 3} more</IonLabel>
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
          
          <IonContent className="branch-mapping-content">
            <div className="mappings-container">
              {/* Header Section */}
              <MasterHeader
                title="Branch Mapping"
                subtitle="Manage region to district mapping"
              />

              {/* Search and Actions */}
              <MasterControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search by region or district..."
                viewMode={viewMode}
                onViewModeToggle={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                onAddNew={handleAddMapping}
                addButtonText="+ ADD MAPPING"
              />

              {/* Mappings Grid */}
              {viewMode === 'grid' ? (
                <div className="master-cards-grid" style={{ padding: '1rem' }}>
                  {currentMappings.map((mapping) => (
                    <MasterCard
                      key={mapping.id}
                      id={mapping.id}
                      title={mapping.region}
                      subtitle="Branch Mapping"
                      icon={locationOutline}
                      metaItems={[
                        {
                          icon: documentTextOutline,
                          label: "Districts",
                          value: `${mapping.districts.length} districts`
                        },
                        {
                          icon: timeOutline,
                          label: "Created",
                          value: new Date(mapping.createdAt).toLocaleDateString()
                        }
                      ]}
                      onView={() => handleView(mapping.id)}
                      onEdit={() => handleEdit(mapping.id)}
                      onDelete={() => handleDelete(mapping.id)}
                    />
                  ))}
                </div>
              ) : (
                <ScrollableTableContainer cardClassName="mappings-table-card">
                  <table className="mappings-table">
                    <thead>
                      <tr>
                        <th>
                          <div className="table-header">
                            <span>Region</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Districts</span>
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
                      {currentMappings.map((mapping, index) => (
                        <tr key={mapping.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="region-cell">
                            <span className="region-name">{mapping.region}</span>
                          </td>
                          <td className="districts-cell">
                            <div className="districts-list">
                              {renderDistricts(mapping.districts)}
                            </div>
                          </td>
                          <td className="actions-cell">
                            <ActionDropdown
                              itemId={mapping.id}
                              onView={() => handleView(mapping.id)}
                              onEdit={() => handleEdit(mapping.id)}
                              onDelete={() => handleDelete(mapping.id)}
                              showView={true}
                              size="small"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollableTableContainer>
              )}

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

      {/* Delete Confirmation Alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={cancelDelete}
        header="Confirm Delete"
        message="Are you sure you want to delete this branch mapping? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Add Mapping Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={handleCloseAdd}>
        <IonHeader>
          <IonToolbar style={{ '--background': '#4ecdc4', '--color': 'white' }}>
            <IonTitle>Add Branch Mapping</IonTitle>
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
                  Region Name *
                </IonLabel>
                <div style={{ position: 'relative' }} ref={regionDropdownRef}>
                  <IonInput
                    value={addForm.region || ''}
                    placeholder="Select region"
                    readonly
                    onClick={() => setShowRegionDropdown(!showRegionDropdown)}
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
                  {showRegionDropdown && (
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
                      <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {regionOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setAddForm(prev => ({ ...prev, region: option.value }));
                              setShowRegionDropdown(false);
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: addForm.region === option.value ? '#2196f3' : 'white',
                              color: addForm.region === option.value ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (addForm.region !== option.value) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (addForm.region !== option.value) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: addForm.region === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: addForm.region === option.value ? 'white' : '#00C851', 
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
                  Districts *
                </IonLabel>
                <div style={{ position: 'relative' }} ref={districtDropdownRef}>
                  <div
                    onClick={() => setShowDistrictDropdown(!showDistrictDropdown)}
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
                    {addForm.districts.length === 0 ? (
                      <span style={{ color: '#666', fontSize: '14px' }}>Select districts</span>
                    ) : (
                      addForm.districts.map((district, index) => (
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
                          {district}
                          <IonIcon
                            icon={closeOutlineIcon}
                            style={{ fontSize: '14px', cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setAddForm(prev => ({
                                ...prev,
                                districts: prev.districts.filter(item => item !== district)
                              }));
                            }}
                          />
                        </span>
                      ))
                    )}
                  </div>
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
                              const isSelected = addForm.districts.includes(option.value);
                              let newDistricts;
                              if (isSelected) {
                                newDistricts = addForm.districts.filter(item => item !== option.value);
                              } else {
                                newDistricts = [...addForm.districts, option.value];
                              }
                              setAddForm(prev => ({ ...prev, districts: newDistricts }));
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: addForm.districts.includes(option.value) ? '#2196f3' : 'white',
                              color: addForm.districts.includes(option.value) ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (!addForm.districts.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!addForm.districts.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: addForm.districts.includes(option.value) ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: addForm.districts.includes(option.value) ? 'white' : '#00C851', 
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
            <IonTitle>Edit Branch Mapping</IonTitle>
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
                  Region Name *
                </IonLabel>
                <div style={{ position: 'relative' }} ref={editRegionDropdownRef}>
                  <IonInput
                    value={editForm.region || ''}
                    placeholder="Select region"
                    readonly
                    onClick={() => setShowEditRegionDropdown(!showEditRegionDropdown)}
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
                  {showEditRegionDropdown && (
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
                      <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {regionOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setEditForm(prev => ({ ...prev, region: option.value }));
                              setShowEditRegionDropdown(false);
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: editForm.region === option.value ? '#2196f3' : 'white',
                              color: editForm.region === option.value ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (editForm.region !== option.value) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (editForm.region !== option.value) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: editForm.region === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: editForm.region === option.value ? 'white' : '#00C851', 
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
                  Districts *
                </IonLabel>
                <div style={{ position: 'relative' }} ref={editDistrictDropdownRef}>
                  <div
                    onClick={() => setShowEditDistrictDropdown(!showEditDistrictDropdown)}
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
                    {editForm.districts.length === 0 ? (
                      <span style={{ color: '#666', fontSize: '14px' }}>Select districts</span>
                    ) : (
                      editForm.districts.map((district, index) => (
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
                          {district}
                          <IonIcon
                            icon={closeOutlineIcon}
                            style={{ fontSize: '14px', cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditForm(prev => ({
                                ...prev,
                                districts: prev.districts.filter(item => item !== district)
                              }));
                            }}
                          />
                        </span>
                      ))
                    )}
                  </div>
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
                              const isSelected = editForm.districts.includes(option.value);
                              let newDistricts;
                              if (isSelected) {
                                newDistricts = editForm.districts.filter(item => item !== option.value);
                              } else {
                                newDistricts = [...editForm.districts, option.value];
                              }
                              setEditForm(prev => ({ ...prev, districts: newDistricts }));
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: editForm.districts.includes(option.value) ? '#2196f3' : 'white',
                              color: editForm.districts.includes(option.value) ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (!editForm.districts.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!editForm.districts.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: editForm.districts.includes(option.value) ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: editForm.districts.includes(option.value) ? 'white' : '#00C851', 
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
                UPDATE MAPPING
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* View Mapping Modal */}
      <IonModal isOpen={showViewModal} onDidDismiss={handleCloseView}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Branch Mapping Details</IonTitle>
            <IonButton slot="end" onClick={handleCloseView}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent className="view-modal-content">
          {viewingMapping && (
            <div>
              <IonItem>
                <IonLabel>
                  <h2>Region</h2>
                  <p>{viewingMapping.region}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Districts ({viewingMapping.districts.length})</h2>
                  <div className="view-districts">
                    {viewingMapping.districts.map((district, index) => (
                      <IonChip key={index} className="district-chip-small">
                        <IonLabel>{district}</IonLabel>
                      </IonChip>
                    ))}
                  </div>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Created At</h2>
                  <p>{new Date(viewingMapping.createdAt).toLocaleString()}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Updated At</h2>
                  <p>{new Date(viewingMapping.updatedAt).toLocaleString()}</p>
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

export default BranchMapping;