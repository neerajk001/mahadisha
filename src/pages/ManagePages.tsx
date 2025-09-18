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
  documentTextOutline, globeOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import ActionDropdown from '../admin/components/common/ActionDropdown';
import { mockDataService } from '../services/api';
import type { PageData } from '../types';
import './ManagePages.css';

const ManagePages: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Enhanced state for new functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingPage, setEditingPage] = useState<PageData | null>(null);
  const [viewingPage, setViewingPage] = useState<PageData | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', url: '', icon: '' });
  const [addFormData, setAddFormData] = useState({ name: '', url: '', icon: '' });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'url' | 'icon'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 6;

  // State for managing pages data
  const [allPages, setAllPages] = useState<PageData[]>(() => mockDataService.getPageData());
  
  // Filter and sort pages
  const filteredAndSortedPages = useMemo(() => {
    let filtered = allPages.filter(page =>
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort pages
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
  }, [allPages, searchQuery, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedPages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPages = filteredAndSortedPages.slice(startIndex, endIndex);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'keyOutline': return keyOutline;
      case 'homeOutline': return homeOutline;
      case 'gitBranchOutline': return gitBranchOutline;
      case 'shieldOutline': return shieldOutline;
      case 'shuffleOutline': return shuffleOutline;
      case 'barChartOutline': return barChartOutline;
      case 'fileTrayOutline': return fileTrayOutline;
      case 'accessibilityOutline': return accessibilityOutline;
      default: return homeOutline;
    }
  };

  const handleAddPage = () => {
    setShowAddModal(true);
  };

  const handleSaveNewPage = () => {
    if (addFormData.name && addFormData.url) {
      // Generate a new ID for the page
      const newId = `page-${Date.now()}`;
      
      // Create the new page object
      const newPage: PageData = {
        id: newId,
        name: addFormData.name,
        url: addFormData.url,
        icon: addFormData.icon || 'documentTextOutline',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add the new page to the state
      setAllPages(prevPages => [...prevPages, newPage]);
      
      setToastMessage(`Page "${addFormData.name}" created successfully`);
      setShowToast(true);
      setShowAddModal(false);
      setAddFormData({ name: '', url: '', icon: '' });
    } else {
      setToastMessage('Please fill in all required fields');
      setShowToast(true);
    }
  };

  const handleEdit = (page: PageData) => {
    setEditingPage(page);
    setEditFormData({
      name: page.name,
      url: page.url,
      icon: page.icon
    });
    setShowEditModal(true);
  };

  const handleView = (page: PageData) => {
    setViewingPage(page);
    setShowViewModal(true);
  };

  const handleUpdatePage = () => {
    if (editingPage) {
      // Update the page in the state
      setAllPages(prevPages => 
        prevPages.map(page => 
          page.id === editingPage.id 
            ? { ...page, name: editFormData.name, url: editFormData.url, icon: editFormData.icon, updatedAt: new Date().toISOString() }
            : page
        )
      );
      
      setToastMessage(`Page "${editFormData.name}" updated successfully`);
      setShowToast(true);
      setShowEditModal(false);
      setEditingPage(null);
      setEditFormData({ name: '', url: '', icon: '' });
    }
  };


  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setToastMessage('URL copied to clipboard');
    setShowToast(true);
  };

  const handleDelete = (pageId: string) => {
    setSelectedPageId(pageId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedPageId) {
      // Get the page name before deletion for the toast message
      const pageToDelete = allPages.find(page => page.id === selectedPageId);
      
      // Actually remove the page from the state
      setAllPages(prevPages => prevPages.filter(page => page.id !== selectedPageId));
      
      setToastMessage(`Page "${pageToDelete?.name || selectedPageId}" deleted successfully`);
      setShowToast(true);
      setSelectedPageId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedPageId(null);
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
                <h1>Manage Pages</h1>
                <p>Configure and manage system pages, routes, and navigation</p>
              </div>

              {/* Enhanced Search and Actions */}
              <div className="pages-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search pages by name or URL..."
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
                  onClick={handleAddPage}
                >
                  <IonIcon icon={addOutline} />
                  Add New Page
                </IonButton>
              </div>

              {/* Pages Grid */}
              {viewMode === 'grid' ? (
                <div className="branches-grid">
                  {currentPages.map((page) => (
                    <div key={page.id} className="branch-card">
                      <div className="branch-card-header">
                        <div className="branch-card-icon">
                          <IonIcon icon={getIconComponent(page.icon)} />
                        </div>
                        <div className="branch-card-title">
                          <h3 className="branch-card-name">{page.name}</h3>
                          <div className="branch-card-type">{page.url}</div>
                        </div>
                      </div>
                      
                      <div className="branch-card-content">
                        <div className="branch-card-meta">
                          <div className="branch-card-meta-item">
                            <IonIcon icon={documentTextOutline} className="branch-card-meta-icon" />
                            <span>Icon: {page.icon}</span>
                          </div>
                        </div>
                        
                        <div className="branch-card-meta">
                          <div className="branch-card-meta-item">
                            <IonIcon icon={timeOutline} className="branch-card-meta-icon" />
                            <span>Status: Active</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="branch-card-actions">
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button view"
                          onClick={() => handleView(page)}
                        >
                          <IonIcon icon={eyeOutline} />
                          View
                        </IonButton>
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button edit"
                          onClick={() => handleEdit(page)}
                        >
                          <IonIcon icon={createOutline} />
                          Edit
                        </IonButton>
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button delete"
                          onClick={() => handleDelete(page.id)}
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
                              <span>URL</span>
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
                        {currentPages.map((page, index) => (
                          <tr key={page.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td className="name-cell">
                              <div className="page-name">
                                <IonIcon icon={getIconComponent(page.icon)} className="page-icon" />
                                <span>{page.name}</span>
                              </div>
                            </td>
                            <td className="url-cell">
                              <code className="url-code">{page.url}</code>
                            </td>
                            <td className="icon-cell">
                              <div className="icon-display">
                                <IonIcon icon={getIconComponent(page.icon)} className="display-icon" />
                                <span className="icon-name">{page.icon}</span>
                              </div>
                            </td>
                            <td className="actions-cell">
                              <div className="action-buttons">
                                <ActionDropdown
                                  itemId={page.id}
                                  onView={() => handleView(page)}
                                  onEdit={() => handleEdit(page)}
                                  onDelete={() => handleDelete(page.id)}
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

              {/* Pagination - Show if there are pages */}
              {filteredAndSortedPages.length > 0 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    <p>
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedPages.length)} of {filteredAndSortedPages.length} pages
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

      {/* Delete Confirmation Alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={cancelDelete}
        header="Confirm Delete"
        message="Are you sure you want to delete this page? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Add Page Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Page</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Create New Page</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Page Name"
                labelPlacement="stacked"
                placeholder="Enter page name"
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonInput
                label="Page URL"
                labelPlacement="stacked"
                placeholder="/page-url"
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonSelect
                label="Icon"
                labelPlacement="stacked"
                placeholder="Select icon"
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              >
                <IonSelectOption value="homeOutline">Home</IonSelectOption>
                <IonSelectOption value="documentTextOutline">Document</IonSelectOption>
                <IonSelectOption value="settingsOutline">Settings</IonSelectOption>
                <IonSelectOption value="personOutline">People</IonSelectOption>
              </IonSelect>
              <IonButton 
                expand="block" 
                style={{ 
                  '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '--color': 'white',
                  '--border-radius': '12px',
                  marginTop: '1rem'
                }}
                onClick={() => {
                  setToastMessage('New page created successfully');
                  setShowToast(true);
                  setShowAddModal(false);
                }}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Create Page
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Page Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Page</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Edit Page: {editingPage?.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <IonInput
                label="Page Name"
                labelPlacement="stacked"
                value={editFormData.name}
                onIonInput={(e) => setEditFormData({...editFormData, name: e.detail.value!})}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonInput
                label="Page URL"
                labelPlacement="stacked"
                value={editFormData.url}
                onIonInput={(e) => setEditFormData({...editFormData, url: e.detail.value!})}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              />
              <IonSelect
                label="Icon"
                labelPlacement="stacked"
                value={editFormData.icon}
                onSelectionChange={(e) => setEditFormData({...editFormData, icon: e.detail.value})}
                style={{ '--background': 'rgba(255, 255, 255, 0.9)', '--border-radius': '12px' }}
              >
                <IonSelectOption value="homeOutline">Home</IonSelectOption>
                <IonSelectOption value="keyOutline">Key</IonSelectOption>
                <IonSelectOption value="gitBranchOutline">Git Branch</IonSelectOption>
                <IonSelectOption value="shieldOutline">Shield</IonSelectOption>
                <IonSelectOption value="barChartOutline">Bar Chart</IonSelectOption>
                <IonSelectOption value="fileTrayOutline">File Tray</IonSelectOption>
                <IonSelectOption value="accessibilityOutline">Accessibility</IonSelectOption>
              </IonSelect>
              <IonButton 
                expand="block" 
                style={{ 
                  '--background': 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                  '--color': 'white',
                  '--border-radius': '12px',
                  marginTop: '1rem'
                }}
                onClick={handleUpdatePage}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Update Page
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* View Page Modal */}
      <IonModal isOpen={showViewModal} onDidDismiss={() => setShowViewModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>View Page Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowViewModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Page Details: {viewingPage?.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Page Name</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0'
                }}>
                  {viewingPage?.name}
                </div>
              </div>
              
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Page URL</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  fontFamily: 'monospace'
                }}>
                  {viewingPage?.url}
                </div>
              </div>
              
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Icon</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <IonIcon icon={getIconComponent(viewingPage?.icon || '')} style={{ fontSize: '1.5rem' }} />
                  <span>{viewingPage?.icon}</span>
                </div>
              </div>
              
              <div className="view-field">
                <h3 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '1rem' }}>Status</h3>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0'
                }}>
                  <span style={{ 
                    color: '#4caf50', 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: '#4caf50' 
                    }}></div>
                    Active
                  </span>
                </div>
              </div>
              
              <IonButton 
                expand="block" 
                fill="outline"
                style={{ 
                  '--border-color': '#667eea',
                  '--color': '#667eea',
                  '--border-radius': '12px',
                  marginTop: '1rem'
                }}
                onClick={() => setShowViewModal(false)}
              >
                <IonIcon icon={closeOutline} slot="start" />
                Close
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Add Page Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Page</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '1rem' }}>
            <IonInput
              label="Page Name"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Enter page name"
              value={addFormData.name}
              onIonInput={(e) => setAddFormData(prev => ({ ...prev, name: e.detail.value! }))}
            />
            <IonInput
              label="Page URL"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Enter page URL"
              value={addFormData.url}
              onIonInput={(e) => setAddFormData(prev => ({ ...prev, url: e.detail.value! }))}
            />
            <IonSelect
              label="Icon"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Select an icon"
              value={addFormData.icon}
              onIonChange={(e) => setAddFormData(prev => ({ ...prev, icon: e.detail.value }))}
            >
              <IonSelectOption value="homeOutline">Home</IonSelectOption>
              <IonSelectOption value="documentTextOutline">Document</IonSelectOption>
              <IonSelectOption value="settingsOutline">Settings</IonSelectOption>
              <IonSelectOption value="keyOutline">Key</IonSelectOption>
              <IonSelectOption value="shieldOutline">Shield</IonSelectOption>
              <IonSelectOption value="globeOutline">Globe</IonSelectOption>
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
                onClick={handleSaveNewPage}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Save Page
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Page Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Page</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '1rem' }}>
            <IonInput
              label="Page Name"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Enter page name"
              value={editFormData.name}
              onIonInput={(e) => setEditFormData(prev => ({ ...prev, name: e.detail.value! }))}
            />
            <IonInput
              label="Page URL"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Enter page URL"
              value={editFormData.url}
              onIonInput={(e) => setEditFormData(prev => ({ ...prev, url: e.detail.value! }))}
            />
            <IonSelect
              label="Icon"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Select an icon"
              value={editFormData.icon}
              onIonChange={(e) => setEditFormData(prev => ({ ...prev, icon: e.detail.value }))}
            >
              <IonSelectOption value="homeOutline">Home</IonSelectOption>
              <IonSelectOption value="documentTextOutline">Document</IonSelectOption>
              <IonSelectOption value="settingsOutline">Settings</IonSelectOption>
              <IonSelectOption value="keyOutline">Key</IonSelectOption>
              <IonSelectOption value="shieldOutline">Shield</IonSelectOption>
              <IonSelectOption value="globeOutline">Globe</IonSelectOption>
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
                onClick={handleUpdatePage}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Update Page
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Floating Action Button */}
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton className="fab-add-page" onClick={handleAddPage}>
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

export default ManagePages;