import React, { useState, useEffect, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonButtons, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonBadge, IonChip, IonFab, IonFabButton, IonItem, IonLabel, IonList
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  keyOutline, homeOutline, gitBranchOutline, shieldOutline,
  shuffleOutline, barChartOutline, fileTrayOutline, accessibilityOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  eyeOutline, settingsOutline, copyOutline, linkOutline, timeOutline,
  peopleOutline, documentTextOutline, globeOutline, businessOutline,
  locationOutline, callOutline, mailOutline, gridOutline, listOutline
} from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import ActionDropdown from '../components/common/ActionDropdown';
import { mockDataService } from '../../services/api';
import type { BranchData } from '../../types';
import './BranchMaster.css';  // original 
import '../../pages/shared/MasterMobile.css';

const BranchMaster: React.FC = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // CRUD modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchData | null>(null);
  const [viewingBranch, setViewingBranch] = useState<BranchData | null>(null);
  const [editFormData, setEditFormData] = useState({ officeName: '', officeType: '' });
  const [addFormData, setAddFormData] = useState({ officeName: '', officeType: '' });
  
  // View options
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'officeName' | 'officeType' | 'createdAt'>('officeName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 6;

  // State for managing branches data
  const [allBranches, setAllBranches] = useState<BranchData[]>([]);
  
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

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // CRUD Operations
  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const data = mockDataService.getBranchData();
      setAllBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setToastMessage('Failed to fetch branches');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBranch = () => {
    setAddFormData({ officeName: '', officeType: '' });
    setShowAddModal(true);
  };

  const handleSaveNewBranch = () => {
    if (addFormData.officeName && addFormData.officeType) {
      try {
        // Create a new branch with mock data
        const newBranch: BranchData = {
          id: `branch-${Date.now()}`,
          officeName: addFormData.officeName,
          officeType: addFormData.officeType,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setAllBranches([...allBranches, newBranch]);
        setShowAddModal(false);
        setAddFormData({ officeName: '', officeType: '' });
        setToastMessage(`Branch "${newBranch.officeName}" created successfully`);
        setShowToast(true);
      } catch (error) {
        console.error('Error adding branch:', error);
        setToastMessage('Failed to add branch');
        setShowToast(true);
      }
    }
  };

  const handleEdit = (branch: BranchData) => {
    setEditingBranch(branch);
    setEditFormData({
      officeName: branch.officeName,
      officeType: branch.officeType
    });
    setShowEditModal(true);
  };

  const handleUpdateBranch = () => {
    if (editingBranch && editFormData.officeName && editFormData.officeType) {
      try {
        // Update branch with mock data
        const updatedBranch: BranchData = {
          ...editingBranch,
          officeName: editFormData.officeName,
          officeType: editFormData.officeType,
          updatedAt: new Date().toISOString()
        };
        
        setAllBranches(prev => prev.map(b => b.id === updatedBranch.id ? updatedBranch : b));
        setShowEditModal(false);
        setEditingBranch(null);
        setToastMessage(`Branch "${updatedBranch.officeName}" updated successfully`);
        setShowToast(true);
      } catch (error) {
        console.error('Error updating branch:', error);
        setToastMessage('Failed to update branch');
        setShowToast(true);
      }
    }
  };

  const handleView = (branch: BranchData) => {
    setViewingBranch(branch);
    setShowViewModal(true);
  };

  const handleDelete = (branchId: string) => {
    const branchToDelete = allBranches.find(branch => branch.id === branchId);
    if (branchToDelete) {
      console.log("Delete triggered for branch ID:", branchId);
      setSelectedBranchId(branchId);
      setShowDeleteAlert(true);
    } else {
      setToastMessage('Branch not found');
      setShowToast(true);
    }
  };

  const confirmDelete = () => {
    if (selectedBranchId) {
      try {
        // Get the branch name before deletion for the toast message
        const branchToDelete = allBranches.find(branch => branch.id === selectedBranchId);
        
        // Mock delete operation
        setAllBranches(prev => prev.filter(b => b.id !== selectedBranchId));
        setToastMessage(`Branch "${branchToDelete?.officeName || ''}" deleted successfully`);
        setShowToast(true);
      } catch (error) {
        console.error('Error deleting branch:', error);
        setToastMessage('Failed to delete branch');
        setShowToast(true);
      } finally {
        setShowDeleteAlert(false);
        setSelectedBranchId(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteAlert(false);
    setSelectedBranchId(null);
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

  // Pagination handlers - removed duplicate declarations

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'table' : 'grid');
  };

  // Sort handlers
  const handleSort = (field: 'officeName' | 'officeType' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <IonPage className="branch-master-page">
      <IonSplitPane contentId="branch-master-content">
        <Sidebar />
        <IonContent id="branch-master-content" className="branch-master-content">
          <DashboardHeader title="Branch Master" />
          
          {/* Main Content */}
          <div className="branches-container">
            {/* Header Section */}
            <IonCard className="branches-header">
              <IonCardContent>
                <h1>Branch Management</h1>
                <p>Create, view, edit, and manage all branch offices in the system</p>
              </IonCardContent>
            </IonCard>

            {/* Actions Section */}
            <IonCard className="branches-actions">
              <IonCardContent>
                <IonGrid>
                  <IonRow className="ion-align-items-center">
                    <IonCol size="12" sizeMd="6">
                      <IonSearchbar
                        value={searchQuery}
                        onIonChange={e => setSearchQuery(e.detail.value!)}
                        placeholder="Search branches..."
                        className="branches-search"
                      />
                    </IonCol>
                    <IonCol size="12" sizeMd="6" className="ion-text-end">
                      <IonButton 
                        className="view-toggle-button" 
                        fill="clear"
                        onClick={toggleViewMode}
                      >
                        <IonIcon icon={viewMode === 'grid' ? listOutline : gridOutline} />
                      </IonButton>
                      <IonButton 
                        className="add-branch-button" 
                        onClick={handleAddBranch}
                      >
                        <IonIcon slot="start" icon={addOutline} />
                        Add Branch
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>

            {/* Branches Display */}
            <IonCard className="branches-table-card">
              <IonCardContent>
                {isLoading ? (
                  <div className="loading-container">
                    <IonSpinner name="crescent" />
                    <p>Loading branches...</p>
                  </div>
                ) : currentBranches.length === 0 ? (
                  <div className="no-data-container">
                    <p>No branches found. Add a new branch to get started.</p>
                  </div>
                ) : viewMode === 'grid' ? (
                  // Grid View
                  <IonGrid>
                    <IonRow>
                      {currentBranches.map(branch => (
                        <IonCol size="12" sizeSm="6" sizeMd="4" key={branch.id}>
                          <IonCard className="branch-card">
                            <div className="branch-card-header">
                              <h2>{branch.officeName}</h2>
                              <div className="branch-path">
                                /{branch.officeName.toLowerCase().replace(/\s+/g, '-')}
                              </div>
                            </div>
                            <div className="branch-card-content">
                              <div className="branch-info">
                                <div className="branch-info-item">
                                  <IonIcon icon={businessOutline} />
                                  <span>Type: {branch.officeType}</span>
                                </div>
                                <div className="branch-info-item">
                                  <IonIcon icon={timeOutline} />
                                  <span>Created: {new Date(branch.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="branch-actions">
                                <IonButton className="view-button" onClick={() => handleView(branch)}>
                                  <IonIcon icon={eyeOutline} slot="start" />
                                  VIEW
                                </IonButton>
                                <IonButton className="edit-button" onClick={() => handleEdit(branch)}>
                                  <IonIcon icon={createOutline} slot="start" />
                                  EDIT
                                </IonButton>
                                <IonButton className="delete-button" onClick={() => handleDelete(branch.id)}>
                                  <IonIcon icon={trashOutline} slot="start" />
                                  DELETE
                                </IonButton>
                              </div>
                            </div>
                          </IonCard>
                        </IonCol>
                      ))}
                    </IonRow>
                  </IonGrid>
                ) : (
                  // Table View
                  <div className="table-container">
                    <table className="branches-table">
                      <thead>
                        <tr>
                          <th onClick={() => handleSort('officeName')}>
                            Office Name
                            {sortBy === 'officeName' && (
                              <IonIcon icon={sortOrder === 'asc' ? chevronBackOutline : chevronForwardOutline} />
                            )}
                          </th>
                          <th onClick={() => handleSort('officeType')}>
                            Office Type
                            {sortBy === 'officeType' && (
                              <IonIcon icon={sortOrder === 'asc' ? chevronBackOutline : chevronForwardOutline} />
                            )}
                          </th>
                          <th onClick={() => handleSort('createdAt')}>
                            Created Date
                            {sortBy === 'createdAt' && (
                              <IonIcon icon={sortOrder === 'asc' ? chevronBackOutline : chevronForwardOutline} />
                            )}
                          </th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentBranches.map(branch => (
                          <tr key={branch.id}>
                            <td>{branch.officeName}</td>
                            <td>{branch.officeType}</td>
                            <td>{new Date(branch.createdAt).toLocaleDateString()}</td>
                            <td>
                            <div className="table-actions">
                              <ActionDropdown
                                itemId={branch.id}
                                onView={() => handleView(branch)}
                                onEdit={() => handleEdit(branch)}
                                onDelete={() => handleDelete(branch.id)}
                                showView={true}
                                size="small"
                              />
                            </div>
                          </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {filteredAndSortedBranches.length > 0 && (
                  <div className="pagination-controls">
                    <IonButton 
                      disabled={currentPage === 1} 
                      onClick={handlePreviousPage}
                    >
                      <IonIcon slot="icon-only" icon={chevronBackOutline} />
                    </IonButton>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <IonButton 
                      disabled={currentPage === totalPages} 
                      onClick={handleNextPage}
                    >
                      <IonIcon slot="icon-only" icon={chevronForwardOutline} />
                    </IonButton>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          </div>

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
            <IonContent className="ion-padding">
              <IonItem>
                <IonLabel position="floating">Office Name</IonLabel>
                <IonInput
                  value={addFormData.officeName}
                  onIonChange={e => setAddFormData({...addFormData, officeName: e.detail.value!})}
                  required
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Office Type</IonLabel>
                <IonSelect
                  value={addFormData.officeType}
                  onIonChange={e => setAddFormData({...addFormData, officeType: e.detail.value})}
                >
                  <IonSelectOption value="Head Office">Head Office</IonSelectOption>
                  <IonSelectOption value="Regional Office">Regional Office</IonSelectOption>
                  <IonSelectOption value="District Office">District Office</IonSelectOption>
                  <IonSelectOption value="Branch Office">Branch Office</IonSelectOption>
                </IonSelect>
              </IonItem>
              <div className="ion-padding">
                <IonButton expand="block" onClick={handleSaveNewBranch}>
                  <IonIcon slot="start" icon={checkmarkOutline} />
                  Save Branch
                </IonButton>
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
            <IonContent className="ion-padding">
              <IonItem>
                <IonLabel position="floating">Office Name</IonLabel>
                <IonInput
                  value={editFormData.officeName}
                  onIonChange={e => setEditFormData({...editFormData, officeName: e.detail.value!})}
                  required
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Office Type</IonLabel>
                <IonSelect
                  value={editFormData.officeType}
                  onIonChange={e => setEditFormData({...editFormData, officeType: e.detail.value})}
                >
                  <IonSelectOption value="Head Office">Head Office</IonSelectOption>
                  <IonSelectOption value="Regional Office">Regional Office</IonSelectOption>
                  <IonSelectOption value="District Office">District Office</IonSelectOption>
                  <IonSelectOption value="Branch Office">Branch Office</IonSelectOption>
                </IonSelect>
              </IonItem>
              <div className="ion-padding">
                <IonButton expand="block" onClick={handleUpdateBranch}>
                  <IonIcon slot="start" icon={checkmarkOutline} />
                  Update Branch
                </IonButton>
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
            <IonContent className="ion-padding">
              {viewingBranch && (
                <IonList>
                  <IonItem>
                    <IonLabel>
                      <h2>Office Name</h2>
                      <p>{viewingBranch.officeName}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Office Type</h2>
                      <p>{viewingBranch.officeType}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Created Date</h2>
                      <p>{new Date(viewingBranch.createdAt).toLocaleString()}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Last Updated</h2>
                      <p>{new Date(viewingBranch.updatedAt).toLocaleString()}</p>
                    </IonLabel>
                  </IonItem>
                </IonList>
              )}
              <div className="ion-padding">
                <IonButton expand="block" onClick={() => setShowViewModal(false)}>
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
              {
                text: 'Cancel',
                role: 'cancel',
                handler: cancelDelete
              },
              {
                text: 'Delete',
                handler: confirmDelete
              }
            ]}
          />

          {/* Toast Notification */}
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={3000}
            position="bottom"
          />
        </IonContent>
      </IonSplitPane>
    </IonPage>
  );
};

export default BranchMaster;
