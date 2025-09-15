import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonButtons, IonIcon, IonInput, IonItem, IonLabel, IonToast, IonCheckbox,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol,
  IonSearchbar, IonSelect, IonSelectOption, IonBadge, IonChip, IonAlert,
  IonToggle, IonTextarea, IonProgressBar, IonSpinner, IonRefresher, IonRefresherContent,
  IonSegment, IonSegmentButton, IonModal, IonList, IonDatetime, IonRange
} from '@ionic/react';
import { 
  saveOutline, closeOutline, checkmarkOutline, settingsOutline, searchOutline,
  refreshOutline, cloudUploadOutline, informationCircleOutline,
  warningOutline, checkmarkCircleOutline, timeOutline, filterOutline,
  eyeOutline, eyeOffOutline, copyOutline, arrowBackOutline, arrowForwardOutline,
  addOutline, trashOutline, createOutline, shieldCheckmarkOutline,
  serverOutline, speedometerOutline, personOutline, colorPaletteOutline,
  notificationsOutline, languageOutline, lockClosedOutline, wifiOutline,
  analyticsOutline, helpCircleOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { ConfigData } from '../types';
import './Config.css';

const Config: React.FC = () => {
  const [configData, setConfigData] = useState<ConfigData[]>(mockDataService.getConfigData());
  const [filteredData, setFilteredData] = useState<ConfigData[]>(configData);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newConfig, setNewConfig] = useState({ key: '', value: '', type: 'text', description: '' });
  const [systemMetrics, setSystemMetrics] = useState({
    uptime: '15 days, 8 hours',
    memoryUsage: 65,
    diskUsage: 42,
    activeUsers: 24,
    lastBackup: '2024-01-15 10:30:00'
  });

  // Initialize filtered data
  useEffect(() => {
    setFilteredData(configData);
  }, [configData]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = configData;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(config => config.type === filterType);
    }

    // Search functionality
    if (searchQuery.trim()) {
      filtered = filtered.filter(config => 
        config.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        config.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (config.description && config.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredData(filtered);
  }, [configData, searchQuery, filterType]);


  // Simulate real-time system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        memoryUsage: Math.floor(Math.random() * 20) + 60,
        diskUsage: Math.floor(Math.random() * 10) + 40,
        activeUsers: Math.floor(Math.random() * 10) + 20
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleEdit = (config: ConfigData) => {
    setEditingField(config.id);
    setTempValue(config.value);
  };

  const handleSave = (configId: string) => {
    setConfigData(prev => prev.map(config => 
      config.id === configId 
        ? { ...config, value: tempValue, updatedAt: new Date().toISOString() }
        : config
    ));
    setEditingField(null);
    setTempValue('');
    setToastMessage('Configuration saved successfully');
    setShowToast(true);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleClear = (configId: string) => {
    setConfigData(prev => prev.map(config => 
      config.id === configId 
        ? { ...config, value: '', updatedAt: new Date().toISOString() }
        : config
    ));
    setToastMessage('Configuration cleared');
    setShowToast(true);
  };

  const handleDelete = (configId: string) => {
    setConfigData(prev => prev.filter(config => config.id !== configId));
    setToastMessage('Configuration deleted');
    setShowToast(true);
  };

  const handleSaveAll = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setToastMessage('All configurations saved successfully');
    setShowToast(true);
  };

  const handleResetAll = () => {
    setAlertMessage('Are you sure you want to reset all configurations to their original values? This action cannot be undone.');
    setShowAlert(true);
  };

  const confirmReset = () => {
    setConfigData(prev => prev.map(config => ({
      ...config,
      value: config.originalValue || '',
      updatedAt: new Date().toISOString()
    })));
    setToastMessage('All configurations reset to original values');
    setShowToast(true);
    setShowAlert(false);
  };


  const handleImport = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          setConfigData(prev => prev.map(config => {
            const imported = importedData.find((item: any) => item.key === config.key);
            return imported ? { ...config, value: imported.value } : config;
          }));
          setToastMessage('Configuration imported successfully');
          setShowToast(true);
        } catch (error) {
          setToastMessage('Error importing configuration file');
          setShowToast(true);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAddConfig = () => {
    if (newConfig.key && newConfig.value) {
      const newId = `config_${Date.now()}`;
      const newConfigItem: ConfigData = {
        id: newId,
        key: newConfig.key,
        value: newConfig.value,
        type: newConfig.type as any,
        description: newConfig.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setConfigData(prev => [...prev, newConfigItem]);
      setNewConfig({ key: '', value: '', type: 'text', description: '' });
      setShowAddModal(false);
      setToastMessage('New configuration added');
      setShowToast(true);
    }
  };

  const togglePasswordVisibility = (configId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [configId]: !prev[configId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage('Copied to clipboard');
    setShowToast(true);
  };

  const handleRefresh = (event: CustomEvent) => {
    setTimeout(() => {
      setConfigData(mockDataService.getConfigData());
      event.detail.complete();
      setToastMessage('Configuration refreshed');
      setShowToast(true);
    }, 1000);
  };

  const renderInput = (config: ConfigData) => {
    if (editingField === config.id) {
      if (config.type === 'boolean') {
        return (
          <IonToggle
            checked={tempValue === 'true'}
            onIonChange={(e) => setTempValue(e.detail.checked.toString())}
            className="config-toggle"
          />
        );
      } else if (config.type === 'number') {
        return (
          <IonInput
            type="number"
            value={tempValue}
            onIonInput={(e) => setTempValue(e.detail.value!)}
            className="config-input"
            placeholder="Enter number value"
          />
        );
      } else if (config.type === 'email') {
        return (
          <IonInput
            type="email"
            value={tempValue}
            onIonInput={(e) => setTempValue(e.detail.value!)}
            className="config-input"
            placeholder="Enter email address"
          />
        );
      } else if (config.key.toLowerCase().includes('password') || config.key.toLowerCase().includes('secret')) {
        return (
          <div className="password-input-container">
            <IonInput
              type={showPasswords[config.id] ? 'text' : 'password'}
              value={tempValue}
              onIonInput={(e) => setTempValue(e.detail.value!)}
              className="config-input password-input"
              placeholder="Enter password"
            />
            <IonButton
              fill="clear"
              size="small"
              onClick={() => togglePasswordVisibility(config.id)}
              className="password-toggle"
            >
              <IonIcon icon={showPasswords[config.id] ? eyeOffOutline : eyeOutline} />
            </IonButton>
          </div>
        );
      } else if (config.key.toLowerCase().includes('description') || config.key.toLowerCase().includes('note')) {
        return (
          <IonTextarea
            value={tempValue}
            onIonInput={(e) => setTempValue(e.detail.value!)}
            className="config-textarea"
            placeholder="Enter description"
            rows={3}
          />
        );
      } else {
        return (
          <IonInput
            type="text"
            value={tempValue}
            onIonInput={(e) => setTempValue(e.detail.value!)}
            className="config-input"
            placeholder="Enter value"
          />
        );
      }
    } else {
      const isPassword = config.key.toLowerCase().includes('password') || config.key.toLowerCase().includes('secret');
      const displayValue = isPassword && !showPasswords[config.id] 
        ? '••••••••' 
        : config.value;

      return (
        <div className="config-value-display">
          <span className="config-value">{displayValue || 'Not set'}</span>
          {config.originalValue && config.value !== config.originalValue && (
            <span className="original-value">Original: {config.originalValue}</span>
          )}
          {config.description && (
            <span className="field-description">{config.description}</span>
          )}
        </div>
      );
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'boolean': return 'toggle';
      case 'number': return 'calculator';
      case 'email': return 'mail';
      default: return 'text';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'boolean': return 'primary';
      case 'number': return 'success';
      case 'email': return 'warning';
      default: return 'medium';
    }
  };

  const renderSystemInfo = () => (
    <div className="system-info-section">
      <IonGrid>
        <IonRow>
          <IonCol size="12" size-md="6">
            <IonCard className="status-card">
              <IonCardHeader>
                <IonCardTitle className="card-title">
                  <IonIcon icon={serverOutline} className="title-icon" />
                  System Status
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="status-item">
                  <IonIcon icon={checkmarkCircleOutline} className="status-icon online" />
                  <div className="status-content">
                    <span className="status-label">Server Status</span>
                    <IonChip color="success" className="status-chip">ONLINE</IonChip>
                  </div>
                </div>
                <div className="status-item">
                  <IonIcon icon={timeOutline} className="status-icon" />
                  <div className="status-content">
                    <span className="status-label">Uptime</span>
                    <span className="status-value">{systemMetrics.uptime}</span>
                  </div>
                </div>
                <div className="status-item">
                  <IonIcon icon={personOutline} className="status-icon" />
                  <div className="status-content">
                    <span className="status-label">Active Users</span>
                    <span className="status-value">{systemMetrics.activeUsers}</span>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>

          <IonCol size="12" size-md="6">
            <IonCard className="performance-card">
              <IonCardHeader>
                <IonCardTitle className="card-title">
                  <IonIcon icon={speedometerOutline} className="title-icon" />
                  Performance Metrics
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="metric-item">
                  <span className="metric-label">Memory Usage</span>
                  <div className="metric-progress">
                    <IonProgressBar value={systemMetrics.memoryUsage / 100} color="warning" />
                    <span className="metric-value">{systemMetrics.memoryUsage}%</span>
                  </div>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Disk Usage</span>
                  <div className="metric-progress">
                    <IonProgressBar value={systemMetrics.diskUsage / 100} color="success" />
                    <span className="metric-value">{systemMetrics.diskUsage}%</span>
                  </div>
                </div>
                <div className="metric-item">
                  <IonIcon icon={cloudUploadOutline} className="metric-icon" />
                  <div className="metric-content">
                    <span className="metric-label">Last Backup</span>
                    <span className="metric-value">{systemMetrics.lastBackup}</span>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );

  const renderUserPreferences = () => (
    <div className="user-preferences-section">
      <IonCard className="preferences-card">
        <IonCardHeader>
          <IonCardTitle className="card-title">
            <IonIcon icon={personOutline} className="title-icon" />
            User Preferences
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="preference-item">
            <div className="preference-content">
              <IonIcon icon={colorPaletteOutline} className="preference-icon" />
              <div className="preference-details">
                <span className="preference-label">Theme</span>
                <span className="preference-description">Choose your preferred color scheme</span>
              </div>
            </div>
            <IonSelect value="light" className="preference-select">
              <IonSelectOption value="light">Light</IonSelectOption>
              <IonSelectOption value="dark">Dark</IonSelectOption>
              <IonSelectOption value="auto">Auto</IonSelectOption>
            </IonSelect>
          </div>

          <div className="preference-item">
            <div className="preference-content">
              <IonIcon icon={languageOutline} className="preference-icon" />
              <div className="preference-details">
                <span className="preference-label">Language</span>
                <span className="preference-description">Select your preferred language</span>
              </div>
            </div>
            <IonSelect value="en" className="preference-select">
              <IonSelectOption value="en">English</IonSelectOption>
              <IonSelectOption value="hi">Hindi</IonSelectOption>
              <IonSelectOption value="mr">Marathi</IonSelectOption>
            </IonSelect>
          </div>

          <div className="preference-item">
            <div className="preference-content">
              <IonIcon icon={notificationsOutline} className="preference-icon" />
              <div className="preference-details">
                <span className="preference-label">Notifications</span>
                <span className="preference-description">Enable system notifications</span>
              </div>
            </div>
            <IonToggle checked={true} />
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="security-settings-section">
      <IonCard className="security-card">
        <IonCardHeader>
          <IonCardTitle className="card-title">
            <IonIcon icon={shieldCheckmarkOutline} className="title-icon" />
            Security Settings
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="security-item">
            <div className="security-content">
              <IonIcon icon={lockClosedOutline} className="security-icon" />
              <div className="security-details">
                <span className="security-label">Password Policy</span>
                <span className="security-description">Minimum 8 characters with special characters</span>
              </div>
            </div>
            <IonChip color="success" className="security-status">ACTIVE</IonChip>
          </div>

          <div className="security-item">
            <div className="security-content">
              <IonIcon icon={timeOutline} className="security-icon" />
              <div className="security-details">
                <span className="security-label">Session Timeout</span>
                <span className="security-description">Auto logout after inactivity</span>
              </div>
            </div>
            <IonSelect value="30" className="security-select">
              <IonSelectOption value="15">15 minutes</IonSelectOption>
              <IonSelectOption value="30">30 minutes</IonSelectOption>
              <IonSelectOption value="60">1 hour</IonSelectOption>
            </IonSelect>
          </div>

          <div className="security-item">
            <div className="security-content">
              <IonIcon icon={wifiOutline} className="security-icon" />
              <div className="security-details">
                <span className="security-label">IP Whitelist</span>
                <span className="security-description">Restrict access to specific IP addresses</span>
              </div>
            </div>
            <IonToggle checked={false} />
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
              <div className="config-fields">
            {filteredData.length === 0 ? (
              <div className="no-results">
                <IonIcon icon={informationCircleOutline} className="no-results-icon" />
                <h3>No configurations found</h3>
                <p>Try adjusting your search or filter criteria</p>
                      </div>
            ) : (
              filteredData.map((config, index) => (
                <div key={config.id} className={`config-field ${editingField === config.id ? 'editing' : ''}`}>
                  <div className="field-header">
                    <div className="field-info">
                      <IonChip color={getTypeColor(config.type)} className="type-chip">
                        {getTypeIcon(config.type)}
                      </IonChip>
                      <span className="field-key">{config.key}</span>
                      {config.value !== config.originalValue && (
                        <IonBadge color="warning" className="modified-badge">Modified</IonBadge>
                      )}
                    </div>
                    <div className="field-actions">
                      {editingField === config.id ? (
                        <>
                          <IonButton 
                            fill="clear" 
                            size="small" 
                            className="save-field-button"
                            onClick={() => handleSave(config.id)}
                          >
                            <IonIcon icon={checkmarkOutline} />
                          </IonButton>
                          <IonButton 
                            fill="clear" 
                            size="small" 
                            className="cancel-field-button"
                            onClick={handleCancel}
                          >
                            <IonIcon icon={closeOutline} />
                          </IonButton>
                        </>
                      ) : (
                        <>
                          <IonButton 
                            fill="clear" 
                            size="small" 
                            className="copy-button"
                            onClick={() => copyToClipboard(config.value)}
                          >
                            <IonIcon icon={copyOutline} />
                          </IonButton>
                          <IonButton 
                            fill="clear" 
                            size="small" 
                            className="edit-field-button"
                            onClick={() => handleEdit(config)}
                          >
                            <IonIcon icon={createOutline} />
                          </IonButton>
                          <IonButton 
                            fill="clear" 
                            size="small" 
                            className="delete-field-button"
                            onClick={() => handleDelete(config.id)}
                          >
                            <IonIcon icon={trashOutline} />
                          </IonButton>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="field-content">
                    {renderInput(config)}
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case 'system':
        return renderSystemInfo();
      case 'preferences':
        return renderUserPreferences();
      case 'security':
        return renderSecuritySettings();
      default:
        return null;
    }
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="config-content">
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
              <IonRefresherContent></IonRefresherContent>
            </IonRefresher>

            <div className="config-container">
              {/* Header Section */}
              <div className="config-header">
                <div className="header-left">
                  <IonIcon icon={settingsOutline} className="header-icon" />
                  <div className="header-info">
                    <h1>System Configuration</h1>
                    <p>Manage application settings and preferences</p>
                  </div>
                </div>
                <div className="header-actions">
                  <IonButton 
                    fill="outline" 
                    size="small"
                    onClick={() => setShowAddModal(true)}
                    className="add-button"
                  >
                    <IonIcon icon={addOutline} />
                    Add Config
                  </IonButton>
                  <IonButton 
                    fill="solid" 
                    className="save-button"
                    onClick={handleSaveAll}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <IonSpinner name="crescent" />
                    ) : (
                      <IonIcon icon={saveOutline} />
                    )}
                    Save All
                  </IonButton>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="config-tabs">
                <IonSegment value={activeTab} onIonChange={(e) => setActiveTab(e.detail.value as string)}>
                  <IonSegmentButton value="general">
                    <IonLabel>General</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="system">
                    <IonLabel>System Info</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="preferences">
                    <IonLabel>Preferences</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="security">
                    <IonLabel>Security</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
              </div>

              {/* Controls Section - Only show for general tab */}
              {activeTab === 'general' && (
                <div className="config-controls">
                  <div className="search-filter-section">
                    <IonSearchbar
                      value={searchQuery}
                      onIonInput={(e) => setSearchQuery(e.detail.value!)}
                      placeholder="Search configurations..."
                      className="config-searchbar"
                    />
                    <IonSelect
                      value={filterType}
                      onIonChange={(e) => setFilterType(e.detail.value)}
                      placeholder="Filter by type"
                      className="config-filter"
                    >
                      <IonSelectOption value="all">All Types</IonSelectOption>
                      <IonSelectOption value="text">Text</IonSelectOption>
                      <IonSelectOption value="number">Number</IonSelectOption>
                      <IonSelectOption value="boolean">Boolean</IonSelectOption>
                      <IonSelectOption value="email">Email</IonSelectOption>
                    </IonSelect>
                  </div>
                  
                  <div className="import-export-section">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      style={{ display: 'none' }}
                      id="import-file"
                    />
                    <IonButton
                      fill="outline"
                      size="small"
                      onClick={() => document.getElementById('import-file')?.click()}
                      className="import-button"
                    >
                      <IonIcon icon={cloudUploadOutline} />
                      Import
                    </IonButton>
                    <IonButton
                      fill="outline"
                      size="small"
                      onClick={handleResetAll}
                      color="warning"
                      className="reset-button"
                    >
                      <IonIcon icon={refreshOutline} />
                      Reset All
                    </IonButton>
                  </div>
                </div>
              )}

              {/* Results Summary - Only show for general tab */}
              {activeTab === 'general' && (
                <div className="results-summary">
                  <span className="results-count">
                    Showing {filteredData.length} of {configData.length} configurations
                  </span>
                  {searchQuery && (
                    <IonChip color="primary" className="search-chip">
                      <IonIcon icon={searchOutline} />
                      "{searchQuery}"
                    </IonChip>
                  )}
                  {filterType !== 'all' && (
                    <IonChip color="secondary" className="filter-chip">
                      <IonIcon icon={filterOutline} />
                      {filterType}
                    </IonChip>
                  )}
                </div>
              )}

              {/* Tab Content */}
              {renderTabContent()}
            </div>
          </IonContent>
        </div>
      </IonSplitPane>

      {/* Add Configuration Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Configuration</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="modal-content">
          <div className="modal-form">
            <IonInput
              value={newConfig.key}
              onIonInput={(e) => setNewConfig(prev => ({ ...prev, key: e.detail.value! }))}
              placeholder="Configuration Key"
              className="modal-input"
            />
            <IonInput
              value={newConfig.value}
              onIonInput={(e) => setNewConfig(prev => ({ ...prev, value: e.detail.value! }))}
              placeholder="Configuration Value"
              className="modal-input"
            />
            <IonSelect
              value={newConfig.type}
              onIonChange={(e) => setNewConfig(prev => ({ ...prev, type: e.detail.value }))}
              placeholder="Select Type"
              className="modal-select"
            >
              <IonSelectOption value="text">Text</IonSelectOption>
              <IonSelectOption value="number">Number</IonSelectOption>
              <IonSelectOption value="boolean">Boolean</IonSelectOption>
              <IonSelectOption value="email">Email</IonSelectOption>
            </IonSelect>
            <IonTextarea
              value={newConfig.description}
              onIonInput={(e) => setNewConfig(prev => ({ ...prev, description: e.detail.value! }))}
              placeholder="Description (optional)"
              className="modal-textarea"
              rows={3}
            />
            <div className="modal-actions">
              <IonButton fill="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </IonButton>
              <IonButton fill="solid" onClick={handleAddConfig}>
                Add Configuration
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

      {/* Confirmation Alert */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Confirm Reset"
        message={alertMessage}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Reset',
            handler: confirmReset
          }
        ]}
      />
    </IonPage>
  );
};

export default Config;