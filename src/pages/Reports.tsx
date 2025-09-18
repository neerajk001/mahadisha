import React, { useState } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonSelect, IonSelectOption, IonDatetime, IonToast
} from '@ionic/react';
import { 
  calendarOutline, arrowForwardOutline, documentOutline
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import { mockDataService } from '../services/api';
import type { RegionReportData } from '../types';
import './Reports.css';

const Reports: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedBank, setSelectedBank] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('2025-04-01');
  const [endDate, setEndDate] = useState<string>('2026-03-31');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const regionData = mockDataService.getRegionReportData();

  const handleGenerateReport = () => {
    setToastMessage('Report generation functionality will be implemented');
    setShowToast(true);
  };

  const handleExportReport = () => {
    setToastMessage('Export functionality will be implemented');
    setShowToast(true);
  };

  const handlePrintReport = () => {
    setToastMessage('Print functionality will be implemented');
    setShowToast(true);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-IN');
  };

  const formatCurrency = (num: number) => {
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <IonPage>
      <IonSplitPane contentId="dashboard-content">
        <Sidebar />
        <div className="main-content" id="dashboard-content">
          <DashboardHeader />
          
          <IonContent className="reports-content">
            <div className="reports-container">
              {/* Header Section */}
              <div className="reports-header">
                <div className="header-banner">
                  <h1>MAHATMA PHULE BACKWARD CLASS DEVELOPMENT CORPORATION LTD.</h1>
                </div>
                <div className="report-title">
                  <h2>REGION-WISE PROGRESS REPORT FOR THE MONTH OF NOVEMBER 2024-25 - SUBSIDY SCHEME</h2>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="report-navigation">
                <div className="nav-tabs">
                  <button className="nav-tab active">Bankwise Report</button>
                  <button className="nav-tab">Monthly Progress Report</button>
                  <button className="nav-tab">Activity Wise Report</button>
                  <button className="nav-tab">Due Recovery Report</button>
                  <button className="nav-tab">Recovery Report</button>
                  <button className="nav-tab">Comparative Report</button>
                  <button className="nav-tab">Region Report</button>
                </div>
              </div>

              {/* Date Range and Controls */}
              <div className="report-controls">
                <div className="date-controls">
                  <div className="date-field">
                    <label>From Date:</label>
                    <div className="date-display">
                      <span className="selected-date">{new Date(startDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
                      <IonIcon icon={calendarOutline} className="date-icon" />
                    </div>
                    <IonDatetime
                      value={startDate}
                      onIonChange={(e) => setStartDate(e.detail.value as string)}
                      presentation="date"
                      className="date-input"
                    />
                  </div>
                  <div className="date-field">
                    <label>To Date:</label>
                    <div className="date-display">
                      <span className="selected-date">{new Date(endDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
                      <IonIcon icon={calendarOutline} className="date-icon" />
                    </div>
                    <IonDatetime
                      value={endDate}
                      onIonChange={(e) => setEndDate(e.detail.value as string)}
                      presentation="date"
                      className="date-input"
                    />
                  </div>
                </div>
                <div className="action-buttons">
                  <IonButton 
                    fill="solid" 
                    className="calendar-button"
                    onClick={handleGenerateReport}
                  >
                    <IonIcon icon={calendarOutline} />
                  </IonButton>
                  <IonButton 
                    fill="solid" 
                    className="generate-button"
                    onClick={handleGenerateReport}
                  >
                    <IonIcon icon={arrowForwardOutline} />
                  </IonButton>
                  <IonButton 
                    fill="solid" 
                    className="export-button"
                    onClick={handleExportReport}
                  >
                    <IonIcon icon={documentOutline} />
                  </IonButton>
                </div>
              </div>

              {/* Filters */}
              <div className="report-filters">
                <div className="filter-group">
                  <label>Filter by Region:</label>
                  <IonSelect
                    value={selectedRegion}
                    onIonChange={(e) => setSelectedRegion(e.detail.value)}
                    className="filter-select"
                  >
                    <IonSelectOption value="All">All</IonSelectOption>
                    {regionData.map((region) => (
                      <IonSelectOption key={region.regionName} value={region.regionName}>
                        {region.regionName}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </div>
                <div className="filter-group">
                  <label>Filter by Bank:</label>
                  <IonSelect
                    value={selectedBank}
                    onIonChange={(e) => setSelectedBank(e.detail.value)}
                    className="filter-select"
                  >
                    <IonSelectOption value="All">All</IonSelectOption>
                    {regionData.flatMap(region => region.banks).map((bank) => (
                      <IonSelectOption key={bank.bankName} value={bank.bankName}>
                        {bank.bankName}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </div>
              </div>

              {/* Report Tables */}
              <div className="report-tables">
                {regionData.map((region, regionIndex) => (
                  <div key={region.regionName} className="region-section">
                    <div className="region-header">
                      <h3>{region.regionName}</h3>
                    </div>
                    <div className="table-container">
                      <table className="report-table">
                        <thead>
                          <tr className="header-row">
                            <th rowSpan={2}>Sr. No.</th>
                            <th rowSpan={2}>Name of the Bank</th>
                            <th colSpan={2}>Target</th>
                            <th colSpan={2}>Previous Year Proposals Pending in Bank</th>
                            <th colSpan={2}>Proposals Sent to Bank</th>
                            <th colSpan={2}>Loans Sanctioned by Bank</th>
                            <th colSpan={2}>Loans Disbursed</th>
                            <th colSpan={2}>Proposals Returned by Bank</th>
                            <th colSpan={2}>Proposals Rejected</th>
                            <th colSpan={2}>Proposals Pending in Bank</th>
                          </tr>
                          <tr className="sub-header-row">
                            <th>Phy.</th>
                            <th>Fin.</th>
                            <th>Phy.</th>
                            <th>Fin.</th>
                            <th>Phy.</th>
                            <th>Fin.</th>
                            <th>Phy.</th>
                            <th>Fin.</th>
                            <th>Phy.</th>
                            <th>Fin.</th>
                            <th>Phy.</th>
                            <th>Fin.</th>
                            <th>Phy.</th>
                            <th>Fin.</th>
                            <th>Phy.</th>
                            <th>Fin.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {region.banks.map((bank) => (
                            <tr key={bank.srNo} className="data-row">
                              <td>{bank.srNo}</td>
                              <td className="bank-name">{bank.bankName}</td>
                              <td>{formatNumber(bank.target.phy)}</td>
                              <td>{formatCurrency(bank.target.fin)}</td>
                              <td>{formatNumber(bank.previousYearPending.phy)}</td>
                              <td>{formatCurrency(bank.previousYearPending.fin)}</td>
                              <td>{formatNumber(bank.proposalsSent.phy)}</td>
                              <td>{formatCurrency(bank.proposalsSent.fin)}</td>
                              <td>{formatNumber(bank.loansSanctioned.phy)}</td>
                              <td>{formatCurrency(bank.loansSanctioned.fin)}</td>
                              <td>{formatNumber(bank.loansDisbursed.phy)}</td>
                              <td>{formatCurrency(bank.loansDisbursed.fin)}</td>
                              <td>{formatNumber(bank.proposalsReturned.phy)}</td>
                              <td>{formatCurrency(bank.proposalsReturned.fin)}</td>
                              <td>{formatNumber(bank.proposalsRejected.phy)}</td>
                              <td>{formatCurrency(bank.proposalsRejected.fin)}</td>
                              <td>{formatNumber(bank.proposalsPending.phy)}</td>
                              <td>{formatCurrency(bank.proposalsPending.fin)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

export default Reports;
