import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonButtons, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonBadge, IonChip, IonLabel
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  keyOutline, homeOutline, gitBranchOutline, shieldOutline,
  shuffleOutline, barChartOutline, fileTrayOutline, accessibilityOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  eyeOutline, settingsOutline, copyOutline, linkOutline, timeOutline,
  peopleOutline, documentTextOutline, globeOutline
} from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import ActionDropdown from '../components/common/ActionDropdown';
import { Pagination } from '../components/shared';
import { MasterCard, MasterControls, MasterHeader, ScrollableTableContainer } from '../../components/shared';
import { mockDataService } from '../../services/api';
import type { CasteData } from '../../types';
import './CasteMaster.css';

const CasteMaster: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedCasteId, setSelectedCasteId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Enhanced state for new functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingCaste, setEditingCaste] = useState<CasteData | null>(null);
  const [viewingCaste, setViewingCaste] = useState<CasteData | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });
  const [addFormData, setAddFormData] = useState({ name: '', description: '' });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 6;

  // State for managing castes data - REAL-TIME CRUD
  const [allCastes, setAllCastes] = useState<CasteData[]>(() => mockDataService.getCasteData());
  
  // Filter and sort castes
  const filteredAndSortedCastes = useMemo(() => {
    let filtered = allCastes.filter(caste =>
      caste.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort castes
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
  }, [allCastes, searchQuery, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedCastes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCastes = filteredAndSortedCastes.slice(startIndex, endIndex);

  const handleAddCaste = () => {
    setShowAddModal(true);
  };

  const handleEdit = (caste: CasteData) => {
    setEditingCaste(caste);
    setEditFormData({
      name: caste.name,
      description: caste.description || ''
    });
    setShowEditModal(true);
  };

  const handleView = (caste: CasteData) => {
    setViewingCaste(caste);
    setShowViewModal(true);
  };

  const handleCopyName = (casteName: string) => {
    navigator.clipboard.writeText(casteName);
    setToastMessage('Caste name copied to clipboard');
    setShowToast(true);
  };

  const handleDelete = (casteId: string) => {
    setSelectedCasteId(casteId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedCasteId) {
      // Remove the caste from state
      setAllCastes(prevCastes => prevCastes.filter(caste => caste.id !== selectedCasteId));
      
      const casteToDelete = allCastes.find(caste => caste.id === selectedCasteId);
      setToastMessage(`Caste "${casteToDelete?.name || selectedCasteId}" deleted successfully`);
      setShowToast(true);
      setSelectedCasteId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedCasteId(null);
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

  const handleSaveNewCaste = () => {
    if (addFormData.name) {
      // Generate a new ID for the caste
      const newId = `caste-${Date.now()}`;
      
      // Create the new caste object
      const newCaste: CasteData = {
        id: newId,
        name: addFormData.name,
        description: addFormData.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add the new caste to the state
      setAllCastes(prevCastes => [...prevCastes, newCaste]);
      
      setToastMessage(`Caste "${addFormData.name}" created successfully`);
      setShowToast(true);
      setShowAddModal(false);
      setAddFormData({ name: '', description: '' });
    } else {
      setToastMessage('Please fill in the caste name');
      setShowToast(true);
    }
  };

  const handleUpdateCaste = () => {
    if (editingCaste && editFormData.name) {
      // Update the caste in the state
      setAllCastes(prevCastes => 
        prevCastes.map(caste => 
          caste.id === editingCaste.id 
            ? { ...caste, name: editFormData.name, description: editFormData.description, updatedAt: new Date().toISOString() }
            : caste
        )
      );
      
      setToastMessage(`Caste "${editFormData.name}" updated successfully`);
      setShowToast(true);
      setShowEditModal(false);
      setEditingCaste(null);
      setEditFormData({ name: '', description: '' });
    } else {
      setToastMessage('Please fill in the caste name');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content" when="md">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="manage-pages-content">
            <div className="pages-container">
              {/* Header Section */}
              <MasterHeader
                title="Caste Master"
                subtitle="Manage caste categories and their names"
              />

              {/* Enhanced Search and Actions */}
              <MasterControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search castes by name..."
                viewMode={viewMode}
                onViewModeToggle={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                onAddNew={handleAddCaste}
                addButtonText="Add New Caste"
              />

              {/* Castes Grid */}
              {viewMode === 'grid' ? (
                <div className="master-cards-grid" style={{ padding: '1rem' }}>
                  {currentCastes.map((caste) => (
                    <MasterCard
                      key={caste.id}
                      id={caste.id}
                      title={caste.name}
                      subtitle="Caste Category"
                      icon={peopleOutline}
                      metaItems={[
                        {
                          icon: documentTextOutline,
                          label: "ID",
                          value: caste.id.slice(-6)
                        },
                        {
                          icon: timeOutline,
                          label: "Status",
                          value: "Active"
                        }
                      ]}
                      onView={() => handleView(caste)}
                      onEdit={() => handleEdit(caste)}
                      onDelete={() => handleDelete(caste.id)}
                    />
                  ))}
                </div>
              ) : (
                <ScrollableTableContainer cardClassName="pages-table-card">
                  <table className="pages-table">
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
                              <span>ID</span>
                              <IonIcon icon={searchOutline} className="filter-icon" />
                            </div>
                          </th>
                          <th>
                            <div className="table-header">
                              <span>Actions</span>
                              <IonIcon icon={searchOutline} className="filter-icon" />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentCastes.map((caste, index) => (
                          <tr key={caste.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td className="name-cell">
                              <div className="page-name">
                                <IonIcon icon={peopleOutline} className="page-icon" />
                                <span>{caste.name}</span>
                              </div>
                            </td>
                            <td className="url-cell">
                              <code className="url-code">{caste.id}</code>
                            </td>
                            <td className="actions-cell">
                              <div className="action-buttons">
                                <ActionDropdown
                                  itemId={caste.id}
                                  onView={() => handleView(caste)}
                                  onEdit={() => handleEdit(caste)}
                                  onDelete={() => handleDelete(caste.id)}
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
              {filteredAndSortedCastes.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPreviousPage={handlePreviousPage}
                  onNextPage={handleNextPage}
                />
              )}
              
              {/* Bottom spacing for pagination visibility */}
              <div style={{ height: '3rem' }}></div>
            </div>
          </IonContent>
        </div>
      </IonSplitPane>

      {/* Delete Confirmation Alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={cancelDelete}
        header="Confirm Delete"
        message="Are you sure you want to delete this caste? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Add Caste Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Caste</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea', textAlign: 'center' }}>Create New Caste</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Caste Name
                </IonLabel>
                <IonInput
                  value={addFormData.name}
                  onIonInput={(e) => setAddFormData({...addFormData, name: e.detail.value!})}
                  placeholder="Enter caste name"
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
              <IonButton 
                expand="block" 
                style={{ 
                  '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '--color': 'white',
                  '--border-radius': '12px',
                  '--padding-top': '12px',
                  '--padding-bottom': '12px',
                  marginTop: '1rem'
                }}
                onClick={handleSaveNewCaste}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Create Caste
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Caste Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Caste</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea', textAlign: 'center' }}>Edit Caste: {editingCaste?.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Caste Name
                </IonLabel>
                <IonInput
                  value={editFormData.name}
                  onIonInput={(e) => setEditFormData({...editFormData, name: e.detail.value!})}
                  placeholder="Enter caste name"
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
              <IonButton 
                expand="block" 
                style={{ 
                  '--background': 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                  '--color': 'white',
                  '--border-radius': '12px',
                  '--padding-top': '12px',
                  '--padding-bottom': '12px',
                  marginTop: '1rem'
                }}
                onClick={handleUpdateCaste}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Update Caste
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* View Caste Modal */}
      <IonModal isOpen={showViewModal} onDidDismiss={() => setShowViewModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>View Caste Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowViewModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            {viewingCaste && (
              <>
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px',
                  color: 'white'
                }}>
                  <IonIcon 
                    icon={peopleOutline} 
                    style={{ fontSize: '3rem', marginBottom: '1rem' }} 
                  />
                  <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>
                    {viewingCaste.name}
                  </h1>
                  <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
                    Caste Category Details
                  </p>
                </div>

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
                          <span style={{ fontWeight: '600', color: '#555' }}>Caste Name:</span>
                          <span style={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                          }}>
                            {viewingCaste.name}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '600', color: '#555' }}>Caste ID:</span>
                          <code style={{ 
                            background: '#f5f5f5',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            color: '#666'
                          }}>
                            {viewingCaste.id}
                          </code>
                        </div>
                        {viewingCaste.description && (
                          <div style={{ marginTop: '1rem' }}>
                            <span style={{ fontWeight: '600', color: '#555', display: 'block', marginBottom: '0.5rem' }}>
                              Description:
                            </span>
                            <p style={{ 
                              background: '#f8f9fa',
                              padding: '1rem',
                              borderRadius: '8px',
                              margin: 0,
                              lineHeight: '1.5',
                              color: '#555'
                            }}>
                              {viewingCaste.description}
                            </p>
                          </div>
                        )}
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
                            {new Date(viewingCaste.createdAt).toLocaleDateString('en-US', {
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
                            {new Date(viewingCaste.updatedAt).toLocaleDateString('en-US', {
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
                        handleEdit(viewingCaste);
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
                        handleCopyName(viewingCaste.name);
                      }}
                    >
                      <IonIcon icon={copyOutline} slot="start" />
                      Copy Name
                    </IonButton>
                  </div>
                </div>
              </>
            )}
          </div>
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

export default CasteMaster;