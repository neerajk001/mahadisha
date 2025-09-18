import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonButtons, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonBadge, IonChip, IonFab, IonFabButton
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  keyOutline, homeOutline, gitBranchOutline, shieldOutline,
  shuffleOutline, barChartOutline, fileTrayOutline, accessibilityOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  eyeOutline, settingsOutline, copyOutline, linkOutline, timeOutline,
  peopleOutline, documentTextOutline, globeOutline, businessOutline,
  locationOutline, callOutline, mailOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { BranchData } from '../types';
import './BranchMaster.css';
import './shared/MasterMobile.css';

const BranchMaster: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Enhanced state for new functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchData | null>(null);
  const [viewingBranch, setViewingBranch] = useState<BranchData | null>(null);
  const [editFormData, setEditFormData] = useState({ officeName: '', officeType: '', id: '' });
  const [addFormData, setAddFormData] = useState({ officeName: '', officeType: '' });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'officeName' | 'officeType' | 'createdAt'>('officeName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 6;

  // State for managing branches data - EXACTLY LIKE MANAGEPAGES
  const [allBranches, setAllBranches] = useState<BranchData[]>(() => mockDataService.getBranchData());
  
  // Filter and sort branches
  const filteredAndSortedBranches = useMemo(() => {
    let filtered = allBranches.filter(branch =>
      branch.officeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.officeType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort branches
    filtered.sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];
      
      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    });

    return filtered;
  }, [allBranches, searchQuery, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedBranches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBranches = filteredAndSortedBranches.slice(startIndex, endIndex);

  const handleAddBranch = () => {
    setShowAddModal(true);
  };

  const handleSaveNewBranch = () => {
    if (addFormData.officeName && addFormData.officeType) {
      // Generate a new ID for the branch
      const newId = `branch-${Date.now()}`;
      
      // Create the new branch object
      const newBranch: BranchData = {
        id: newId,
        officeName: addFormData.officeName,
        officeType: addFormData.officeType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add the new branch to the state - EXACTLY LIKE MANAGEPAGES
      setAllBranches(prevBranches => [...prevBranches, newBranch]);
      
      setToastMessage(`Branch "${addFormData.officeName}" created successfully`);
      setShowToast(true);
      setShowAddModal(false);
      setAddFormData({ officeName: '', officeType: '' });
    } else {
      setToastMessage('Please fill in all required fields');
      setShowToast(true);
    }
  };

  const handleEdit = (branch: BranchData) => {
    setEditingBranch(branch);
    setEditFormData({
      officeName: branch.officeName,
      officeType: branch.officeType,
      id: branch.id
    });
    setShowEditModal(true);
  };

  const handleView = (branch: BranchData) => {
    setViewingBranch(branch);
    setShowViewModal(true);
  };

  const handleUpdateBranch = () => {
    if (editingBranch) {
      // Update the branch in the state - EXACTLY LIKE MANAGEPAGES
      setAllBranches(prevBranches => 
        prevBranches.map(branch => 
          branch.id === editingBranch.id 
            ? { ...branch, officeName: editFormData.officeName, officeType: editFormData.officeType, updatedAt: new Date().toISOString() }
            : branch
        )
      );
      
      setToastMessage(`Branch "${editFormData.officeName}" updated successfully`);
      setShowToast(true);
      setShowEditModal(false);
      setEditingBranch(null);
      setEditFormData({ officeName: '', officeType: '', id: '' });
    }
  };

  const handleCopyInfo = (branchInfo: string) => {
    navigator.clipboard.writeText(branchInfo);
    setToastMessage('Branch info copied to clipboard');
    setShowToast(true);
  };

  const handleDelete = (branchId: string) => {
    setSelectedBranchId(branchId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedBranchId) {
      // Get the branch name before deletion for the toast message
      const branchToDelete = allBranches.find(branch => branch.id === selectedBranchId);
      
      // Actually remove the branch from the state - EXACTLY LIKE MANAGEPAGES
      setAllBranches(prevBranches => prevBranches.filter(branch => branch.id !== selectedBranchId));
      
      setToastMessage(`Branch "${branchToDelete?.officeName || selectedBranchId}" deleted successfully`);
      setShowToast(true);
      setSelectedBranchId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedBranchId(null);
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

  const getBranchIcon = (officeType: string) => {
    switch (officeType.toLowerCase()) {
      case 'head office': return businessOutline;
      case 'branch office': return gitBranchOutline;
      case 'regional office': return locationOutline;
      case 'service center': return settingsOutline;
      default: return homeOutline;
    }
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="branch-master-content">
            <div className="branches-container">
              {/* Header Section */}
              <div className="branches-header">
                <h1>Branch Management</h1>
                <p>Manage and organize your branch offices</p>
              </div>

              {/* Actions Section */}
              <div className="branches-actions">
                <IonSearchbar
                  className="branches-search"
                  placeholder="Search branches..."
                  value={searchQuery}
                  onIonInput={(e) => setSearchQuery(e.detail.value!)}
                  showClearButton="focus"
                />
                <IonButton 
                  fill="clear" 
                  className="view-toggle-button"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                >
                  <IonIcon icon={eyeOutline} />
                </IonButton>
                <IonButton 
                  fill="solid" 
                  className="add-branch-button"
                  onClick={handleAddBranch}
                >
                  <IonIcon icon={addOutline} />
                  Add New Branch
                </IonButton>
              </div>

              {/* Grid View */}
              {viewMode === 'grid' && (
                <IonGrid className="branches-grid">
                  <IonRow>
                    {currentBranches.map((branch) => (
                      <IonCol size="12" sizeMd="6" sizeLg="4" key={branch.id}>
                        <IonCard className="branch-card">
                          <IonCardHeader>
                            <div className="branch-card-header">
                              <div className="branch-card-icon">
                                <IonIcon icon={getBranchIcon(branch.officeType)} />
                              </div>
                              <div className="branch-card-info">
                                <IonCardTitle className="branch-card-name">
                                  {branch.officeName}
                                </IonCardTitle>
                                <p className="branch-card-type">{branch.officeType}</p>
                              </div>
                            </div>
                          </IonCardHeader>
                          <IonCardContent>
                            <div className="branch-card-actions">
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="branch-card-button view"
                                onClick={() => handleView(branch)}
                              >
                                <IonIcon icon={eyeOutline} />
                                View
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="branch-card-button edit"
                                onClick={() => handleEdit(branch)}
                              >
                                <IonIcon icon={createOutline} />
                                Edit
                              </IonButton>
                              <IonButton 
                                fill="clear" 
                                size="small" 
                                className="branch-card-button delete"
                                onClick={() => handleDelete(branch.id)}
                              >
                                <IonIcon icon={trashOutline} />
                                Delete
                              </IonButton>
                            </div>
                          </IonCardContent>
                        </IonCard>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              )}

              {/* Table View */}
              {viewMode === 'table' && (
                <IonCard className="branches-table-card">
                  <IonCardContent>
                    <table className="branches-table">
                      <thead>
                        <tr>
                          <th>Office Name</th>
                          <th>Office Type</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentBranches.map((branch) => (
                          <tr key={branch.id}>
                            <td>
                              <div className="branch-name">
                                <IonIcon icon={getBranchIcon(branch.officeType)} />
                                <span>{branch.officeName}</span>
                              </div>
                            </td>
                            <td>
                              <IonBadge color="primary">{branch.officeType}</IonBadge>
                            </td>
                            <td>
                              <div className="date-info">
                                <span>{new Date(branch.createdAt).toLocaleDateString()}</span>
                              </div>
                            </td>
                            <td className="actions-cell">
                              <div className="action-buttons">
                                <IonButton 
                                  fill="clear" 
                                  size="small"
                                  className="view-button"
                                  onClick={() => handleView(branch)}
                                >
                                  <IonIcon icon={eyeOutline} />
                                </IonButton>
                                <IonButton 
                                  fill="clear" 
                                  size="small"
                                  className="edit-button"
                                  onClick={() => handleEdit(branch)}
                                >
                                  <IonIcon icon={createOutline} />
                                </IonButton>
                                <IonButton 
                                  fill="clear" 
                                  size="small"
                                  className="delete-button"
                                  onClick={() => handleDelete(branch.id)}
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
              )}

              {/* Pagination - Show if there are branches */}
              {filteredAndSortedBranches.length > 0 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    <p>
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedBranches.length)} of {filteredAndSortedBranches.length} branches
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
                      <span className="pagination-text">Previous</span>
                    </IonButton>
                    <span className="page-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <IonButton 
                      fill="clear" 
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={handleNextPage}
                      className="pagination-button"
                    >
                      <span className="pagination-text">Next</span>
                      <IonIcon icon={chevronForwardOutline} />
                    </IonButton>
                  </div>
                </div>
              )}
            </div>
          </IonContent>
        </div>
      </IonSplitPane>

      {/* Add Branch Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Branch</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="branch-modal-content">
          <div style={{ padding: '1rem' }}>
            <IonInput
              label="Office Name"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Enter office name"
              value={addFormData.officeName}
              onIonInput={(e) => setAddFormData(prev => ({ ...prev, officeName: e.detail.value! }))}
            />
            <IonSelect
              label="Office Type"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Select office type"
              value={addFormData.officeType}
              onIonChange={(e) => setAddFormData(prev => ({ ...prev, officeType: e.detail.value }))}
            >
              <IonSelectOption value="Head Office">Head Office</IonSelectOption>
              <IonSelectOption value="Branch Office">Branch Office</IonSelectOption>
              <IonSelectOption value="Regional Office">Regional Office</IonSelectOption>
              <IonSelectOption value="Service Center">Service Center</IonSelectOption>
            </IonSelect>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <IonButton 
                expand="block" 
                fill="clear" 
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </IonButton>
              <IonButton 
                expand="block" 
                onClick={handleSaveNewBranch}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Save Branch
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Branch Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Branch</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="branch-modal-content">
          <div style={{ padding: '1rem' }}>
            <IonInput
              label="Office Name"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Enter office name"
              value={editFormData.officeName}
              onIonInput={(e) => setEditFormData(prev => ({ ...prev, officeName: e.detail.value! }))}
            />
            <IonSelect
              label="Office Type"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Select office type"
              value={editFormData.officeType}
              onIonChange={(e) => setEditFormData(prev => ({ ...prev, officeType: e.detail.value }))}
            >
              <IonSelectOption value="Head Office">Head Office</IonSelectOption>
              <IonSelectOption value="Branch Office">Branch Office</IonSelectOption>
              <IonSelectOption value="Regional Office">Regional Office</IonSelectOption>
              <IonSelectOption value="Service Center">Service Center</IonSelectOption>
            </IonSelect>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <IonButton 
                expand="block" 
                fill="clear" 
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </IonButton>
              <IonButton 
                expand="block" 
                onClick={handleUpdateBranch}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Update Branch
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* View Branch Modal */}
      <IonModal isOpen={showViewModal} onDidDismiss={() => setShowViewModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Branch Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowViewModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="branch-modal-content">
          <div style={{ padding: '1rem' }}>
            <div className="view-field">
              <h3>Office Name</h3>
              <p>{viewingBranch?.officeName}</p>
            </div>
            <div className="view-field">
              <h3>Office Type</h3>
              <p>{viewingBranch?.officeType}</p>
            </div>
            <div className="view-field">
              <h3>Created</h3>
              <p>{viewingBranch ? new Date(viewingBranch.createdAt).toLocaleString() : ''}</p>
            </div>
            <IonButton 
              expand="block" 
              fill="outline"
              onClick={() => setShowViewModal(false)}
              style={{ marginTop: '2rem' }}
            >
              <IonIcon icon={closeOutline} slot="start" />
              Close
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* Delete Confirmation Alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={cancelDelete}
        header="Confirm Delete"
        message="Are you sure you want to delete this branch? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Floating Action Button */}
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton className="fab-add-branch" onClick={handleAddBranch}>
          <IonIcon icon={addOutline} />
        </IonFabButton>
      </IonFab>

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

export default BranchMaster;
