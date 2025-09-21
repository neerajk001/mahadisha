import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonButtons, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonBadge, IonChip
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
import { MasterCard, MasterControls, MasterHeader } from '../../components/shared';
import { mockDataService } from '../../services/api';
import type { TalukaData } from '../../types';
import './TalukaMaster.css';

const TalukaMaster: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedTalukaId, setSelectedTalukaId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Enhanced state for new functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTaluka, setEditingTaluka] = useState<TalukaData | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', district: '', description: '' });
  const [addFormData, setAddFormData] = useState({ name: '', district: '', description: '' });
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
    setShowAddModal(true);
  };

  const handleEdit = (taluka: TalukaData) => {
    setEditingTaluka(taluka);
    setEditFormData({
      name: taluka.name,
      district: taluka.district || '',
      description: taluka.description || ''
    });
    setShowEditModal(true);
  };

  const handleView = (taluka: TalukaData) => {
    setToastMessage(`Viewing taluka: ${taluka.name}`);
    setShowToast(true);
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

  const handleSaveNewTaluka = () => {
    if (addFormData.name) {
      // Generate a new ID for the taluka
      const newId = `taluka-${Date.now()}`;
      
      // Create the new taluka object
      const newTaluka: TalukaData = {
        id: newId,
        name: addFormData.name,
        district: addFormData.district || '',
        description: addFormData.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add the new taluka to the state
      setAllTalukas(prevTalukas => [...prevTalukas, newTaluka]);
      
      setToastMessage(`Taluka "${addFormData.name}" created successfully`);
      setShowToast(true);
      setShowAddModal(false);
      setAddFormData({ name: '', district: '', description: '' });
    } else {
      setToastMessage('Please fill in the taluka name');
      setShowToast(true);
    }
  };

  const handleUpdateTaluka = () => {
    if (editingTaluka && editFormData.name) {
      // Update the taluka in the state
      setAllTalukas(prevTalukas => 
        prevTalukas.map(taluka => 
          taluka.id === editingTaluka.id 
            ? { ...taluka, name: editFormData.name, district: editFormData.district, description: editFormData.description, updatedAt: new Date().toISOString() }
            : taluka
        )
      );
      
      setToastMessage(`Taluka "${editFormData.name}" updated successfully`);
      setShowToast(true);
      setShowEditModal(false);
      setEditingTaluka(null);
      setEditFormData({ name: '', district: '', description: '' });
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
                <IonCard className="pages-table-card">
                  <IonCardContent className="table-container">
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
                  </IonCardContent>
                </IonCard>
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

      {/* Add Taluka Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Taluka</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Create New Taluka</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Taluka Name"
                labelPlacement="stacked"
                value={addFormData.name}
                onIonInput={(e) => setAddFormData({...addFormData, name: e.detail.value!})}
                placeholder="Enter taluka name"
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonInput
                label="District"
                labelPlacement="stacked"
                value={addFormData.district}
                onIonInput={(e) => setAddFormData({...addFormData, district: e.detail.value!})}
                placeholder="Enter district name"
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonTextarea
                label="Description (Optional)"
                labelPlacement="stacked"
                value={addFormData.description}
                onIonInput={(e) => setAddFormData({...addFormData, description: e.detail.value!})}
                placeholder="Enter description"
                rows={3}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonButton 
                expand="block" 
                style={{ 
                  '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '--color': 'white',
                  '--border-radius': '12px',
                  marginTop: '1rem'
                }}
                onClick={handleSaveNewTaluka}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Create Taluka
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Taluka Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Taluka</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Edit Taluka: {editingTaluka?.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Taluka Name"
                labelPlacement="stacked"
                value={editFormData.name}
                onIonInput={(e) => setEditFormData({...editFormData, name: e.detail.value!})}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonInput
                label="District"
                labelPlacement="stacked"
                value={editFormData.district}
                onIonInput={(e) => setEditFormData({...editFormData, district: e.detail.value!})}
                placeholder="Enter district name"
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonTextarea
                label="Description (Optional)"
                labelPlacement="stacked"
                value={editFormData.description}
                onIonInput={(e) => setEditFormData({...editFormData, description: e.detail.value!})}
                placeholder="Enter description"
                rows={3}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonButton 
                expand="block" 
                style={{ 
                  '--background': 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                  '--color': 'white',
                  '--border-radius': '12px',
                  marginTop: '1rem'
                }}
                onClick={handleUpdateTaluka}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Update Taluka
              </IonButton>
            </div>
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
