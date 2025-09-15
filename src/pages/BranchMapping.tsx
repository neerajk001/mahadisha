import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonInput, IonChip, IonLabel, IonItem, IonList, IonTextarea
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { BranchMappingData } from '../types';
import './BranchMapping.css';

const BranchMapping: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
  const [branchMappings, setBranchMappings] = useState<BranchMappingData[]>([]);

  const itemsPerPage = 5;

  // Get branch mapping data from mock service and combine with new mappings
  const mockMappings = mockDataService.getBranchMappingData();
  const allMappings = [...mockMappings, ...branchMappings];
  
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

    setBranchMappings(prev => [...prev, newMapping]);
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

    setBranchMappings(prev => prev.map(mapping => 
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
      setBranchMappings(prev => prev.filter(mapping => mapping.id !== selectedMappingId));
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
              <div className="mappings-header">
                <h1>Branch Mapping</h1>
                <p>Manage region to district mapping</p>
              </div>

              {/* Search and Actions */}
              <div className="mappings-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search by region or district..."
                  className="mappings-search"
                />
                <IonButton 
                  fill="solid" 
                  className="add-mapping-button"
                  onClick={handleAddMapping}
                >
                  <IonIcon icon={addOutline} />
                  + ADD MAPPING
                </IonButton>
              </div>

              {/* Mappings Table */}
              <IonCard className="mappings-table-card">
                <IonCardContent className="table-container">
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
                            <div className="action-buttons">
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="view-button"
                                onClick={() => handleView(mapping.id)}
                              >
                                <IonIcon icon={searchOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="edit-button"
                                onClick={() => handleEdit(mapping.id)}
                              >
                                <IonIcon icon={createOutline} />
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="delete-button"
                                onClick={() => handleDelete(mapping.id)}
                              >
                                <IonIcon icon={trashOutline} />
                              </IonButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </IonCardContent>
              </IonCard>

              {/* Pagination */}
              <div className="pagination-container">
                <div className="pagination-info">
                  <p>
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredMappings.length)} of {filteredMappings.length} mappings
                  </p>
                </div>
                <div className="pagination-controls">
                  <IonButton 
                    fill="clear" 
                    disabled={currentPage === 1}
                    onClick={handlePreviousPage}
                    className="pagination-button"
                  >
                    <IonIcon icon={chevronBackOutline} />
                    Previous
                  </IonButton>
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <IonButton 
                    fill="clear" 
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                    className="pagination-button"
                  >
                    Next
                    <IonIcon icon={chevronForwardOutline} />
                  </IonButton>
                </div>
              </div>
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