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
import { Pagination } from '../components/shared';
import { MasterCard, MasterControls, MasterHeader, ScrollableTableContainer } from '../../components/shared';
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
          <DashboardHeader />
          
          {/* Main Content */}
          <div className="branches-container">
            {/* Header Section */}
            <MasterHeader
              title="Branch Management"
              subtitle="Create, view, edit, and manage all branch offices in the system"
            />

            {/* Enhanced Search and Actions */}
            <MasterControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search branches by name or type..."
              viewMode={viewMode}
              onViewModeToggle={toggleViewMode}
              onAddNew={handleAddBranch}
              addButtonText="Add New Branch"
            />

            {/* Branches Display */}
            {isLoading ? (
              <IonCard className="branches-table-card">
                <IonCardContent>
                  <div className="loading-container">
                    <IonSpinner name="crescent" />
                    <p>Loading branches...</p>
                  </div>
                </IonCardContent>
              </IonCard>
            ) : currentBranches.length === 0 ? (
              <IonCard className="branches-table-card">
                <IonCardContent>
                  <div className="no-data-container">
                    <p>No branches found. Add a new branch to get started.</p>
                  </div>
                </IonCardContent>
              </IonCard>
            ) : viewMode === 'grid' ? (
              // Grid View
              <div className="master-cards-grid" style={{ padding: '1rem' }}>
                {currentBranches.map(branch => (
                  <MasterCard
                    key={branch.id}
                    id={branch.id}
                    title={branch.officeName}
                    subtitle={branch.officeType}
                    icon={businessOutline}
                    metaItems={[
                      {
                        icon: locationOutline,
                        label: "Path",
                        value: `/${branch.officeName.toLowerCase().replace(/\s+/g, '-')}`
                      },
                      {
                        icon: timeOutline,
                        label: "Created",
                        value: new Date(branch.createdAt).toLocaleDateString()
                      }
                    ]}
                    onView={() => handleView(branch)}
                    onEdit={() => handleEdit(branch)}
                    onDelete={() => handleDelete(branch.id)}
                  />
                ))}
              </div>
            ) : (
              // Table View
              <ScrollableTableContainer cardClassName="branches-table-card">
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
              </ScrollableTableContainer>
            )}

            {/* Pagination */}
            {filteredAndSortedBranches.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
              />
            )}
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
              <div style={{ padding: '1rem 0' }}>
                <h2 style={{ marginBottom: '1.5rem', color: '#667eea', textAlign: 'center' }}>Create New Branch</h2>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <IonLabel style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600', 
                    color: '#333',
                    fontSize: '1rem'
                  }}>
                    Office Name
                  </IonLabel>
                <IonInput
                  value={addFormData.officeName}
                  onIonChange={e => setAddFormData({...addFormData, officeName: e.detail.value!})}
                    placeholder="Enter office name"
                    style={{ 
                      '--background': '#f5f5f5',
                      '--border-radius': '12px',
                      '--padding-start': '16px',
                      '--padding-end': '16px',
                      '--padding-top': '12px',
                      '--padding-bottom': '12px',
                      '--color': '#333',
                      '--placeholder-color': '#666'
                    }}
                  required
                />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <IonLabel style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600', 
                    color: '#333',
                    fontSize: '1rem'
                  }}>
                    Office Type
                  </IonLabel>
                <IonSelect
                  value={addFormData.officeType}
                  onIonChange={e => setAddFormData({...addFormData, officeType: e.detail.value})}
                    placeholder="Select office type"
                    style={{ 
                      '--background': '#f5f5f5',
                      '--border-radius': '12px',
                      '--padding-start': '16px',
                      '--padding-end': '16px',
                      '--padding-top': '12px',
                      '--padding-bottom': '12px',
                      '--color': '#333'
                    }}
                >
                  <IonSelectOption value="Head Office">Head Office</IonSelectOption>
                  <IonSelectOption value="Regional Office">Regional Office</IonSelectOption>
                  <IonSelectOption value="District Office">District Office</IonSelectOption>
                  <IonSelectOption value="Branch Office">Branch Office</IonSelectOption>
                </IonSelect>
                </div>

                <IonButton 
                  expand="block" 
                  onClick={handleSaveNewBranch}
                  style={{ 
                    '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '--color': 'white',
                    '--border-radius': '12px',
                    '--padding-top': '12px',
                    '--padding-bottom': '12px',
                    marginTop: '1rem'
                  }}
                >
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
              <div style={{ padding: '1rem 0' }}>
                <h2 style={{ marginBottom: '1.5rem', color: '#667eea', textAlign: 'center' }}>
                  Edit Branch: {editingBranch?.officeName}
                </h2>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <IonLabel style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600', 
                    color: '#333',
                    fontSize: '1rem'
                  }}>
                    Office Name
                  </IonLabel>
                <IonInput
                  value={editFormData.officeName}
                  onIonChange={e => setEditFormData({...editFormData, officeName: e.detail.value!})}
                    placeholder="Enter office name"
                    style={{ 
                      '--background': '#f5f5f5',
                      '--border-radius': '12px',
                      '--padding-start': '16px',
                      '--padding-end': '16px',
                      '--padding-top': '12px',
                      '--padding-bottom': '12px',
                      '--color': '#333',
                      '--placeholder-color': '#666'
                    }}
                  required
                />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <IonLabel style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600', 
                    color: '#333',
                    fontSize: '1rem'
                  }}>
                    Office Type
                  </IonLabel>
                <IonSelect
                  value={editFormData.officeType}
                  onIonChange={e => setEditFormData({...editFormData, officeType: e.detail.value})}
                    placeholder="Select office type"
                    style={{ 
                      '--background': '#f5f5f5',
                      '--border-radius': '12px',
                      '--padding-start': '16px',
                      '--padding-end': '16px',
                      '--padding-top': '12px',
                      '--padding-bottom': '12px',
                      '--color': '#333'
                    }}
                >
                  <IonSelectOption value="Head Office">Head Office</IonSelectOption>
                  <IonSelectOption value="Regional Office">Regional Office</IonSelectOption>
                  <IonSelectOption value="District Office">District Office</IonSelectOption>
                  <IonSelectOption value="Branch Office">Branch Office</IonSelectOption>
                </IonSelect>
                </div>

                <IonButton 
                  expand="block" 
                  onClick={handleUpdateBranch}
                  style={{ 
                    '--background': 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                    '--color': 'white',
                    '--border-radius': '12px',
                    '--padding-top': '12px',
                    '--padding-bottom': '12px',
                    marginTop: '1rem'
                  }}
                >
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
                <div style={{ padding: '1rem 0' }}>
                  {/* Header Section */}
                  <div style={{ 
                    textAlign: 'center', 
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '16px',
                    color: 'white'
                  }}>
                    <IonIcon 
                      icon={businessOutline} 
                      style={{ fontSize: '3rem', marginBottom: '1rem' }} 
                    />
                    <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>
                      {viewingBranch.officeName}
                    </h1>
                    <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
                      {viewingBranch.officeType}
                    </p>
                  </div>

                  {/* Information Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Basic Information Card */}
                    <IonCard style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <IonCardHeader>
                        <IonCardTitle style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          color: '#667eea'
                        }}>
                          <IonIcon icon={documentTextOutline} />
                          Basic Information
                        </IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600', color: '#555' }}>Office Name:</span>
                            <span style={{ 
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              padding: '0.5rem 1rem',
                              borderRadius: '20px',
                              fontSize: '0.9rem',
                              fontWeight: '500'
                            }}>
                              {viewingBranch.officeName}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600', color: '#555' }}>Office Type:</span>
                            <span style={{ 
                              background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                              color: 'white',
                              padding: '0.5rem 1rem',
                              borderRadius: '20px',
                              fontSize: '0.9rem',
                              fontWeight: '500'
                            }}>
                              {viewingBranch.officeType}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600', color: '#555' }}>Branch ID:</span>
                            <code style={{ 
                              background: '#f5f5f5',
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              color: '#666'
                            }}>
                              {viewingBranch.id}
                            </code>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>

                    {/* Status and Metadata Card */}
                    <IonCard style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <IonCardHeader>
                        <IonCardTitle style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          color: '#667eea'
                        }}>
                          <IonIcon icon={timeOutline} />
                          Status & Metadata
                        </IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600', color: '#555' }}>Status:</span>
                            <IonBadge color="success" style={{ fontSize: '0.8rem' }}>
                              Active
                            </IonBadge>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600', color: '#555' }}>Created:</span>
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>
                              {new Date(viewingBranch.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600', color: '#555' }}>Last Updated:</span>
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>
                              {new Date(viewingBranch.updatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>

                    {/* Action Buttons */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      marginTop: '1rem',
                      justifyContent: 'center'
                    }}>
                      <IonButton 
                        fill="outline"
                        style={{ 
                          '--border-color': '#667eea',
                          '--color': '#667eea',
                          '--border-radius': '12px',
                          flex: 1
                        }}
                        onClick={() => {
                          setShowViewModal(false);
                          handleEdit(viewingBranch);
                        }}
                      >
                        <IonIcon icon={createOutline} slot="start" />
                        Edit
                      </IonButton>
                      <IonButton 
                        fill="outline"
                        style={{ 
                          '--border-color': '#4ecdc4',
                          '--color': '#4ecdc4',
                          '--border-radius': '12px',
                          flex: 1
                        }}
                        onClick={() => {
                          navigator.clipboard.writeText(viewingBranch.officeName);
                          setToastMessage('Office name copied to clipboard');
                          setShowToast(true);
                        }}
                      >
                        <IonIcon icon={copyOutline} slot="start" />
                        Copy Name
                      </IonButton>
                    </div>
                  </div>
                </div>
              )}
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
