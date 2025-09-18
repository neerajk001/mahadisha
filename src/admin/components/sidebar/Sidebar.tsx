import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonAvatar
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import {
  homeOutline,
  chevronDownOutline,
  logOutOutline,
  documentTextOutline,
  settingsOutline,
  peopleOutline,
  shieldCheckmarkOutline,
  personOutline,
  barChartOutline,
  ellipsisHorizontalOutline,
  locationOutline,
  folderOutline,
  analyticsOutline,
  folderOpenOutline,
  businessOutline,
  keyOutline,
  homeSharp,
  linkOutline,
  closeCircleOutline,
  shieldOutline,
  shuffleOutline,
  accessibilityOutline,
  gitBranchOutline,
  closeOutline
} from 'ionicons/icons';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const history = useHistory();
  const location = useLocation();
  const { isSidebarOpen, closeSidebar, toggleSidebar } = useSidebar();

  const toggleExpanded = (item: string) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? [] // Close all dropdowns if clicking on an already open one
        : [item] // Open only this dropdown, close all others
    );
  };

  const handleSubItemClick = (route: string) => {
    history.push(route);
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  };


  const getIconForSubItem = (iconType: string) => {
    switch (iconType) {
      case 'location': return locationOutline;
      case 'document': return documentTextOutline;
      case 'folder': return folderOutline;
      case 'chart': return analyticsOutline;
      case 'manage-pages': return folderOpenOutline;
      case 'branch': return businessOutline;
      case 'caste': return peopleOutline;
      case 'taluka': return locationOutline;
      case 'action': return keyOutline;
      case 'organization': return locationOutline;
      case 'status': return homeSharp;
      case 'partner': return peopleOutline;
      case 'status-mapping': return linkOutline;
      case 'rejection': return closeCircleOutline;
      case 'database-access': return keyOutline;
      case 'roles': return shieldOutline;
      case 'workflow': return shuffleOutline;
      case 'access-mapping': return accessibilityOutline;
      case 'branch-mapping': return gitBranchOutline;
      case 'pincode-mapping': return accessibilityOutline;
      default: return documentTextOutline;
    }
  };

  const menuItems = [
    { 
      id: 'loan', 
      label: 'LOAN', 
      icon: documentTextOutline, 
      subItems: [
        { name: 'Application Type', route: '/application-type', icon: 'location' },
        { name: 'New Requests', route: '/new-requests', icon: 'document' },
        { name: 'Schemes', route: '/admin/schemes', icon: 'folder' },
        { name: 'Custom Reports', route: '/custom-reports', icon: 'chart' }
      ]
    },
    { 
      id: 'masters', 
      label: 'MASTERS', 
      icon: settingsOutline, 
      subItems: [
        { name: 'Manage Pages', route: '/manage-pages', icon: 'manage-pages' },
        { name: 'Branch Master', route: '/branch-master', icon: 'branch' },
        { name: 'Caste Master', route: '/caste-master', icon: 'caste' },
        { name: 'Taluka Master', route: '/taluka-master', icon: 'taluka' },
        { name: 'Action Masters', route: '/action-masters', icon: 'action' },
        { name: 'Organization Masters', route: '/organization-masters', icon: 'organization' },
        { name: 'Status Master', route: '/status-master', icon: 'status' },
        { name: 'Partner Master', route: '/partner-master', icon: 'partner' },
        { name: 'Status Mapping', route: '/status-mapping', icon: 'status-mapping' },
        { name: 'Rejection Masters', route: '/rejection-masters', icon: 'rejection' }
      ]
    },
    { 
      id: 'rbac', 
      label: 'RBAC', 
      icon: shieldCheckmarkOutline, 
      subItems: [
        { name: 'Database Access', route: '/database-access', icon: 'database-access' },
        { name: 'Roles', route: '/roles', icon: 'roles' },
        { name: 'Workflow', route: '/workflow', icon: 'workflow' },
        { name: 'Access Mapping', route: '/access-mapping', icon: 'access-mapping' },
        { name: 'Branch Mapping', route: '/branch-mapping', icon: 'branch-mapping' },
        { name: 'Pincode Mapping', route: '/pincode-mapping', icon: 'pincode-mapping' }
      ]
    },
    { 
      id: 'user', 
      label: 'USER', 
      icon: personOutline, 
      subItems: [
        { name: 'Members', route: '/members', icon: 'location' }
      ]
    },
    { 
      id: 'settings', 
      label: 'SETTINGS', 
      icon: settingsOutline, 
      subItems: [
        { name: 'Config', route: '/config', icon: 'location' }
      ]
    },
    { 
      id: 'reports', 
      label: 'REPORTS', 
      icon: barChartOutline, 
      subItems: [
        { name: 'Reports', route: '/reports', icon: 'chart' }
      ]
    },
    { 
      id: 'other', 
      label: 'OTHER', 
      icon: ellipsisHorizontalOutline, 
      subItems: [
        { name: 'Others', route: '/others', icon: 'location' }
      ]
    }
  ];

  // Auto-expand dropdown based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Find which menu item contains the current route
    const currentMenuItem = menuItems.find(item => 
      item.subItems.some(subItem => subItem.route === currentPath)
    );
    
    if (currentMenuItem) {
      // Only expand the current menu item, close all others
      setExpandedItems([currentMenuItem.id]);
    } else {
      // If not on a submenu page, close all dropdowns
      setExpandedItems([]);
    }
  }, [location.pathname]);

  return (
    <>
      {/* Floating Toggle Button - Only show when sidebar is closed */}
      {!isSidebarOpen && (
        <IonButton
          fill="solid"
          size="small"
          className="sidebar-floating-toggle"
          onClick={toggleSidebar}
        >
          <IonIcon icon={homeOutline} />
        </IonButton>
      )}

      {/* Mobile Backdrop */}
      {isSidebarOpen && window.innerWidth <= 768 && (
        <div 
          className="sidebar-backdrop" 
          onClick={closeSidebar}
        />
      )}
      
      <IonMenu 
        contentId="dashboard-content" 
        type="overlay" 
        className={`sidebar-menu ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        disabled={!isSidebarOpen}
      >
      <IonHeader>
        <IonToolbar className="sidebar-toolbar">
          <div className="sidebar-header-content">
            <div className="sidebar-logo">
              <img 
                src="/mahadisha.png" 
                alt="MAHA-DISHA Logo" 
                className="logo-image"
              />
            </div>
            {/* Toggle Button */}
            <IonButton
              fill="clear"
              size="small"
              className="sidebar-toggle-btn"
              onClick={toggleSidebar}
            >
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sidebar-content">
        <div className="sidebar-main">
          <IonList className="sidebar-list">
            {/* Dashboard - Active */}
            <IonItem 
              className={`sidebar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
              button
              onClick={() => handleSubItemClick('/dashboard')}
            >
              <IonIcon icon={homeOutline} slot="start" className="sidebar-icon" />
              <IonLabel className="sidebar-label">DASHBOARD</IonLabel>
            </IonItem>

            {/* Menu Items with Dropdowns */}
            {menuItems.map((item) => (
              <div key={item.id} className="menu-section">
                <IonItem 
                  className="sidebar-item menu-header"
                  button
                  onClick={() => toggleExpanded(item.id)}
                >
                  <IonIcon icon={item.icon} slot="start" className="sidebar-icon" />
                  <IonLabel className="sidebar-label">{item.label}</IonLabel>
                  <IonIcon 
                    icon={chevronDownOutline} 
                    slot="end" 
                    className={`dropdown-icon ${expandedItems.includes(item.id) ? 'expanded' : ''}`}
                  />
                </IonItem>
                
                {expandedItems.includes(item.id) && (
                  <div className="submenu">
                    {item.subItems.map((subItem, index) => (
                      <IonItem 
                        key={index} 
                        className={`sidebar-item submenu-item ${location.pathname === subItem.route ? 'active' : ''}`}
                        button
                        onClick={() => handleSubItemClick(subItem.route)}
                      >
                        <IonIcon 
                          icon={getIconForSubItem(subItem.icon)} 
                          slot="start" 
                          className="submenu-icon" 
                        />
                        <IonLabel className="sidebar-label submenu-label">{subItem.name}</IonLabel>
                      </IonItem>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </IonList>
        </div>

        {/* Logout Button - Fixed at Bottom */}
        <div className="sidebar-footer">
          <IonButton 
            expand="block" 
            fill="outline" 
            className="logout-button"
            onClick={() => {
              // Handle logout logic here
              console.log('Logout clicked');
            }}
          >
            <IonIcon icon={logOutOutline} slot="start" />
            Logout
          </IonButton>
        </div>
      </IonContent>
    </IonMenu>
    </>
  );
};

export default Sidebar;
