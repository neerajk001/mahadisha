import React, { useState } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonInput, IonItem, IonLabel, IonToast, IonCheckbox
} from '@ionic/react';
import { 
  saveOutline, closeOutline, checkmarkOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { ConfigData } from '../types';
import './Config.css';

const Config: React.FC = () => {
  const [configData, setConfigData] = useState<ConfigData[]>(mockDataService.getConfigData());
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

  const handleSaveAll = () => {
    setToastMessage('All configurations saved successfully');
    setShowToast(true);
  };

  const renderInput = (config: ConfigData) => {
    if (editingField === config.id) {
      if (config.type === 'boolean') {
        return (
          <IonCheckbox
            checked={tempValue === 'true'}
            onIonChange={(e) => setTempValue(e.detail.checked.toString())}
            className="config-checkbox"
          />
        );
      } else if (config.type === 'number') {
        return (
          <IonInput
            type="number"
            value={tempValue}
            onIonInput={(e) => setTempValue(e.detail.value!)}
            className="config-input"
          />
        );
      } else if (config.type === 'email') {
        return (
          <IonInput
            type="email"
            value={tempValue}
            onIonInput={(e) => setTempValue(e.detail.value!)}
            className="config-input"
          />
        );
      } else {
        return (
          <IonInput
            type="text"
            value={tempValue}
            onIonInput={(e) => setTempValue(e.detail.value!)}
            className="config-input"
          />
        );
      }
    } else {
      return (
        <div className="config-value-display">
          <span className="config-value">{config.value}</span>
          {config.originalValue && (
            <span className="original-value">Original: {config.originalValue}</span>
          )}
        </div>
      );
    }
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="config-content">
            <div className="config-container">
              {/* Header Section */}
              <div className="config-header">
                <div className="header-left">
                  <IonIcon icon={checkmarkOutline} className="header-icon" />
                  <h1>Other Settings</h1>
                </div>
                <IonButton 
                  fill="solid" 
                  className="save-button"
                  onClick={handleSaveAll}
                >
                  <IonIcon icon={saveOutline} />
                  Save
                </IonButton>
              </div>

              {/* Config Fields */}
              <div className="config-fields">
                {configData.map((config, index) => (
                  <div key={config.id} className="config-field">
                    <div className="field-content">
                      <div className="field-label">
                        <span className="label-text">{config.key}:</span>
                      </div>
                      <div className="field-value">
                        {renderInput(config)}
                      </div>
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
                            className="edit-field-button"
                            onClick={() => handleEdit(config)}
                          >
                            Edit
                          </IonButton>
                          <IonButton 
                            fill="clear" 
                            size="small" 
                            className="clear-field-button"
                            onClick={() => handleClear(config.id)}
                          >
                            <IonIcon icon={closeOutline} />
                          </IonButton>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </IonContent>
        </div>
      </IonSplitPane>

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

export default Config;
