import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonInput, IonChip, IonLabel, IonItem, IonList, IonTextarea
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  eyeOutline, gridOutline, listOutline, locationOutline, documentTextOutline, timeOutline
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
  const [districtInput, setDistrictInput] = useState('');
  const [editDistrictInput, setEditDistrictInput] = useState('');
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

  const handleAddMapping = () => {
    setAddForm({
      region: '',
      districts: []
    });
    setDistrictInput('');
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
    setDistrictInput('');
  };

  const handleEdit = (mappingId: string) => {
    const mapping = allMappings.find(m => m.id === mappingId);
    if (mapping) {
      setEditingMapping(mapping);
      setEditForm({
        region: mapping.region,
        districts: [...mapping.districts]
      });
      setEditDistrictInput('');
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
    setEditDistrictInput('');
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

  const handleAddDistrict = () => {
    if (districtInput.trim() && !addForm.districts.includes(districtInput.trim())) {
      setAddForm(prev => ({
        ...prev,
        districts: [...prev.districts, districtInput.trim()]
      }));
      setDistrictInput('');
    }
  };

  const handleRemoveDistrict = (districtToRemove: string) => {
    setAddForm(prev => ({
      ...prev,
      districts: prev.districts.filter(district => district !== districtToRemove)
    }));
  };

  const handleAddEditDistrict = () => {
    if (editDistrictInput.trim() && !editForm.districts.includes(editDistrictInput.trim())) {
      setEditForm(prev => ({
        ...prev,
        districts: [...prev.districts, editDistrictInput.trim()]
      }));
      setEditDistrictInput('');
    }
  };

  const handleRemoveEditDistrict = (districtToRemove: string) => {
    setEditForm(prev => ({
      ...prev,
      districts: prev.districts.filter(district => district !== districtToRemove)
    }));
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
        <IonContent className="add-mapping-modal">
          <div className="modal-header">
            <h2>Add New Branch Mapping</h2>
            <IonButton fill="clear" onClick={handleCloseAdd}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Region Name *</IonLabel>
                <IonInput
                  value={addForm.region}
                  onIonInput={(e) => setAddForm(prev => ({ ...prev, region: e.detail.value! }))}
                  placeholder="Enter region name (e.g., Mumbai, Pune, Nagpur)"
                  className="region-input"
                />
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Districts *</IonLabel>
                <div className="districts-section">
                  <div className="district-input">
                    <IonInput
                      value={districtInput}
                      onIonInput={(e) => setDistrictInput(e.detail.value!)}
                      placeholder="Enter district name"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddDistrict()}
                    />
                    <IonButton fill="outline" onClick={handleAddDistrict}>
                      <IonIcon icon={addOutline} />
                    </IonButton>
                  </div>
                  
                  <div className="district-chips">
                    {addForm.districts.map((district, index) => (
                      <IonChip key={index} className="district-chip">
                        <IonLabel>{district}</IonLabel>
                        <IonButton
                          fill="clear"
                          size="small"
                          onClick={() => handleRemoveDistrict(district)}
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
            <IonButton fill="outline" onClick={handleCloseAdd}>
              CANCEL
            </IonButton>
            <IonButton fill="solid" onClick={handleSaveAdd}>
              <IonIcon icon={checkmarkOutline} slot="start" />
              SAVE MAPPING
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Mapping Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={handleCloseEdit}>
        <IonContent className="add-mapping-modal">
          <div className="modal-header">
            <h2>Edit Branch Mapping</h2>
            <IonButton fill="clear" onClick={handleCloseEdit}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Region Name *</IonLabel>
                <IonInput
                  value={editForm.region}
                  onIonInput={(e) => setEditForm(prev => ({ ...prev, region: e.detail.value! }))}
                  placeholder="Enter region name"
                  className="region-input"
                />
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Districts *</IonLabel>
                <div className="districts-section">
                  <div className="district-input">
                    <IonInput
                      value={editDistrictInput}
                      onIonInput={(e) => setEditDistrictInput(e.detail.value!)}
                      placeholder="Enter district name"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddEditDistrict()}
                    />
                    <IonButton fill="outline" onClick={handleAddEditDistrict}>
                      <IonIcon icon={addOutline} />
                    </IonButton>
                  </div>
                  
                  <div className="district-chips">
                    {editForm.districts.map((district, index) => (
                      <IonChip key={index} className="district-chip">
                        <IonLabel>{district}</IonLabel>
                        <IonButton
                          fill="clear"
                          size="small"
                          onClick={() => handleRemoveEditDistrict(district)}
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
            <IonButton fill="outline" onClick={handleCloseEdit}>
              CANCEL
            </IonButton>
            <IonButton fill="solid" onClick={handleSaveEdit}>
              <IonIcon icon={checkmarkOutline} slot="start" />
              UPDATE MAPPING
            </IonButton>
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