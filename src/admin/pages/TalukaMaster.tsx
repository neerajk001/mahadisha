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
  peopleOutline, documentTextOutline, globeOutline, locationOutline,
  mapOutline, businessOutline
} from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import ActionDropdown from '../components/common/ActionDropdown';
import { Pagination } from '../components/shared';
import { MasterCard, MasterControls, MasterHeader, ScrollableTableContainer } from '../../components/shared';
import { mockDataService } from '../../services/api';
import type { TalukaData } from '../../types';
import './TalukaMaster.css';
// View functionality implementation

const TalukaMaster: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedTalukaId, setSelectedTalukaId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Enhanced state for unified modal functionality
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedTaluka, setSelectedTaluka] = useState<TalukaData | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 6;

  // State for managing talukas data - REAL-TIME CRUD
  const [allTalukas, setAllTalukas] = useState<TalukaData[]>(() => mockDataService.getTalukaData());
  
  // Filter and sort talukas
  const filteredAndSortedTalukas = useMemo(() => {
    let filtered = allTalukas.filter(taluka =>
      taluka.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort talukas
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
  }, [allTalukas, searchQuery, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedTalukas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTalukas = filteredAndSortedTalukas.slice(startIndex, endIndex);

  const handleAddTaluka = () => {
    setModalMode('add');
    setSelectedTaluka(null);
    setFormData({ name: '' });
    setShowModal(true);
  };

  const handleEdit = (taluka: TalukaData) => {
    setModalMode('edit');
    setSelectedTaluka(taluka);
    setFormData({
      name: taluka.name
    });
    setShowModal(true);
  };

  const handleView = (taluka: TalukaData) => {
    setModalMode('view');
    setSelectedTaluka(taluka);
    setFormData({
      name: taluka.name
    });
    setShowModal(true);
  };

  const handleCopyName = (talukaName: string) => {
    navigator.clipboard.writeText(talukaName);
    setToastMessage('Taluka name copied to clipboard');
    setShowToast(true);
  };

  const handleDelete = (talukaId: string) => {
    setSelectedTalukaId(talukaId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedTalukaId) {
      // Remove the taluka from state
      setAllTalukas(prevTalukas => prevTalukas.filter(taluka => taluka.id !== selectedTalukaId));
      
      const talukaToDelete = allTalukas.find(taluka => taluka.id === selectedTalukaId);
      setToastMessage(`Taluka "${talukaToDelete?.name || selectedTalukaId}" deleted successfully`);
      setShowToast(true);
      setSelectedTalukaId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedTalukaId(null);
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

  const handleSaveTaluka = () => {
    if (formData.name) {
      if (modalMode === 'add') {
        // Generate a new ID for the taluka
        const newId = `taluka-${Date.now()}`;
        
        // Create the new taluka object
        const newTaluka: TalukaData = {
          id: newId,
          name: formData.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Add the new taluka to the state
        setAllTalukas(prevTalukas => [...prevTalukas, newTaluka]);
        
        setToastMessage(`Taluka "${formData.name}" created successfully`);
        setShowToast(true);
      } else if (modalMode === 'edit' && selectedTaluka) {
        // Update the taluka in the state
        setAllTalukas(prevTalukas => 
          prevTalukas.map(taluka => 
            taluka.id === selectedTaluka.id 
              ? { ...taluka, name: formData.name, updatedAt: new Date().toISOString() }
              : taluka
          )
        );
        
        setToastMessage(`Taluka "${formData.name}" updated successfully`);
        setShowToast(true);
      }
      
      setShowModal(false);
      setSelectedTaluka(null);
      setFormData({ name: '' });
    } else {
      setToastMessage('Please fill in the taluka name');
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
                title="Taluka Master"
                subtitle="Manage taluka categories and their names"
              />

              {/* Enhanced Search and Actions */}
              <MasterControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search talukas by name..."
                viewMode={viewMode}
                onViewModeToggle={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                onAddNew={handleAddTaluka}
                addButtonText="Add New Taluka"
              />

              {/* Talukas Grid */}
              {viewMode === 'grid' ? (
                <div className="master-cards-grid" style={{ padding: '1rem' }}>
                  {currentTalukas.map((taluka) => (
                    <MasterCard
                      key={taluka.id}
                      id={taluka.id}
                      title={taluka.name}
                      subtitle="Taluka Region"
                      icon={locationOutline}
                      metaItems={[
                        {
                          icon: mapOutline,
                          label: "Code",
                          value: `TLK-${taluka.id.slice(-3)}`
                        },
                        {
                          icon: timeOutline,
                          label: "Status",
                          value: "Active"
                        }
                      ]}
                      onView={() => handleView(taluka)}
                      onEdit={() => handleEdit(taluka)}
                      onDelete={() => handleDelete(taluka.id)}
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
                              <span>Region Code</span>
                              <IonIcon icon={searchOutline} className="filter-icon" />
                            </div>
                          </th>
                          <th>
                            <div className="table-header">
                              <span>Icon</span>
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
                        {currentTalukas.map((taluka, index) => (
                          <tr key={taluka.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td className="name-cell">
                              <div className="page-name">
                                <IonIcon icon={locationOutline} className="page-icon" />
                                <span>{taluka.name}</span>
                              </div>
                            </td>
                            <td className="url-cell">
                              <code className="url-code">TLK-{taluka.id.slice(-3)}</code>
                            </td>
                            <td className="icon-cell">
                              <div className="icon-display">
                                <IonIcon icon={locationOutline} className="display-icon" />
                                <span className="icon-name">locationOutline</span>
                              </div>
                            </td>
                            <td className="actions-cell">
                              <div className="action-buttons">
                                <ActionDropdown
                                  itemId={taluka.id}
                                  onView={() => handleView(taluka)}
                                  onEdit={() => handleEdit(taluka)}
                                  onDelete={() => handleDelete(taluka.id)}
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
              {filteredAndSortedTalukas.length > 0 && (
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
        message="Are you sure you want to delete this taluka? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Unified Taluka Modal */}
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              {modalMode === 'add' ? 'Add New Taluka' : 
               modalMode === 'edit' ? 'Edit Taluka' : 
               'View Taluka Details'}
            </IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            {modalMode === 'view' ? (
              // View Mode
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
                    icon={locationOutline} 
                    style={{ fontSize: '3rem', marginBottom: '1rem' }} 
                  />
                  <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>
                    {formData.name}
                  </h1>
                  <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
                    Taluka Region Details
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
                          <span style={{ fontWeight: '600', color: '#555' }}>Taluka Name:</span>
                          <span style={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                          }}>
                            {formData.name}
                          </span>
                        </div>
                        {selectedTaluka && (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: '600', color: '#555' }}>Taluka ID:</span>
                              <code style={{ 
                                background: '#f5f5f5',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                color: '#666'
                              }}>
                                {selectedTaluka.id}
                              </code>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: '600', color: '#555' }}>Region Code:</span>
                              <span style={{ 
                                background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                              }}>
                                TLK-{selectedTaluka.id.slice(-3)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </IonCardContent>
                  </IonCard>

                  {/* Status and Metadata Card */}
                  {selectedTaluka && (
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
                              {new Date(selectedTaluka.createdAt).toLocaleDateString('en-US', {
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
                              {new Date(selectedTaluka.updatedAt).toLocaleDateString('en-US', {
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
                  )}

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
                        setModalMode('edit');
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
                        handleCopyName(formData.name);
                      }}
                    >
                      <IonIcon icon={copyOutline} slot="start" />
                      Copy Name
                    </IonButton>
                  </div>
                </div>
              </>
            ) : (
              // Add/Edit Mode
              <>
                <h2 style={{ marginBottom: '1.5rem', color: '#667eea', textAlign: 'center' }}>
                  {modalMode === 'add' ? 'Create New Taluka' : `Edit Taluka: ${selectedTaluka?.name}`}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <IonLabel style={{ 
                      display: 'block', 
                      marginBottom: '0.75rem', 
                      fontWeight: '600', 
                      color: '#333',
                      fontSize: '1rem'
                    }}>
                      Taluka Name
                    </IonLabel>
                    <IonInput
                      value={formData.name}
                      onIonInput={(e) => setFormData({...formData, name: e.detail.value!})}
                      placeholder="Enter taluka name"
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
                      '--background': modalMode === 'add' 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                      '--color': 'white',
                      '--border-radius': '12px',
                      '--padding-top': '12px',
                      '--padding-bottom': '12px',
                      marginTop: '1rem'
                    }}
                    onClick={handleSaveTaluka}
                  >
                    <IonIcon icon={checkmarkOutline} slot="start" />
                    {modalMode === 'add' ? 'Create Taluka' : 'Update Taluka'}
                  </IonButton>
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

export default TalukaMaster;
