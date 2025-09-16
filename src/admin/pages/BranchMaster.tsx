import React, { useState, useMemo } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonCheckbox, IonBadge, IonChip, IonButtons, IonPopover, IonList, IonToggle,
  IonRange, IonDatetime, IonText, IonFab, IonFabButton
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  downloadOutline, refreshOutline, eyeOutline, settingsOutline,
  arrowUpOutline, arrowDownOutline, appsOutline, gridOutline, listOutline,
  cloudDownloadOutline, shareOutline, filterOutline, businessOutline, timeOutline
} from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import ActionDropdown from '../components/common/ActionDropdown';
import { mockDataService } from '../../services/api';
import type { BranchData } from '../../types';
import './BranchMaster.css';

const BranchMaster: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    officeType: '',
    dateRange: { start: '', end: '' },
    sortBy: 'officeName',
    sortOrder: 'asc' as 'asc' | 'desc'
  });
  
  // Bulk operations state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showBulkDeleteAlert, setShowBulkDeleteAlert] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [showExportModal, setShowExportModal] = useState(false);
  
  // RBAC modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingBranch, setViewingBranch] = useState<BranchData | null>(null);
  const [addForm, setAddForm] = useState({
    officeName: '',
    officeType: '',
    description: '',
    permissions: [] as string[]
  });

  const itemsPerPage = 5;

  // Get branch data from mock service
  const allBranches = mockDataService.getBranchData();
  
  // Filter and sort branches based on search query and advanced filters
  const filteredAndSortedBranches = useMemo(() => {
    let filtered = allBranches.filter(branch => {
      const matchesSearch = branch.officeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           branch.officeType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesOfficeType = !advancedFilters.officeType || 
                               branch.officeType === advancedFilters.officeType;
      
      const matchesDateRange = !advancedFilters.dateRange.start || 
                              (branch.createdAt >= advancedFilters.dateRange.start && 
                               branch.createdAt <= advancedFilters.dateRange.end);
      
      return matchesSearch && matchesOfficeType && matchesDateRange;
    });
    
    // Sort the filtered results
    filtered.sort((a, b) => {
      const aValue = a[advancedFilters.sortBy as keyof BranchData];
      const bValue = b[advancedFilters.sortBy as keyof BranchData];
      
      if (advancedFilters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return filtered;
  }, [allBranches, searchQuery, advancedFilters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedBranches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBranches = filteredAndSortedBranches.slice(startIndex, endIndex);

  // Bulk operations handlers
  const handleSelectAll = () => {
    if (selectedItems.size === currentBranches.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(currentBranches.map(branch => branch.id)));
    }
  };

  const handleSelectItem = (branchId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(branchId)) {
      newSelected.delete(branchId);
    } else {
      newSelected.add(branchId);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkDelete = () => {
    setShowBulkDeleteAlert(true);
  };

  const confirmBulkDelete = () => {
    setToastMessage(`Deleted ${selectedItems.size} branches successfully`);
    setShowToast(true);
    setSelectedItems(new Set());
    setShowBulkActions(false);
    setShowBulkDeleteAlert(false);
  };

  const handleBulkExport = () => {
    setShowExportModal(true);
  };

  const handleExport = (format: string) => {
    setToastMessage(`Exporting ${selectedItems.size} branches as ${format}`);
    setShowToast(true);
    setShowExportModal(false);
  };

  // Advanced filter handlers
  const handleAdvancedFilterChange = (key: string, value: any) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      officeType: '',
      dateRange: { start: '', end: '' },
      sortBy: 'officeName',
      sortOrder: 'asc'
    });
  };

  // RBAC handlers
  const handleAddBranch = () => {
    setAddForm({ officeName: '', officeType: '', description: '', permissions: [] });
    setShowAddModal(true);
  };

  const handleSaveAdd = () => {
    if (!addForm.officeName.trim() || !addForm.officeType.trim()) {
      setToastMessage('Please fill in all required fields');
      setShowToast(true);
      return;
    }
    
    setToastMessage('Branch added successfully');
    setShowToast(true);
    setShowAddModal(false);
    setAddForm({ officeName: '', officeType: '', description: '', permissions: [] });
  };

  const handleCloseAdd = () => {
    setShowAddModal(false);
    setAddForm({ officeName: '', officeType: '', description: '', permissions: [] });
  };

  const handleEdit = (branchId: string) => {
    setToastMessage(`Edit branch ${branchId} functionality will be implemented`);
    setShowToast(true);
  };

  const handleView = (branchId: string) => {
    const branch = allBranches.find(b => b.id === branchId);
    if (branch) {
      setViewingBranch(branch);
      setShowViewModal(true);
    }
  };

  const handleCloseView = () => {
    setShowViewModal(false);
    setViewingBranch(null);
  };

  const handleDelete = (branchId: string) => {
    setSelectedBranchId(branchId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedBranchId) {
      setToastMessage(`Branch ${selectedBranchId} deleted successfully`);
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

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content" when="md">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="branch-master-content">
            <div className="branches-container">
              {/* Header Section */}
              <div className="branches-header">
                <h1>Branch Master</h1>
                <p>Manage office branches and their types</p>
              </div>

              {/* Search and Actions */}
              <div className="branches-actions">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search branches by name or type..."
                  className="branches-search"
                />
                <div className="action-buttons-group">
                  <IonButton 
                    fill="outline" 
                    size="default"
                    className="view-toggle-button"
                    onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                  >
                    <IonIcon icon={viewMode === 'table' ? gridOutline : listOutline} slot="start" />
                    {viewMode === 'table' ? 'Grid View' : 'Table View'}
                  </IonButton>
                  <IonButton 
                    fill="solid" 
                    size="default"
                    className="add-branch-button primary"
                    onClick={handleAddBranch}
                  >
                    <IonIcon icon={businessOutline} slot="start" />
                    Add Branch
                  </IonButton>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <IonCard className="advanced-filters-card">
                  <IonCardHeader>
                    <IonCardTitle>Advanced Filters</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="12" sizeMd="4">
                          <IonItem>
                            <IonLabel position="stacked">Office Type</IonLabel>
                            <IonSelect
                              value={advancedFilters.officeType}
                              onIonChange={(e) => handleAdvancedFilterChange('officeType', e.detail.value)}
                              placeholder="Select office type"
                            >
                              <IonSelectOption value="">All Types</IonSelectOption>
                              <IonSelectOption value="Head Office">Head Office</IonSelectOption>
                              <IonSelectOption value="Regional Office">Regional Office</IonSelectOption>
                              <IonSelectOption value="District Office">District Office</IonSelectOption>
                              <IonSelectOption value="Branch Office">Branch Office</IonSelectOption>
                            </IonSelect>
                          </IonItem>
                        </IonCol>
                        <IonCol size="12" sizeMd="4">
                          <IonItem>
                            <IonLabel position="stacked">Sort By</IonLabel>
                            <IonSelect
                              value={advancedFilters.sortBy}
                              onIonChange={(e) => handleAdvancedFilterChange('sortBy', e.detail.value)}
                            >
                              <IonSelectOption value="officeName">Office Name</IonSelectOption>
                              <IonSelectOption value="officeType">Office Type</IonSelectOption>
                              <IonSelectOption value="createdAt">Created Date</IonSelectOption>
                            </IonSelect>
                          </IonItem>
                        </IonCol>
                        <IonCol size="12" sizeMd="4">
                          <IonItem>
                            <IonLabel position="stacked">Sort Order</IonLabel>
                            <IonSelect
                              value={advancedFilters.sortOrder}
                              onIonChange={(e) => handleAdvancedFilterChange('sortOrder', e.detail.value)}
                            >
                              <IonSelectOption value="asc">Ascending</IonSelectOption>
                              <IonSelectOption value="desc">Descending</IonSelectOption>
                            </IonSelect>
                          </IonItem>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size="12">
                          <IonButton 
                            fill="outline" 
                            onClick={clearAdvancedFilters}
                          >
                            Clear Filters
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              )}

              {/* Bulk Actions Bar */}
              {selectedItems.size > 0 && (
                <IonCard className="bulk-actions-card">
                  <IonCardContent className="bulk-actions-content">
                    <div className="bulk-actions-info">
                      <IonText>
                        <h3>{selectedItems.size} item(s) selected</h3>
                      </IonText>
                    </div>
                    <div className="bulk-action-buttons">
                      <IonButton 
                        fill="outline" 
                        size="small"
                        onClick={handleBulkExport}
                      >
                        <IonIcon icon={cloudDownloadOutline} />
                        Export
                      </IonButton>
                      <IonButton 
                        fill="outline" 
                        size="small"
                        color="danger"
                        onClick={handleBulkDelete}
                      >
                        <IonIcon icon={trashOutline} />
                        Delete
                      </IonButton>
                      <IonButton 
                        fill="clear" 
                        size="small"
                        onClick={() => setSelectedItems(new Set())}
                      >
                        <IonIcon icon={closeOutline} />
                        Clear
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              )}

              {/* Branch View - Grid or Table */}
              {viewMode === 'grid' ? (
                <div className="branches-grid">
                  {currentBranches.map((branch) => (
                    <div key={branch.id} className="branch-card">
                      <div className="branch-card-header">
                        <div className="branch-card-icon">
                          <IonIcon icon={businessOutline} />
                        </div>
                        <div className="branch-card-title">
                          <h3 className="branch-card-name">{branch.officeName}</h3>
                          <div className="branch-card-type">{branch.officeType}</div>
                        </div>
                      </div>
                      
                      <div className="branch-card-content">
                        <div className="branch-card-meta">
                          <div className="branch-card-meta-item">
                            <IonIcon icon={businessOutline} className="branch-card-meta-icon" />
                            <span>Type: {branch.officeType}</span>
                          </div>
                        </div>
                        
                        <div className="branch-card-meta">
                          <div className="branch-card-meta-item">
                            <IonIcon icon={timeOutline} className="branch-card-meta-icon" />
                            <span>Created: {new Date(branch.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="branch-card-actions">
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button view"
                          onClick={() => handleView(branch.id)}
                        >
                          <IonIcon icon={eyeOutline} />
                          View
                        </IonButton>
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="branch-card-button edit"
                          onClick={() => handleEdit(branch.id)}
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
                    </div>
                  ))}
                </div>
              ) : (
                /* Table View */
                <IonCard className="branches-table-card">
                  <IonCardContent className="table-container">
                    <table className="branches-table">
                    <thead>
                      <tr>
                        <th className="checkbox-column">
                          <IonCheckbox
                            checked={selectedItems.size === currentBranches.length && currentBranches.length > 0}
                            onIonChange={handleSelectAll}
                          />
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Office Name</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Office Type</span>
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
                      {currentBranches.map((branch, index) => (
                        <tr key={branch.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="checkbox-column">
                            <IonCheckbox
                              checked={selectedItems.has(branch.id)}
                              onIonChange={() => handleSelectItem(branch.id)}
                            />
                          </td>
                          <td className="office-name-cell">
                            <span className="office-name">{branch.officeName}</span>
                          </td>
                          <td className="office-type-cell">
                            <span className="office-type">{branch.officeType}</span>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <ActionDropdown
                                itemId={branch.id}
                                onView={() => handleView(branch.id)}
                                onEdit={() => handleEdit(branch.id)}
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
                  </IonCardContent>
                </IonCard>
              )}

              {/* Pagination */}
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
        message="Are you sure you want to delete this branch? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Bulk Delete Confirmation Alert */}
      <IonAlert
        isOpen={showBulkDeleteAlert}
        onDidDismiss={() => setShowBulkDeleteAlert(false)}
        header="Confirm Bulk Delete"
        message={`Are you sure you want to delete ${selectedItems.size} branches? This action cannot be undone.`}
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: () => setShowBulkDeleteAlert(false) },
          { text: 'Delete', role: 'destructive', handler: confirmBulkDelete }
        ]}
      />

      {/* Export Modal */}
      <IonModal isOpen={showExportModal} onDidDismiss={() => setShowExportModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Export Branches</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowExportModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="export-modal-content">
          <div className="export-options">
            <IonButton 
              expand="block" 
              fill="outline"
              onClick={() => handleExport('CSV')}
            >
              <IonIcon icon={cloudDownloadOutline} slot="start" />
              Export as CSV
            </IonButton>
            <IonButton 
              expand="block" 
              fill="outline"
              onClick={() => handleExport('Excel')}
            >
              <IonIcon icon={cloudDownloadOutline} slot="start" />
              Export as Excel
            </IonButton>
            <IonButton 
              expand="block" 
              fill="outline"
              onClick={() => handleExport('PDF')}
            >
              <IonIcon icon={cloudDownloadOutline} slot="start" />
              Export as PDF
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* Add Branch Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={handleCloseAdd}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Branch</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleCloseAdd}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="modal-content">
          <IonItem>
            <IonLabel position="stacked">Office Name *</IonLabel>
            <IonInput
              value={addForm.officeName}
              onIonChange={(e) => setAddForm(prev => ({ ...prev, officeName: e.detail.value! }))}
              placeholder="Enter office name"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Office Type *</IonLabel>
            <IonSelect
              value={addForm.officeType}
              onIonChange={(e) => setAddForm(prev => ({ ...prev, officeType: e.detail.value }))}
              placeholder="Select office type"
            >
              <IonSelectOption value="Head Office">Head Office</IonSelectOption>
              <IonSelectOption value="Regional Office">Regional Office</IonSelectOption>
              <IonSelectOption value="District Office">District Office</IonSelectOption>
              <IonSelectOption value="Branch Office">Branch Office</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Description</IonLabel>
            <IonTextarea
              value={addForm.description}
              onIonChange={(e) => setAddForm(prev => ({ ...prev, description: e.detail.value! }))}
              placeholder="Enter description (optional)"
              rows={3}
            />
          </IonItem>
          <div className="modal-actions">
            <IonButton 
              expand="block" 
              fill="solid"
              onClick={handleSaveAdd}
            >
              <IonIcon icon={checkmarkOutline} slot="start" />
              Add Branch
            </IonButton>
            <IonButton 
              expand="block" 
              fill="outline"
              onClick={handleCloseAdd}
            >
              Cancel
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* View Branch Modal */}
      <IonModal isOpen={showViewModal} onDidDismiss={handleCloseView}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Branch Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleCloseView}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="view-modal-content">
          {viewingBranch && (
            <div>
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
                  <h2>Created At</h2>
                  <p>{new Date(viewingBranch.createdAt).toLocaleDateString()}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Updated At</h2>
                  <p>{new Date(viewingBranch.updatedAt).toLocaleDateString()}</p>
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

export default BranchMaster;
