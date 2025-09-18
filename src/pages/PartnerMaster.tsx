import React, { useState, useMemo, useEffect } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonButtons, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonBadge, IonChip, IonFab, IonFabButton
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  eyeOutline, settingsOutline, copyOutline, linkOutline, timeOutline,
  peopleOutline, documentTextOutline, globeOutline, locationOutline,
  mapOutline, businessOutline, barChartOutline, fileTrayOutline, accessibilityOutline,
  keyOutline, homeOutline, gitBranchOutline, shieldOutline, shuffleOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import ActionDropdown from '../admin/components/common/ActionDropdown';
import { mockDataService } from '../services/api';
import type { PartnerMasterData } from '../types';
import './PartnerMaster.css';
import './shared/MasterMobile.css';

const PartnerMaster: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerMasterData | null>(null);

  // Forms
  const [editForm, setEditForm] = useState({
    name: '',
    address: '',
    contact: ''
  });
  const [addForm, setAddForm] = useState({
    name: '',
    address: '',
    contact: ''
  });

  // Enhanced state for new functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'address' | 'contact'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 5;

  // Writable source of truth (simulate realtime locally)
  const [partners, setPartners] = useState<PartnerMasterData[]>(
    () => mockDataService.getPartnerMasterData()
  );

  // Use the writable state everywhere below
  const allPartners = partners;

  // Filter and sort partners
  const filteredAndSortedPartners = useMemo(() => {
    let filtered = allPartners.filter(partner =>
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.contact.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort partners
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
  }, [allPartners, searchQuery, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedPartners.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPartners = filteredAndSortedPartners.slice(startIndex, endIndex);

  // Keep page in range after filtering/deleting
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // Reset to first page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'peopleOutline': return peopleOutline;
      case 'businessOutline': return businessOutline;
      case 'locationOutline': return locationOutline;
      case 'globeOutline': return globeOutline;
      case 'homeOutline': return homeOutline;
      default: return peopleOutline;
    }
  };

  const handleAddPartner = () => {
    setAddForm({ name: '', address: '', contact: '' });
    setShowAddModal(true);
  };

  const handleView = (partner: PartnerMasterData) => {
    setToastMessage(`Viewing partner: ${partner.name}`);
    setShowToast(true);
  };

  const handleCopyName = (partnerName: string) => {
    navigator.clipboard.writeText(partnerName);
    setToastMessage('Partner name copied to clipboard');
    setShowToast(true);
  };

  // CREATE (UI simulation)
  const handleSavePartner = () => {
    const name = addForm.name.trim();
    const address = addForm.address.trim();
    const contact = addForm.contact.trim();

    if (!name) {
      setToastMessage('Please enter partner name');
      setShowToast(true);
      return;
    }

    const newPartner: PartnerMasterData = {
      id: (crypto as any)?.randomUUID?.() ?? String(Date.now()),
      name,
      address,
      contact
    };

    setPartners(prev => [newPartner, ...prev]);
    setToastMessage('Partner saved successfully');
    setShowToast(true);
    setShowAddModal(false);
    setAddForm({ name: '', address: '', contact: '' });
    setCurrentPage(1); // show newly added on first page
  };

  const handleEdit = (partnerId: string) => {
    const partner = allPartners.find(p => p.id === partnerId);
    if (partner) {
      setEditingPartner(partner);
      setEditForm({
        name: partner.name,
        address: partner.address,
        contact: partner.contact
      });
      setShowEditModal(true);
    }
  };

  // UPDATE (UI simulation)
  const handleSaveEdit = () => {
    if (!editingPartner) return;

    const name = editForm.name.trim();
    const address = editForm.address.trim();
    const contact = editForm.contact.trim();

    if (!name) {
      setToastMessage('Please enter partner name');
      setShowToast(true);
      return;
    }

    setPartners(prev =>
      prev.map(p =>
        p.id === editingPartner.id
          ? { ...p, name, address, contact }
          : p
      )
    );

    setToastMessage(`Partner "${name}" updated successfully`);
    setShowToast(true);
    setShowEditModal(false);
    setEditingPartner(null);
    setEditForm({ name: '', address: '', contact: '' });
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingPartner(null);
    setEditForm({ name: '', address: '', contact: '' });
  };

  const handleDelete = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    setShowDeleteAlert(true);
  };

  // DELETE (UI simulation)
  const confirmDelete = () => {
    if (selectedPartnerId) {
      setPartners(prev => prev.filter(p => p.id !== selectedPartnerId));
      setToastMessage('Partner deleted');
      setShowToast(true);
      setSelectedPartnerId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedPartnerId(null);
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
                <h1>Partner Master</h1>
                <p>Manage partner organizations and their details</p>
              </div>

              {/* Enhanced Search and Actions */}
              <div className="pages-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search partners by name, address, or contact..."
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
                  onClick={handleAddPartner}
                >
                  <IonIcon icon={addOutline} />
                  Add New Partner
                </IonButton>
              </div>

              {/* Partners Grid */}
              {viewMode === 'grid' ? (
                <div className="branches-grid">
                  {currentPartners.map((partner) => (
                    <div key={partner.id} className="branch-card">
                      <div className="branch-card-header">
                        <div className="branch-card-icon">
                          <IonIcon icon={peopleOutline} />
                        </div>
                        <div className="branch-card-title">
                          <h3 className="branch-card-name">{partner.name}</h3>
                          <div className="branch-card-type">Partner Organization</div>
                        </div>
                      </div>
                      
                      <div className="branch-card-content">
                        <div className="branch-card-meta">
                          <div className="branch-card-meta-item">
                            <IonIcon icon={locationOutline} className="branch-card-meta-icon" />
                            <span>Address: {partner.address}</span>
                          </div>
                        </div>
                        
                        <div className="branch-card-meta">
                          <div className="branch-card-meta-item">
                            <IonIcon icon={documentTextOutline} className="branch-card-meta-icon" />
                            <span>Contact: {partner.contact}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="branch-card-actions">
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button view"
                          onClick={() => handleView(partner)}
                        >
                          <IonIcon icon={eyeOutline} />
                          View
                        </IonButton>
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button edit"
                          onClick={() => handleEdit(partner.id)}
                        >
                          <IonIcon icon={createOutline} />
                          Edit
                        </IonButton>
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button delete"
                          onClick={() => handleDelete(partner.id)}
                        >
                          <IonIcon icon={trashOutline} />
                          Delete
                        </IonButton>
                      </div>
                    </div>
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
                              <span>Address</span>
                              <IonIcon icon={searchOutline} className="filter-icon" />
                            </div>
                          </th>
                          <th>
                            <div className="table-header">
                              <span>Contact</span>
                              <IonIcon icon={searchOutline} className="filter-icon" />
                            </div>
                          </th>
                          <th>
                            <div className="table-header">
                              <span>Partner Code</span>
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
                        {currentPartners.map((partner, index) => (
                          <tr key={partner.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td className="name-cell">
                              <div className="page-name">
                                <IonIcon icon={peopleOutline} className="page-icon" />
                                <span>{partner.name}</span>
                              </div>
                            </td>
                            <td className="url-cell">
                              <span className="partner-address">{partner.address}</span>
                            </td>
                            <td className="url-cell">
                              <span className="partner-contact">{partner.contact}</span>
                            </td>
                            <td className="url-cell">
                              <code className="url-code">PART-{partner.id.slice(-3)}</code>
                            </td>
                            <td className="icon-cell">
                              <div className="icon-display">
                                <IonIcon icon={peopleOutline} className="display-icon" />
                                <span className="icon-name">peopleOutline</span>
                              </div>
                            </td>
                            <td className="actions-cell">
                              <div className="action-buttons">
                                <ActionDropdown
                                  itemId={partner.id}
                                  onView={() => handleView(partner)}
                                  onEdit={() => handleEdit(partner.id)}
                                  onDelete={() => handleDelete(partner.id)}
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
              <div className="pagination-container">
                <div className="pagination-info">
                  <p>
                    Showing {filteredAndSortedPartners.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredAndSortedPartners.length)} of {filteredAndSortedPartners.length} partners
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

      {/* Add Partner Modal (controlled) */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Partner</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Create New Partner</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Partner Name"
                labelPlacement="stacked"
                placeholder="Enter partner name"
                value={addForm.name}
                onIonChange={(e) => setAddForm(f => ({ ...f, name: e.detail.value ?? '' }))}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonInput
                label="Address"
                labelPlacement="stacked"
                placeholder="Enter address"
                value={addForm.address}
                onIonChange={(e) => setAddForm(f => ({ ...f, address: e.detail.value ?? '' }))}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonInput
                label="Contact Number"
                labelPlacement="stacked"
                placeholder="Enter contact number"
                value={addForm.contact}
                onIonChange={(e) => setAddForm(f => ({ ...f, contact: e.detail.value ?? '' }))}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonTextarea
                label="Description (Optional)"
                labelPlacement="stacked"
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
                onClick={handleSavePartner}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Create Partner
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Partner Modal (controlled) */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Partner</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Edit Partner: {editingPartner?.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Partner Name"
                labelPlacement="stacked"
                value={editForm.name}
                onIonChange={(e) => setEditForm({...editForm, name: e.detail.value ?? ''})}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonInput
                label="Address"
                labelPlacement="stacked"
                value={editForm.address}
                onIonChange={(e) => setEditForm({...editForm, address: e.detail.value ?? ''})}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonInput
                label="Contact Number"
                labelPlacement="stacked"
                value={editForm.contact}
                onIonChange={(e) => setEditForm({...editForm, contact: e.detail.value ?? ''})}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonTextarea
                label="Description (Optional)"
                labelPlacement="stacked"
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
                onClick={handleSaveEdit}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Update Partner
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
        message="Are you sure you want to delete this partner? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Floating Action Button */}
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton className="fab-add-page" onClick={handleAddPartner}>
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

export default PartnerMaster;
