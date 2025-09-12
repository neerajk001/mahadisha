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
  const [editingBranch, setEditingBranch] = useState<BranchData | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'officeName' | 'officeType' | 'createdAt'>('officeName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 6;

  // Get branch data from mock service
  const allBranches = mockDataService.getBranchData();
  
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

  const handleEdit = (branchId: string) => {
    const branch = allBranches.find(b => b.id === branchId);
    if (branch) {
      setEditingBranch(branch);
      setShowEditModal(true);
    }
  };

  const handleDelete = (branchId: string) => {
    setSelectedBranchId(branchId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedBranchId) {
      setToastMessage(`Delete branch ${selectedBranchId} functionality will be implemented`);
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

  const handleSaveBranch = () => {
    setToastMessage('Branch saved successfully');
    setShowToast(true);
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingBranch(null);
  };

  const getBranchIcon = (officeType: string) => {
    const type = officeType.toLowerCase();
    if (type.includes('head') || type.includes('main')) {
      return homeOutline;
    } else if (type.includes('branch') || type.includes('sub')) {
      return gitBranchOutline;
    } else if (type.includes('office') || type.includes('center')) {
      return businessOutline;
    } else {
      return locationOutline;
    }
  };

  const getBranchColor = (officeType: string) => {
    const type = officeType.toLowerCase();
    if (type.includes('head') || type.includes('main')) {
      return 'primary';
    } else if (type.includes('branch') || type.includes('sub')) {
      return 'success';
    } else if (type.includes('office') || type.includes('center')) {
      return 'warning';
    } else {
      return 'secondary';
    }
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="manage-pages-content">
            <div className="pages-container">
              {/* Header Section */}
              <div className="pages-header">
                <h1>Branch Master</h1>
                <p>Manage office branches and their types</p>
              </div>

              {/* Enhanced Search and Actions */}
              <div className="pages-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search branches by name or type..."
                  className="pages-search"
                />
                <IonButton 
                  fill="outline" 
                  size="small"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                >
                  <IonIcon icon={viewMode === 'grid' ? barChartOutline : eyeOutline} />
                  {viewMode === 'grid' ? 'Table View' : 'Grid View'}
                </IonButton>
                <IonButton 
                  fill="solid" 
                  className="add-page-button"
                  onClick={handleAddBranch}
                >
                  <IonIcon icon={addOutline} />
                  Add New Branch
                </IonButton>
              </div>

              {/* Modern Branches Grid */}
              {viewMode === 'grid' ? (
                <div className="pages-grid">
                  {currentBranches.map((branch) => (
                    <div key={branch.id} className="page-card">
                      <div className="page-card-header">
                        <div className="page-card-icon">
                          <IonIcon icon={getBranchIcon(branch.officeType)} />
                        </div>
                        <div className="page-card-title">
                          <h3 className="page-card-name">{branch.officeName}</h3>
                          <div className="page-card-url">{branch.officeType}</div>
                        </div>
                      </div>
                      
                      <div className="page-card-content">
                        <div className="page-card-meta">
                          <div className="page-card-meta-item">
                            <IonIcon icon={businessOutline} className="page-card-meta-icon" />
                            <span>Type: {branch.officeType}</span>
                          </div>
                        </div>
                        
                        <div className="page-card-meta">
                          <div className="page-card-meta-item">
                            <IonIcon icon={timeOutline} className="page-card-meta-icon" />
                            <span>Created: {new Date(branch.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="page-card-actions">
                        <IonButton 
                          fill="solid" 
                          className="page-card-button edit"
                          onClick={() => handleEdit(branch.id)}
                        >
                          <IonIcon icon={createOutline} />
                          Edit
                        </IonButton>
                        <IonButton 
                          fill="solid" 
                          className="page-card-button delete"
                          onClick={() => handleDelete(branch.id)}
                        >
                          <IonIcon icon={trashOutline} />
                          Delete
                        </IonButton>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Enhanced Table View */
                <IonCard className="pages-table-card">
                  <div className="table-container">
                    <table className="pages-table">
                      <thead>
                        <tr>
                          <th>
                            <div className="table-header">
                              <span>Office Name</span>
                              <IonIcon icon={shuffleOutline} className="filter-icon" />
                            </div>
                          </th>
                          <th>
                            <div className="table-header">
                              <span>Office Type</span>
                              <IonIcon icon={shuffleOutline} className="filter-icon" />
                            </div>
                          </th>
                          <th>
                            <div className="table-header">
                              <span>Branch ID</span>
                            </div>
                          </th>
                          <th>
                            <div className="table-header">
                              <span>Created Date</span>
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
                        {currentBranches.map((branch, index) => (
                          <tr key={branch.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td className="name-cell">
                              <div className="page-name">
                                <IonIcon icon={getBranchIcon(branch.officeType)} className="page-icon" />
                                <span>{branch.officeName}</span>
                              </div>
                            </td>
                            <td>
                              <IonChip color={getBranchColor(branch.officeType)}>
                                {branch.officeType}
                              </IonChip>
                            </td>
                            <td>
                              <span style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                                ID: {branch.id}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <IonIcon icon={timeOutline} style={{ color: '#667eea', fontSize: '0.8rem' }} />
                                <span style={{ fontSize: '0.85rem' }}>
                                  {new Date(branch.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </td>
                            <td className="actions-cell">
                              <div className="action-buttons">
                                <IonButton 
                                  fill="clear" 
                                  size="small"
                                  className="edit-button"
                                  onClick={() => handleEdit(branch.id)}
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
                  </div>
                </IonCard>
              )}

              {/* Enhanced Pagination */}
              <div className="pagination-container">
                <div className="pagination-info">
                  <p>
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedBranches.length)} of {filteredAndSortedBranches.length} branches
                  </p>
                </div>
                <div className="pagination-controls">
                  <IonButton 
                    fill="solid" 
                    className="pagination-button"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <IonIcon icon={chevronBackOutline} />
                    Previous
                  </IonButton>
                  <div className="page-info">
                    Page {currentPage} of {totalPages}
                  </div>
                  <IonButton 
                    fill="solid" 
                    className="pagination-button"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
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
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <IonInput
              placeholder="Office Name"
              style={{ marginBottom: '1rem' }}
            />
            <IonSelect placeholder="Office Type" style={{ marginBottom: '1rem' }}>
              <IonSelectOption value="head-office">Head Office</IonSelectOption>
              <IonSelectOption value="branch-office">Branch Office</IonSelectOption>
              <IonSelectOption value="sub-office">Sub Office</IonSelectOption>
              <IonSelectOption value="service-center">Service Center</IonSelectOption>
            </IonSelect>
            <IonInput
              placeholder="Branch ID"
              style={{ marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <IonButton fill="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </IonButton>
              <IonButton fill="solid" onClick={handleSaveBranch}>
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
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <IonInput
              placeholder="Office Name"
              value={editingBranch?.officeName}
              style={{ marginBottom: '1rem' }}
            />
            <IonSelect placeholder="Office Type" value={editingBranch?.officeType} style={{ marginBottom: '1rem' }}>
              <IonSelectOption value="head-office">Head Office</IonSelectOption>
              <IonSelectOption value="branch-office">Branch Office</IonSelectOption>
              <IonSelectOption value="sub-office">Sub Office</IonSelectOption>
              <IonSelectOption value="service-center">Service Center</IonSelectOption>
            </IonSelect>
            <IonInput
              placeholder="Branch ID"
              value={editingBranch?.id}
              style={{ marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <IonButton fill="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </IonButton>
              <IonButton fill="solid" onClick={handleSaveBranch}>
                Update Branch
              </IonButton>
            </div>
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
