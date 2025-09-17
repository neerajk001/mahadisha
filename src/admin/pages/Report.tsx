import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonContent,
  IonSplitPane,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonToast,
  IonSpinner,
  IonBadge,
  IonChip,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonProgressBar,
  IonFab,
  IonFabButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonSearchbar
} from '@ionic/react';
import {
  calendarOutline,
  arrowForwardOutline,
  documentOutline,
  downloadOutline,
  printOutline,
  refreshOutline,
  filterOutline,
  analyticsOutline,
  trendingUpOutline,
  trendingDownOutline,
  peopleOutline,
  cashOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  timeOutline,
  locationOutline,
  businessOutline,
  pieChartOutline,
  barChartOutline,
  statsChartOutline,
  chevronDownOutline,
  chevronUpOutline,
  closeOutline,
  eyeOutline,
  shareOutline,
  addOutline
} from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import './Report.css';

// Types
interface RegionData {
  srNo: number;
  bankName: string;
  target: { phy: number; fin: number };
  previousYearPending: { phy: number; fin: number };
  proposalsSent: { phy: number; fin: number };
  loansSanctioned: { phy: number; fin: number };
  loansDisbursed: { phy: number; fin: number };
  proposalsReturned: { phy: number; fin: number };
  proposalsRejected: { phy: number; fin: number };
  proposalsPending: { phy: number; fin: number };
}

interface ReportTab {
  id: string;
  name: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
}

const Report: React.FC = () => {
  // State Management
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedBank, setSelectedBank] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('2024-11-01');
  const [endDate, setEndDate] = useState<string>('2024-11-30');
  const [activeTab, setActiveTab] = useState<string>('bankwise');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set(['PUNE REGION']));
  
  // Refs for date inputs
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  
  // Get today's date in YYYY-MM-DD format for max date validation
  const today = new Date().toISOString().split('T')[0];
  
  // Searchable dropdown states
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [regionSearchQuery, setRegionSearchQuery] = useState('');
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const [districtSearchQuery, setDistrictSearchQuery] = useState('');

  // Report Tabs Configuration
  const reportTabs: ReportTab[] = [
    { id: 'bankwise', name: 'Bankwise Report', icon: businessOutline, badge: 'Active', badgeColor: 'success' },
    { id: 'monthly', name: 'Monthly Progress', icon: calendarOutline },
    { id: 'activity', name: 'Activity Wise', icon: analyticsOutline },
    { id: 'recovery', name: 'Due Recovery', icon: cashOutline, badge: '3', badgeColor: 'warning' },
    { id: 'recovery-detail', name: 'Recovery Report', icon: checkmarkCircleOutline },
    { id: 'comparative', name: 'Comparative', icon: pieChartOutline },
    { id: 'region', name: 'Region Report', icon: locationOutline }
  ];

  // Sample Data
  const regionReports = [
    {
      regionName: 'PUNE REGION',
      totalTarget: { phy: 1500, fin: 2500000 },
      totalDisbursed: { phy: 850, fin: 1950000 },
      performance: 85,
      banks: [
        {
          srNo: 1,
          bankName: 'State Bank of India',
          target: { phy: 500, fin: 850000 },
          previousYearPending: { phy: 25, fin: 125000 },
          proposalsSent: { phy: 450, fin: 750000 },
          loansSanctioned: { phy: 380, fin: 650000 },
          loansDisbursed: { phy: 350, fin: 600000 },
          proposalsReturned: { phy: 30, fin: 50000 },
          proposalsRejected: { phy: 20, fin: 35000 },
          proposalsPending: { phy: 45, fin: 65000 }
        },
        {
          srNo: 2,
          bankName: 'Bank of Maharashtra',
          target: { phy: 400, fin: 650000 },
          previousYearPending: { phy: 15, fin: 95000 },
          proposalsSent: { phy: 380, fin: 600000 },
          loansSanctioned: { phy: 320, fin: 520000 },
          loansDisbursed: { phy: 300, fin: 500000 },
          proposalsReturned: { phy: 25, fin: 40000 },
          proposalsRejected: { phy: 15, fin: 25000 },
          proposalsPending: { phy: 40, fin: 55000 }
        },
        {
          srNo: 3,
          bankName: 'HDFC Bank',
          target: { phy: 300, fin: 500000 },
          previousYearPending: { phy: 20, fin: 100000 },
          proposalsSent: { phy: 280, fin: 450000 },
          loansSanctioned: { phy: 240, fin: 400000 },
          loansDisbursed: { phy: 200, fin: 350000 },
          proposalsReturned: { phy: 20, fin: 30000 },
          proposalsRejected: { phy: 10, fin: 15000 },
          proposalsPending: { phy: 30, fin: 45000 }
        },
        {
          srNo: 4,
          bankName: 'Axis Bank',
          target: { phy: 300, fin: 500000 },
          previousYearPending: { phy: 10, fin: 80000 },
          proposalsSent: { phy: 250, fin: 420000 },
          loansSanctioned: { phy: 200, fin: 350000 },
          loansDisbursed: { phy: 0, fin: 500000 },
          proposalsReturned: { phy: 15, fin: 25000 },
          proposalsRejected: { phy: 8, fin: 12000 },
          proposalsPending: { phy: 27, fin: 38000 }
        }
      ]
    },
    {
      regionName: 'AURANGABAD (CHH.SAMBHAJI NAGAR) REGION',
      totalTarget: { phy: 1200, fin: 2000000 },
      totalDisbursed: { phy: 680, fin: 1450000 },
      performance: 72.5,
      banks: [
        {
          srNo: 1,
          bankName: 'State Bank of India',
          target: { phy: 400, fin: 700000 },
          previousYearPending: { phy: 20, fin: 100000 },
          proposalsSent: { phy: 350, fin: 600000 },
          loansSanctioned: { phy: 300, fin: 520000 },
          loansDisbursed: { phy: 280, fin: 500000 },
          proposalsReturned: { phy: 25, fin: 40000 },
          proposalsRejected: { phy: 15, fin: 25000 },
          proposalsPending: { phy: 35, fin: 55000 }
        },
        {
          srNo: 2,
          bankName: 'Bank of India',
          target: { phy: 350, fin: 550000 },
          previousYearPending: { phy: 15, fin: 85000 },
          proposalsSent: { phy: 320, fin: 500000 },
          loansSanctioned: { phy: 280, fin: 450000 },
          loansDisbursed: { phy: 250, fin: 420000 },
          proposalsReturned: { phy: 20, fin: 30000 },
          proposalsRejected: { phy: 12, fin: 20000 },
          proposalsPending: { phy: 30, fin: 45000 }
        },
        {
          srNo: 3,
          bankName: 'Punjab National Bank',
          target: { phy: 450, fin: 750000 },
          previousYearPending: { phy: 25, fin: 120000 },
          proposalsSent: { phy: 400, fin: 680000 },
          loansSanctioned: { phy: 350, fin: 600000 },
          loansDisbursed: { phy: 150, fin: 530000 },
          proposalsReturned: { phy: 30, fin: 50000 },
          proposalsRejected: { phy: 18, fin: 30000 },
          proposalsPending: { phy: 40, fin: 65000 }
        }
      ]
    },
    {
      regionName: 'NASHIK REGION',
      totalTarget: { phy: 1000, fin: 1800000 },
      totalDisbursed: { phy: 750, fin: 1620000 },
      performance: 90,
      banks: [
        {
          srNo: 1,
          bankName: 'ICICI Bank',
          target: { phy: 500, fin: 900000 },
          previousYearPending: { phy: 30, fin: 150000 },
          proposalsSent: { phy: 450, fin: 800000 },
          loansSanctioned: { phy: 400, fin: 750000 },
          loansDisbursed: { phy: 380, fin: 720000 },
          proposalsReturned: { phy: 25, fin: 40000 },
          proposalsRejected: { phy: 15, fin: 25000 },
          proposalsPending: { phy: 35, fin: 55000 }
        },
        {
          srNo: 2,
          bankName: 'Kotak Mahindra Bank',
          target: { phy: 500, fin: 900000 },
          previousYearPending: { phy: 25, fin: 130000 },
          proposalsSent: { phy: 450, fin: 820000 },
          loansSanctioned: { phy: 400, fin: 770000 },
          loansDisbursed: { phy: 370, fin: 900000 },
          proposalsReturned: { phy: 30, fin: 50000 },
          proposalsRejected: { phy: 20, fin: 35000 },
          proposalsPending: { phy: 40, fin: 65000 }
        }
      ]
    }
  ];

  // Summary Statistics
  const summaryStats = {
    totalApplications: 15248,
    totalDisbursed: 8950000,
    pendingApplications: 2456,
    rejectedApplications: 658,
    averageProcessingTime: 12,
    successRate: 87.5,
    monthlyGrowth: 15.2,
    yearlyTarget: 25000000,
    achieved: 18500000,
    achievementPercentage: 74
  };

  // Utility Functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const toggleRegionExpand = (regionName: string) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(regionName)) {
      newExpanded.delete(regionName);
    } else {
      newExpanded.add(regionName);
    }
    setExpandedRegions(newExpanded);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.searchable-dropdown')) {
        setShowRegionDropdown(false);
        setShowBankDropdown(false);
        setShowDistrictDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setToastMessage('Report generated successfully');
      setShowToast(true);
    }, 2000);
  };

  const handleExportReport = (format: string) => {
    setToastMessage(`Exporting report as ${format.toUpperCase()}...`);
    setShowToast(true);
    setShowExportModal(false);
  };

  const handlePrintReport = () => {
    window.print();
    setToastMessage('Opening print dialog...');
    setShowToast(true);
  };

  // Get all unique banks from all regions
  const getAllBanks = () => {
    const banks = new Set<string>();
    regionReports.forEach(region => {
      region.banks.forEach(bank => {
        banks.add(bank.bankName);
      });
    });
    return Array.from(banks);
  };

  // Filter regions based on search
  const getFilteredRegions = () => {
    const regions = regionReports.map(r => r.regionName);
    if (!regionSearchQuery) return regions;
    return regions.filter(region => 
      region.toLowerCase().includes(regionSearchQuery.toLowerCase())
    );
  };

  // Filter banks based on search
  const getFilteredBanks = () => {
    const banks = getAllBanks();
    if (!bankSearchQuery) return banks;
    return banks.filter(bank => 
      bank.toLowerCase().includes(bankSearchQuery.toLowerCase())
    );
  };

  // List of all districts
  const districts = ['Pune', 'Mumbai', 'Nashik', 'Aurangabad', 'Nagpur', 'Thane', 'Kolhapur', 'Solapur', 'Satara', 'Ratnagiri'];

  // Filter districts based on search
  const getFilteredDistricts = () => {
    if (!districtSearchQuery) return districts;
    return districts.filter(district => 
      district.toLowerCase().includes(districtSearchQuery.toLowerCase())
    );
  };

  const calculateTotals = (banks: RegionData[]) => {
    return banks.reduce((acc, bank) => {
      return {
        target: {
          phy: acc.target.phy + bank.target.phy,
          fin: acc.target.fin + bank.target.fin
        },
        previousYearPending: {
          phy: acc.previousYearPending.phy + bank.previousYearPending.phy,
          fin: acc.previousYearPending.fin + bank.previousYearPending.fin
        },
        proposalsSent: {
          phy: acc.proposalsSent.phy + bank.proposalsSent.phy,
          fin: acc.proposalsSent.fin + bank.proposalsSent.fin
        },
        loansSanctioned: {
          phy: acc.loansSanctioned.phy + bank.loansSanctioned.phy,
          fin: acc.loansSanctioned.fin + bank.loansSanctioned.fin
        },
        loansDisbursed: {
          phy: acc.loansDisbursed.phy + bank.loansDisbursed.phy,
          fin: acc.loansDisbursed.fin + bank.loansDisbursed.fin
        },
        proposalsReturned: {
          phy: acc.proposalsReturned.phy + bank.proposalsReturned.phy,
          fin: acc.proposalsReturned.fin + bank.proposalsReturned.fin
        },
        proposalsRejected: {
          phy: acc.proposalsRejected.phy + bank.proposalsRejected.phy,
          fin: acc.proposalsRejected.fin + bank.proposalsRejected.fin
        },
        proposalsPending: {
          phy: acc.proposalsPending.phy + bank.proposalsPending.phy,
          fin: acc.proposalsPending.fin + bank.proposalsPending.fin
        }
      };
    }, {
      target: { phy: 0, fin: 0 },
      previousYearPending: { phy: 0, fin: 0 },
      proposalsSent: { phy: 0, fin: 0 },
      loansSanctioned: { phy: 0, fin: 0 },
      loansDisbursed: { phy: 0, fin: 0 },
      proposalsReturned: { phy: 0, fin: 0 },
      proposalsRejected: { phy: 0, fin: 0 },
      proposalsPending: { phy: 0, fin: 0 }
    });
  };

  return (
    <IonPage>
      <IonSplitPane contentId="report-content" when="md">
        <Sidebar />
        <div className="main-content" id="report-content">
          <DashboardHeader />
          
          <IonContent className="report-content">
            {/* Header Section */}
            <div className="report-header-section">
              <div className="report-header-content">
                <div className="organization-info">
                  <h1 className="organization-name">MPBCDC</h1>
                  <div className="organization-full-name">
                    Mahatma Phule Backward Class Development Corporation Ltd.
                  </div>
                </div>
                
                <div className="report-title-block">
                  <h2 className="report-title">Region-wise Progress Report</h2>
                  <div className="report-period">
                    <span className="period-label">Reporting Period:</span>
                    <span className="period-dates">
                      {startDate && !isNaN(new Date(startDate).getTime()) ? 
                        new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 
                        'From Date'} 
                      {' - '}
                      {endDate && !isNaN(new Date(endDate).getTime()) ? 
                        new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 
                        'To Date'}
                    </span>
                  </div>
                </div>
                
                <div className="report-stats-header">
                  <div className="stat-header-item">
                    <div className="stat-header-label">Scheme</div>
                    <div className="stat-header-value">Subsidy Program 2024-25</div>
                  </div>
                  <div className="stat-header-item">
                    <div className="stat-header-label">Total Regions</div>
                    <div className="stat-header-value">{regionReports.length}</div>
                  </div>
                  <div className="stat-header-item">
                    <div className="stat-header-label">Report Status</div>
                    <div className="stat-header-value status-active">Active</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="simple-tabs-container">
              <div className="simple-tabs">
                <button 
                  className={`simple-tab ${activeTab === 'bankwise' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bankwise')}
                >
                  BANKWISE REPORT
                </button>
                <button 
                  className={`simple-tab ${activeTab === 'monthly' ? 'active' : ''}`}
                  onClick={() => setActiveTab('monthly')}
                >
                  MONTHLY PROGRESS
                </button>
                <button 
                  className={`simple-tab ${activeTab === 'activity' ? 'active' : ''}`}
                  onClick={() => setActiveTab('activity')}
                >
                  ACTIVITY WISE
                </button>
                <button 
                  className={`simple-tab ${activeTab === 'recovery' ? 'active' : ''}`}
                  onClick={() => setActiveTab('recovery')}
                >
                  DUE RECOVERY
                </button>
                <button 
                  className={`simple-tab ${activeTab === 'recovery-detail' ? 'active' : ''}`}
                  onClick={() => setActiveTab('recovery-detail')}
                >
                  RECOVERY
                </button>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="report-controls-bar">
              <IonGrid>
                <IonRow className="align-items-center">
                  <IonCol size="12" size-md="2.5" size-lg="2">
                    <div className="date-control">
                      <label>From Date</label>
                      <div 
                        className="date-display-box" 
                        onClick={(e) => {
                          // Don't trigger if clicking on clear button
                          if (!(e.target as HTMLElement).classList.contains('clear-date')) {
                            if (startDateRef.current) {
                              startDateRef.current.showPicker ? startDateRef.current.showPicker() : startDateRef.current.click();
                            }
                          }
                        }}
                      >
                        {startDate && !isNaN(new Date(startDate).getTime()) ? (
                          <>
                            <div className="date-display">
                              <span className="date-day">{new Date(startDate).getDate()}</span>
                              <div className="date-month-year">
                                <span className="date-month">{new Date(startDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                                <span className="date-year">{new Date(startDate).getFullYear()}</span>
                              </div>
                            </div>
                            <button 
                              className="clear-date"
                              onClick={(e) => {
                                e.stopPropagation();
                                setStartDate('');
                                if (startDateRef.current) {
                                  startDateRef.current.value = '';
                                }
                                setToastMessage('Start date cleared');
                                setShowToast(true);
                              }}
                              title="Clear date"
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <div className="date-placeholder">
                            <span>Select Date</span>
                          </div>
                        )}
                        <IonIcon icon={calendarOutline} className="calendar-icon" />
                        <input 
                          ref={startDateRef}
                          type="date" 
                          value={startDate}
                          max={today}
                          onChange={(e) => {
                            const newStartDate = e.target.value;
                            if (newStartDate) {
                              // If there's an end date and new start date is after it, update end date too
                              if (endDate && newStartDate > endDate) {
                                setEndDate(newStartDate);
                                setToastMessage('End date adjusted to match start date');
                                setShowToast(true);
                              }
                              setStartDate(newStartDate);
                            } else {
                              // Handle clear from native date picker
                              setStartDate('');
                            }
                          }}
                          style={{ 
                            position: 'absolute',
                            visibility: 'hidden',
                            width: '0',
                            height: '0'
                          }}
                        />
                      </div>
                    </div>
                  </IonCol>
                  <IonCol size="12" size-md="2.5" size-lg="2">
                    <div className="date-control">
                      <label>To Date</label>
                      <div 
                        className="date-display-box" 
                        onClick={(e) => {
                          // Don't trigger if clicking on clear button
                          if (!(e.target as HTMLElement).classList.contains('clear-date')) {
                            if (endDateRef.current) {
                              endDateRef.current.showPicker ? endDateRef.current.showPicker() : endDateRef.current.click();
                            }
                          }
                        }}
                      >
                        {endDate && !isNaN(new Date(endDate).getTime()) ? (
                          <>
                            <div className="date-display">
                              <span className="date-day">{new Date(endDate).getDate()}</span>
                              <div className="date-month-year">
                                <span className="date-month">{new Date(endDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                                <span className="date-year">{new Date(endDate).getFullYear()}</span>
                              </div>
                            </div>
                            <button 
                              className="clear-date"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEndDate('');
                                if (endDateRef.current) {
                                  endDateRef.current.value = '';
                                }
                                setToastMessage('End date cleared');
                                setShowToast(true);
                              }}
                              title="Clear date"
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <div className="date-placeholder">
                            <span>Select Date</span>
                          </div>
                        )}
                        <IonIcon icon={calendarOutline} className="calendar-icon" />
                        <input 
                          ref={endDateRef}
                          type="date" 
                          value={endDate}
                          min={startDate || undefined}
                          max={today}
                          onChange={(e) => {
                            const newEndDate = e.target.value;
                            if (newEndDate) {
                              // Validate that end date is not before start date
                              if (startDate && newEndDate < startDate) {
                                setToastMessage('End date cannot be before start date');
                                setShowToast(true);
                                // Reset to start date
                                setEndDate(startDate);
                                if (endDateRef.current) {
                                  endDateRef.current.value = startDate;
                                }
                              } else {
                                setEndDate(newEndDate);
                              }
                            } else {
                              // Handle clear from native date picker
                              setEndDate('');
                            }
                          }}
                          style={{ 
                            position: 'absolute',
                            visibility: 'hidden',
                            width: '0',
                            height: '0'
                          }}
                        />
                      </div>
                    </div>
                  </IonCol>
                  <IonCol size="12" size-md="7" size-lg="8">
                    <div className="action-buttons-row">
                      <IonButton
                        className="generate-btn"
                        fill="solid"
                        onClick={handleGenerateReport}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <IonSpinner name="crescent" />
                        ) : (
                          <>
                            <IonIcon icon={arrowForwardOutline} slot="start" />
                            Generate
                          </>
                        )}
                      </IonButton>
                      <IonButton
                        className="export-btn"
                        fill="outline"
                        onClick={() => setShowExportModal(true)}
                      >
                        <IonIcon icon={downloadOutline} slot="start" />
                        Export
                      </IonButton>
                      <IonButton
                        className="print-btn"
                        fill="outline"
                        onClick={handlePrintReport}
                      >
                        <IonIcon icon={printOutline} slot="start" />
                        Print
                      </IonButton>
                      <IonButton
                        className="filters-btn"
                        fill="outline"
                        onClick={() => setShowFilterModal(true)}
                      >
                        <IonIcon icon={filterOutline} slot="start" />
                        Filters
                      </IonButton>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>

            {/* Summary Statistics Cards */}
            <div className="summary-statistics">
              <IonGrid>
                <IonRow>
                  <IonCol size="12" size-md="3">
                    <IonCard className="stat-card">
                      <IonCardContent>
                        <div className="stat-icon-wrapper primary">
                          <IonIcon icon={peopleOutline} />
                        </div>
                        <div className="stat-details">
                          <p className="stat-label">Total Applications</p>
                          <h3 className="stat-value">{formatNumber(summaryStats.totalApplications)}</h3>
                          <div className="stat-trend positive">
                            <IonIcon icon={trendingUpOutline} />
                            <span>+12.5%</span>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                  <IonCol size="12" size-md="3">
                    <IonCard className="stat-card">
                      <IonCardContent>
                        <div className="stat-icon-wrapper success">
                          <IonIcon icon={cashOutline} />
                        </div>
                        <div className="stat-details">
                          <p className="stat-label">Total Disbursed</p>
                          <h3 className="stat-value">{formatCurrency(summaryStats.totalDisbursed)}</h3>
                          <div className="stat-trend positive">
                            <IonIcon icon={trendingUpOutline} />
                            <span>+{summaryStats.monthlyGrowth}%</span>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                  <IonCol size="12" size-md="3">
                    <IonCard className="stat-card">
                      <IonCardContent>
                        <div className="stat-icon-wrapper warning">
                          <IonIcon icon={timeOutline} />
                        </div>
                        <div className="stat-details">
                          <p className="stat-label">Pending Applications</p>
                          <h3 className="stat-value">{formatNumber(summaryStats.pendingApplications)}</h3>
                          <div className="stat-trend negative">
                            <IonIcon icon={trendingDownOutline} />
                            <span>-8.3%</span>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                  <IonCol size="12" size-md="3">
                    <IonCard className="stat-card">
                      <IonCardContent>
                        <div className="stat-icon-wrapper info">
                          <IonIcon icon={statsChartOutline} />
                        </div>
                        <div className="stat-details">
                          <p className="stat-label">Achievement Rate</p>
                          <h3 className="stat-value">{summaryStats.achievementPercentage}%</h3>
                          <IonProgressBar 
                            value={summaryStats.achievementPercentage / 100} 
                            color="primary"
                            className="achievement-progress"
                          />
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>

            {/* Filter Row */}
            <div className="simple-filter-row">
              <IonGrid>
                <IonRow>
                  <IonCol size="12" size-md="4">
                    <div className="simple-filter-item">
                      <label className="simple-filter-label">Filter by Region:</label>
                      <div className="searchable-dropdown">
                        <div 
                          className="dropdown-selected"
                          onClick={() => {
                            setShowRegionDropdown(!showRegionDropdown);
                            setShowBankDropdown(false);
                            setShowDistrictDropdown(false);
                          }}
                        >
                          <span>{selectedRegion}</span>
                          <IonIcon icon={chevronDownOutline} className="dropdown-arrow" />
                        </div>
                        {showRegionDropdown && (
                          <div className="dropdown-menu">
                            <div className="search-box">
                              <input
                                type="text"
                                placeholder="Search regions..."
                                value={regionSearchQuery}
                                onChange={(e) => setRegionSearchQuery(e.target.value)}
                                className="dropdown-search"
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                              />
                            </div>
                            <div className="dropdown-options">
                              <div 
                                className="dropdown-option"
                                onClick={() => {
                                  setSelectedRegion('All');
                                  setShowRegionDropdown(false);
                                  setRegionSearchQuery('');
                                }}
                              >
                                All Regions
                              </div>
                              {getFilteredRegions().map((region) => (
                                <div
                                  key={region}
                                  className="dropdown-option"
                                  onClick={() => {
                                    setSelectedRegion(region);
                                    setShowRegionDropdown(false);
                                    setRegionSearchQuery('');
                                  }}
                                >
                                  {region}
                                </div>
                              ))}
                              {getFilteredRegions().length === 0 && (
                                <div className="dropdown-option no-results">
                                  No regions found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </IonCol>
                  <IonCol size="12" size-md="4">
                    <div className="simple-filter-item">
                      <label className="simple-filter-label">Filter by Bank:</label>
                      <div className="searchable-dropdown">
                        <div 
                          className="dropdown-selected"
                          onClick={() => {
                            setShowBankDropdown(!showBankDropdown);
                            setShowRegionDropdown(false);
                            setShowDistrictDropdown(false);
                          }}
                        >
                          <span>{selectedBank}</span>
                          <IonIcon icon={chevronDownOutline} className="dropdown-arrow" />
                        </div>
                        {showBankDropdown && (
                          <div className="dropdown-menu">
                            <div className="search-box">
                              <input
                                type="text"
                                placeholder="Search banks..."
                                value={bankSearchQuery}
                                onChange={(e) => setBankSearchQuery(e.target.value)}
                                className="dropdown-search"
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                              />
                            </div>
                            <div className="dropdown-options">
                              <div 
                                className="dropdown-option"
                                onClick={() => {
                                  setSelectedBank('All');
                                  setShowBankDropdown(false);
                                  setBankSearchQuery('');
                                }}
                              >
                                All Banks
                              </div>
                              {getFilteredBanks().map((bank) => (
                                <div
                                  key={bank}
                                  className="dropdown-option"
                                  onClick={() => {
                                    setSelectedBank(bank);
                                    setShowBankDropdown(false);
                                    setBankSearchQuery('');
                                  }}
                                >
                                  {bank}
                                </div>
                              ))}
                              {getFilteredBanks().length === 0 && (
                                <div className="dropdown-option no-results">
                                  No banks found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </IonCol>
                  <IonCol size="12" size-md="4">
                    <div className="simple-filter-item">
                      <label className="simple-filter-label">Filter by District:</label>
                      <div className="searchable-dropdown">
                        <div 
                          className="dropdown-selected"
                          onClick={() => {
                            setShowDistrictDropdown(!showDistrictDropdown);
                            setShowRegionDropdown(false);
                            setShowBankDropdown(false);
                          }}
                        >
                          <span>{selectedDistrict}</span>
                          <IonIcon icon={chevronDownOutline} className="dropdown-arrow" />
                        </div>
                        {showDistrictDropdown && (
                          <div className="dropdown-menu">
                            <div className="search-box">
                              <input
                                type="text"
                                placeholder="Search districts..."
                                value={districtSearchQuery}
                                onChange={(e) => setDistrictSearchQuery(e.target.value)}
                                className="dropdown-search"
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                              />
                            </div>
                            <div className="dropdown-options">
                              <div 
                                className="dropdown-option"
                                onClick={() => {
                                  setSelectedDistrict('All');
                                  setShowDistrictDropdown(false);
                                  setDistrictSearchQuery('');
                                }}
                              >
                                All Districts
                              </div>
                              {getFilteredDistricts().map((district) => (
                                <div
                                  key={district}
                                  className="dropdown-option"
                                  onClick={() => {
                                    setSelectedDistrict(district);
                                    setShowDistrictDropdown(false);
                                    setDistrictSearchQuery('');
                                  }}
                                >
                                  {district}
                                </div>
                              ))}
                              {getFilteredDistricts().length === 0 && (
                                <div className="dropdown-option no-results">
                                  No districts found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>

            {/* View Mode Toggle */}
            <div className="view-mode-toggle">
              <IonButton
                fill={viewMode === 'table' ? 'solid' : 'outline'}
                size="small"
                onClick={() => setViewMode('table')}
              >
                <IonIcon icon={barChartOutline} slot="start" />
                Table View
              </IonButton>
              <IonButton
                fill={viewMode === 'cards' ? 'solid' : 'outline'}
                size="small"
                onClick={() => setViewMode('cards')}
              >
                <IonIcon icon={eyeOutline} slot="start" />
                Card View
              </IonButton>
            </div>

            {/* Report Tables/Cards */}
            <div className="report-data-container">
              {viewMode === 'table' ? (
                // Table View
                regionReports.map((region) => (
                  <div key={region.regionName} className="region-report-section">
                    <div 
                      className="region-header"
                      onClick={() => toggleRegionExpand(region.regionName)}
                    >
                      <div className="region-title-wrapper">
                        <h3 className="region-title">{region.regionName}</h3>
                        <div className="region-badges">
                          <IonBadge color="primary">
                            {region.banks.length} Banks
                          </IonBadge>
                          <IonBadge color={region.performance >= 80 ? 'success' : 'warning'}>
                            {region.performance}% Performance
                          </IonBadge>
                        </div>
                      </div>
                      <IonIcon 
                        icon={expandedRegions.has(region.regionName) ? chevronUpOutline : chevronDownOutline}
                        className="expand-icon"
                      />
                    </div>
                    
                    {expandedRegions.has(region.regionName) && (
                      <div className="region-content">
                        <div className="table-responsive">
                          <table className="report-table">
                            <thead>
                              <tr className="main-header">
                                <th rowSpan={2}>Sr. No.</th>
                                <th rowSpan={2}>Name of the Bank</th>
                                <th colSpan={2}>Target</th>
                                <th colSpan={2}>Previous Year Pending</th>
                                <th colSpan={2}>Proposals Sent</th>
                                <th colSpan={2}>Loans Sanctioned</th>
                                <th colSpan={2}>Loans Disbursed</th>
                                <th colSpan={2}>Proposals Returned</th>
                                <th colSpan={2}>Proposals Rejected</th>
                                <th colSpan={2}>Proposals Pending</th>
                              </tr>
                              <tr className="sub-header">
                                <th>Phy.</th>
                                <th>Fin. (₹)</th>
                                <th>Phy.</th>
                                <th>Fin. (₹)</th>
                                <th>Phy.</th>
                                <th>Fin. (₹)</th>
                                <th>Phy.</th>
                                <th>Fin. (₹)</th>
                                <th>Phy.</th>
                                <th>Fin. (₹)</th>
                                <th>Phy.</th>
                                <th>Fin. (₹)</th>
                                <th>Phy.</th>
                                <th>Fin. (₹)</th>
                                <th>Phy.</th>
                                <th>Fin. (₹)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {region.banks.map((bank) => (
                                <tr key={bank.srNo} className="data-row">
                                  <td className="text-center">{bank.srNo}</td>
                                  <td className="bank-name">{bank.bankName}</td>
                                  <td className="text-right">{formatNumber(bank.target.phy)}</td>
                                  <td className="text-right">{formatNumber(bank.target.fin)}</td>
                                  <td className="text-right">{formatNumber(bank.previousYearPending.phy)}</td>
                                  <td className="text-right">{formatNumber(bank.previousYearPending.fin)}</td>
                                  <td className="text-right">{formatNumber(bank.proposalsSent.phy)}</td>
                                  <td className="text-right">{formatNumber(bank.proposalsSent.fin)}</td>
                                  <td className="text-right">{formatNumber(bank.loansSanctioned.phy)}</td>
                                  <td className="text-right">{formatNumber(bank.loansSanctioned.fin)}</td>
                                  <td className="text-right highlight-success">{formatNumber(bank.loansDisbursed.phy)}</td>
                                  <td className="text-right highlight-success">{formatNumber(bank.loansDisbursed.fin)}</td>
                                  <td className="text-right">{formatNumber(bank.proposalsReturned.phy)}</td>
                                  <td className="text-right">{formatNumber(bank.proposalsReturned.fin)}</td>
                                  <td className="text-right highlight-danger">{formatNumber(bank.proposalsRejected.phy)}</td>
                                  <td className="text-right highlight-danger">{formatNumber(bank.proposalsRejected.fin)}</td>
                                  <td className="text-right highlight-warning">{formatNumber(bank.proposalsPending.phy)}</td>
                                  <td className="text-right highlight-warning">{formatNumber(bank.proposalsPending.fin)}</td>
                                </tr>
                              ))}
                              {/* Total Row */}
                              <tr className="total-row">
                                <td colSpan={2} className="text-center"><strong>Total</strong></td>
                                {(() => {
                                  const totals = calculateTotals(region.banks);
                                  return (
                                    <>
                                      <td className="text-right"><strong>{formatNumber(totals.target.phy)}</strong></td>
                                      <td className="text-right"><strong>{formatNumber(totals.target.fin)}</strong></td>
                                      <td className="text-right"><strong>{formatNumber(totals.previousYearPending.phy)}</strong></td>
                                      <td className="text-right"><strong>{formatNumber(totals.previousYearPending.fin)}</strong></td>
                                      <td className="text-right"><strong>{formatNumber(totals.proposalsSent.phy)}</strong></td>
                                      <td className="text-right"><strong>{formatNumber(totals.proposalsSent.fin)}</strong></td>
                                      <td className="text-right"><strong>{formatNumber(totals.loansSanctioned.phy)}</strong></td>
                                      <td className="text-right"><strong>{formatNumber(totals.loansSanctioned.fin)}</strong></td>
                                      <td className="text-right highlight-success"><strong>{formatNumber(totals.loansDisbursed.phy)}</strong></td>
                                      <td className="text-right highlight-success"><strong>{formatNumber(totals.loansDisbursed.fin)}</strong></td>
                                      <td className="text-right"><strong>{formatNumber(totals.proposalsReturned.phy)}</strong></td>
                                      <td className="text-right"><strong>{formatNumber(totals.proposalsReturned.fin)}</strong></td>
                                      <td className="text-right highlight-danger"><strong>{formatNumber(totals.proposalsRejected.phy)}</strong></td>
                                      <td className="text-right highlight-danger"><strong>{formatNumber(totals.proposalsRejected.fin)}</strong></td>
                                      <td className="text-right highlight-warning"><strong>{formatNumber(totals.proposalsPending.phy)}</strong></td>
                                      <td className="text-right highlight-warning"><strong>{formatNumber(totals.proposalsPending.fin)}</strong></td>
                                    </>
                                  );
                                })()}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                // Card View
                <IonGrid>
                  <IonRow>
                    {regionReports.map((region) => (
                      <IonCol key={region.regionName} size="12">
                        <IonCard className="region-card">
                          <IonCardHeader>
                            <IonCardTitle>{region.regionName}</IonCardTitle>
                            <div className="region-meta">
                              <IonChip color="primary">
                                <IonLabel>{region.banks.length} Banks</IonLabel>
                              </IonChip>
                              <IonChip color={region.performance >= 80 ? 'success' : 'warning'}>
                                <IonLabel>{region.performance}% Performance</IonLabel>
                              </IonChip>
                            </div>
                          </IonCardHeader>
                          <IonCardContent>
                            <IonGrid>
                              <IonRow>
                                {region.banks.map((bank) => (
                                  <IonCol key={bank.srNo} size="12" size-md="6" size-lg="4">
                                    <div className="bank-card">
                                      <div className="bank-card-header">
                                        <h4>{bank.bankName}</h4>
                                        <IonBadge color="primary">#{bank.srNo}</IonBadge>
                                      </div>
                                      <div className="bank-metrics">
                                        <div className="metric">
                                          <span className="metric-label">Target</span>
                                          <span className="metric-value">{formatCurrency(bank.target.fin)}</span>
                                        </div>
                                        <div className="metric">
                                          <span className="metric-label">Disbursed</span>
                                          <span className="metric-value success">{formatCurrency(bank.loansDisbursed.fin)}</span>
                                        </div>
                                        <div className="metric">
                                          <span className="metric-label">Pending</span>
                                          <span className="metric-value warning">{formatNumber(bank.proposalsPending.phy)}</span>
                                        </div>
                                        <div className="metric">
                                          <span className="metric-label">Achievement</span>
                                          <IonProgressBar 
                                            value={(bank.loansDisbursed.fin / bank.target.fin)} 
                                            color="success"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </IonCol>
                                ))}
                              </IonRow>
                            </IonGrid>
                          </IonCardContent>
                        </IonCard>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              )}
            </div>
          </IonContent>

          {/* Filter Modal */}
          <IonModal isOpen={showFilterModal} onDidDismiss={() => setShowFilterModal(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Advanced Filters</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowFilterModal(false)}>
                    <IonIcon icon={closeOutline} />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="filter-modal-content">
              <div className="filter-modal-body">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Search banks, regions..."
                  className="filter-search"
                />
                
                <div className="filter-section">
                  <h3>Performance Range</h3>
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonButton expand="block" fill="outline">0-25%</IonButton>
                      </IonCol>
                      <IonCol>
                        <IonButton expand="block" fill="outline">26-50%</IonButton>
                      </IonCol>
                      <IonCol>
                        <IonButton expand="block" fill="outline">51-75%</IonButton>
                      </IonCol>
                      <IonCol>
                        <IonButton expand="block" fill="outline">76-100%</IonButton>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </div>

                <div className="filter-section">
                  <h3>Loan Amount Range</h3>
                  <IonSelect multiple={true} placeholder="Select ranges">
                    <IonSelectOption value="0-1L">₹0 - ₹1 Lakh</IonSelectOption>
                    <IonSelectOption value="1L-5L">₹1 Lakh - ₹5 Lakhs</IonSelectOption>
                    <IonSelectOption value="5L-10L">₹5 Lakhs - ₹10 Lakhs</IonSelectOption>
                    <IonSelectOption value="10L+">Above ₹10 Lakhs</IonSelectOption>
                  </IonSelect>
                </div>

                <div className="filter-actions">
                  <IonButton expand="block" color="primary" onClick={() => setShowFilterModal(false)}>
                    Apply Filters
                  </IonButton>
                  <IonButton expand="block" fill="outline">
                    Reset Filters
                  </IonButton>
                </div>
              </div>
            </IonContent>
          </IonModal>

          {/* Export Modal */}
          <IonModal isOpen={showExportModal} onDidDismiss={() => setShowExportModal(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Export Report</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowExportModal(false)}>
                    <IonIcon icon={closeOutline} />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="export-modal-content">
              <div className="export-options">
                <h3>Select Export Format</h3>
                <div className="export-buttons">
                  <IonButton
                    expand="block"
                    fill="outline"
                    className="export-button pdf"
                    onClick={() => handleExportReport('pdf')}
                  >
                    <IonIcon icon={documentOutline} slot="start" />
                    Export as PDF
                  </IonButton>
                  <IonButton
                    expand="block"
                    fill="outline"
                    className="export-button excel"
                    onClick={() => handleExportReport('excel')}
                  >
                    <IonIcon icon={barChartOutline} slot="start" />
                    Export as Excel
                  </IonButton>
                  <IonButton
                    expand="block"
                    fill="outline"
                    className="export-button csv"
                    onClick={() => handleExportReport('csv')}
                  >
                    <IonIcon icon={statsChartOutline} slot="start" />
                    Export as CSV
                  </IonButton>
                </div>
                
                <div className="export-options-advanced">
                  <h4>Additional Options</h4>
                  <IonButton expand="block" fill="outline" onClick={() => handleExportReport('email')}>
                    <IonIcon icon={shareOutline} slot="start" />
                    Share via Email
                  </IonButton>
                </div>
              </div>
            </IonContent>
          </IonModal>

          {/* Floating Action Button */}
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton className="fab-generate">
              <IonIcon icon={addOutline} />
            </IonFabButton>
          </IonFab>

          {/* Toast */}
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={3000}
            position="bottom"
            color="success"
          />
        </div>
      </IonSplitPane>
    </IonPage>
  );
};

export default Report;
