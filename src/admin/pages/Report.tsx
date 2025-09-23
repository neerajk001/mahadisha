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
  shareOutline,
  addOutline
} from 'ionicons/icons';
import Sidebar from '../components/sidebar/Sidebar';
import DashboardHeader from '../components/header/DashboardHeader';
import { mockDataService } from '../../services/api';
import type { MonthlyProgressData } from '../../types';

// Activity Wise Report Types
interface ActivityWiseData {
  srNo: number;
  schemeName: string;
  total: {
    beneficiaries: number;
    subsidy: number;
    mm: number;
    bankLoan: number;
  };
}

// Due Recovery Report Types
interface DueRecoveryData {
  srNo: number;
  particulars: string;
  nsfdc: {
    tl: number;
    mcf: number;
    msy: number;
    edu: number;
    total: number;
  };
  nskfdc: {
    tl: number;
    mcf: number;
    msy: number;
    total: number;
    mm: number;
  };
  marginMoney: {
    nsfdc: number;
    dfs: number;
    total: number;
  };
  nss: number;
  nbcfdc: number;
  nmfdc: number;
  pilot: number;
  total: number;
}

interface SchemeTab {
  id: string;
  name: string;
  isActive: boolean;
}

// Comparative Report Types
interface ComparativeReportData {
  srNo: number;
  district: string;
  juneToJuly2024: {
    phy: number;
    fin: number;
  };
  juneToJuly2025: {
    phy: number;
    fin: number;
  };
  difference: {
    phy: number;
    fin: number;
  };
}

// Regional Report Types
interface RegionalReportData {
  srNo: number;
  district: string;
  state: {
    subsidyScheme: number;
    directFinanceScheme: number;
    marginMoneyScheme: number;
  };
  centralNSFDC: {
    educationLoanIndia: number;
    utkarshLoanScheme: number;
    educationLoanAbroad: number;
    microCreditFinance: number;
    suvidhaLoanScheme: number;
    mahilaSamruddhiYojana: number;
  };
  centralNSKFDC: {
    greenBusinessScheme: number;
    payUseCommunityToilet: number;
    educationLoanAbroad: number;
    swachhtaUdyamiYojana: number;
    mahilaSamruddhiYojana: number;
    sanitaryMartsScheme: number;
    microCreditFinance: number;
    mahilaAdhikaritaScheme: number;
    generalTermLoanScheme: number;
    total: number;
  };
}

interface RegionData {
  regionName: string;
  districts: RegionalReportData[];
}

import './Report.css';

// Types
interface BankRegionData {
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
  const [activeSchemeTab, setActiveSchemeTab] = useState<string>('abstract');

  // Get monthly progress data
  const monthlyProgressData = mockDataService.getMonthlyProgressData();

  // Activity Wise Report Data
  const activityWiseData: ActivityWiseData[] = [
    {
      srNo: 1,
      schemeName: 'Agriculture Equipment Loan',
      total: {
        beneficiaries: 150,
        subsidy: 2500000,
        mm: 500000,
        bankLoan: 2000000
      }
    },
    {
      srNo: 2,
      schemeName: 'Livestock Development',
      total: {
        beneficiaries: 200,
        subsidy: 3000000,
        mm: 600000,
        bankLoan: 2400000
      }
    },
    {
      srNo: 3,
      schemeName: 'Small Business Loan',
      total: {
        beneficiaries: 100,
        subsidy: 1500000,
        mm: 300000,
        bankLoan: 1200000
      }
    },
    {
      srNo: 4,
      schemeName: 'Education Loan',
      total: {
        beneficiaries: 75,
        subsidy: 1200000,
        mm: 240000,
        bankLoan: 960000
      }
    },
    {
      srNo: 5,
      schemeName: 'Housing Loan',
      total: {
        beneficiaries: 300,
        subsidy: 4500000,
        mm: 900000,
        bankLoan: 3600000
      }
    },
    {
      srNo: 6,
      schemeName: 'Women Entrepreneurship',
      total: {
        beneficiaries: 120,
        subsidy: 1800000,
        mm: 360000,
        bankLoan: 1440000
      }
    },
    {
      srNo: 7,
      schemeName: 'Rural Development',
      total: {
        beneficiaries: 250,
        subsidy: 3750000,
        mm: 750000,
        bankLoan: 3000000
      }
    },
    {
      srNo: 8,
      schemeName: 'Technology Upgrade',
      total: {
        beneficiaries: 80,
        subsidy: 1200000,
        mm: 240000,
        bankLoan: 960000
      }
    }
  ];

  // Due Recovery Report Data
  const dueRecoveryData: DueRecoveryData[] = [
    {
      srNo: 1,
      particulars: 'Opening Balance',
      nsfdc: { tl: 1500000, mcf: 800000, msy: 600000, edu: 400000, total: 3300000 },
      nskfdc: { tl: 1200000, mcf: 700000, msy: 500000, total: 2400000, mm: 300000 },
      marginMoney: { nsfdc: 200000, dfs: 150000, total: 350000 },
      nss: 100000,
      nbcfdc: 80000,
      nmfdc: 60000,
      pilot: 40000,
      total: 6210000
    },
    {
      srNo: 2,
      particulars: 'Amount Disbursed During the Year',
      nsfdc: { tl: 2000000, mcf: 1000000, msy: 800000, edu: 600000, total: 4400000 },
      nskfdc: { tl: 1500000, mcf: 900000, msy: 700000, total: 3100000, mm: 400000 },
      marginMoney: { nsfdc: 300000, dfs: 200000, total: 500000 },
      nss: 150000,
      nbcfdc: 120000,
      nmfdc: 100000,
      pilot: 80000,
      total: 8350000
    },
    {
      srNo: 3,
      particulars: 'Total Amount Due',
      nsfdc: { tl: 3500000, mcf: 1800000, msy: 1400000, edu: 1000000, total: 7700000 },
      nskfdc: { tl: 2700000, mcf: 1600000, msy: 1200000, total: 5500000, mm: 700000 },
      marginMoney: { nsfdc: 500000, dfs: 350000, total: 850000 },
      nss: 250000,
      nbcfdc: 200000,
      nmfdc: 160000,
      pilot: 120000,
      total: 14560000
    },
    {
      srNo: 4,
      particulars: 'Amount Recovered During the Year',
      nsfdc: { tl: 1200000, mcf: 600000, msy: 500000, edu: 300000, total: 2600000 },
      nskfdc: { tl: 1000000, mcf: 500000, msy: 400000, total: 1900000, mm: 200000 },
      marginMoney: { nsfdc: 150000, dfs: 100000, total: 250000 },
      nss: 80000,
      nbcfdc: 60000,
      nmfdc: 50000,
      pilot: 40000,
      total: 5110000
    },
    {
      srNo: 5,
      particulars: 'Outstanding Amount',
      nsfdc: { tl: 2300000, mcf: 1200000, msy: 900000, edu: 700000, total: 5100000 },
      nskfdc: { tl: 1700000, mcf: 1100000, msy: 800000, total: 3600000, mm: 500000 },
      marginMoney: { nsfdc: 350000, dfs: 250000, total: 600000 },
      nss: 170000,
      nbcfdc: 140000,
      nmfdc: 110000,
      pilot: 80000,
      total: 9450000
    }
  ];

  // Scheme Tabs for Due Recovery
  const schemeTabs: SchemeTab[] = [
    { id: 'abstract', name: 'Abstract', isActive: true },
    { id: 'green-business', name: 'Green Business Scheme (NSKFDC)', isActive: false },
    { id: 'pay-use-toilet', name: 'Pay & Use Community Toilet Scheme (NSKFDC)', isActive: false },
    { id: 'education-abroad', name: 'Education Loan Scheme (NSKFDC ABROAD)', isActive: false },
    { id: 'subsidy-state', name: 'Subsidy Scheme (State)', isActive: false },
    { id: 'direct-finance', name: 'Direct Finance Scheme (State)', isActive: false },
    { id: 'swachhata', name: 'Swachhata Scheme', isActive: false },
    { id: 'micro-credit', name: 'Micro Credit Finance Scheme (NSKFDC)', isActive: false },
    { id: 'mahila-adhikarita', name: 'Mahila Adhikarita Scheme (NSKFDC For Women)', isActive: false },
    { id: 'education-india', name: 'Education Loan Scheme (NSKFDC INDIA)', isActive: false },
    { id: 'margin-money', name: 'Margin Money Scheme (State)', isActive: false },
    { id: 'suvidha', name: 'Suvidha Loan Scheme', isActive: false },
    { id: 'utkarsh', name: 'Utkarsh Loan Scheme', isActive: false }
  ];

  // Comparative Report Data
  const comparativeReportData: ComparativeReportData[] = [
    {
      srNo: 1,
      district: 'Pune',
      juneToJuly2024: { phy: 150, fin: 2500000 },
      juneToJuly2025: { phy: 180, fin: 3200000 },
      difference: { phy: 30, fin: 700000 }
    },
    {
      srNo: 2,
      district: 'Mumbai',
      juneToJuly2024: { phy: 200, fin: 3200000 },
      juneToJuly2025: { phy: 220, fin: 3800000 },
      difference: { phy: 20, fin: 600000 }
    },
    {
      srNo: 3,
      district: 'Nagpur',
      juneToJuly2024: { phy: 120, fin: 1800000 },
      juneToJuly2025: { phy: 140, fin: 2200000 },
      difference: { phy: 20, fin: 400000 }
    },
    {
      srNo: 4,
      district: 'Nashik',
      juneToJuly2024: { phy: 180, fin: 2800000 },
      juneToJuly2025: { phy: 200, fin: 3200000 },
      difference: { phy: 20, fin: 400000 }
    },
    {
      srNo: 5,
      district: 'Aurangabad',
      juneToJuly2024: { phy: 100, fin: 1500000 },
      juneToJuly2025: { phy: 120, fin: 1800000 },
      difference: { phy: 20, fin: 300000 }
    },
    {
      srNo: 6,
      district: 'Kolhapur',
      juneToJuly2024: { phy: 90, fin: 1400000 },
      juneToJuly2025: { phy: 110, fin: 1700000 },
      difference: { phy: 20, fin: 300000 }
    },
    {
      srNo: 7,
      district: 'Solapur',
      juneToJuly2024: { phy: 110, fin: 1600000 },
      juneToJuly2025: { phy: 130, fin: 1900000 },
      difference: { phy: 20, fin: 300000 }
    },
    {
      srNo: 8,
      district: 'Amravati',
      juneToJuly2024: { phy: 80, fin: 1200000 },
      juneToJuly2025: { phy: 100, fin: 1500000 },
      difference: { phy: 20, fin: 300000 }
    }
  ];

  // Regional Report Data
  const regionalReportData: RegionData[] = [
    {
      regionName: 'Aurangabad Region',
      districts: [
        { srNo: 1, district: 'AURANGABAD', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 2, district: 'BEED', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 3, district: 'HINGOLI', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 4, district: 'JALNA', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 5, district: 'LATUR', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 6, district: 'NANDED', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 7, district: 'OSMANABAD', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 8, district: 'PARBHANI', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } }
      ]
    },
    {
      regionName: 'Amaravati Region',
      districts: [
        { srNo: 9, district: 'AMRAVATI', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 10, district: 'AKOLA', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 11, district: 'BULDANA', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 12, district: 'WASHIM', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 13, district: 'YAVATMAL', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } }
      ]
    },
    {
      regionName: 'Nashik Region',
      districts: [
        { srNo: 14, district: 'AHMEDNAGAR', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 15, district: 'DHULE', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 16, district: 'JALGAON', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 17, district: 'NANDURBAR', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 18, district: 'NASHIK', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } }
      ]
    },
    {
      regionName: 'Pune Region',
      districts: [
        { srNo: 19, district: 'KOLHAPUR', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 20, district: 'PUNE', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } }
      ]
    },
    {
      regionName: 'Nagpur Region',
      districts: [
        { srNo: 24, district: 'BHANDARA', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 25, district: 'CHANDRAPUR', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 26, district: 'GADCHIROLI', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 27, district: 'GONDIA', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 28, district: 'NAGPUR', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 29, district: 'WARDHA', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } }
      ]
    },
    {
      regionName: 'Mumbai Region',
      districts: [
        { srNo: 30, district: 'MUMBAI', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 31, district: 'MUMBAI - SUB', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 32, district: 'PALGHAR', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 33, district: 'RAIGAD', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 34, district: 'RATNAGIRI', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 35, district: 'SINDHUDURG', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } },
        { srNo: 36, district: 'THANE', state: { subsidyScheme: 0, directFinanceScheme: 0, marginMoneyScheme: 0 }, centralNSFDC: { educationLoanIndia: 0, utkarshLoanScheme: 0, educationLoanAbroad: 0, microCreditFinance: 0, suvidhaLoanScheme: 0, mahilaSamruddhiYojana: 0 }, centralNSKFDC: { greenBusinessScheme: 0, payUseCommunityToilet: 0, educationLoanAbroad: 0, swachhtaUdyamiYojana: 0, mahilaSamruddhiYojana: 0, sanitaryMartsScheme: 0, microCreditFinance: 0, mahilaAdhikaritaScheme: 0, generalTermLoanScheme: 0, total: 0 } }
      ]
    }
  ];

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
                  onClick={() => {
                    console.log('=== MONTHLY TAB CLICKED IN ADMIN REPORT ===');
                    console.log('Current activeTab:', activeTab);
                    setActiveTab('monthly');
                    console.log('Setting activeTab to: monthly');
                  }}
                >
                  MONTHLY PROGRESS
                </button>
                <button 
                  className={`simple-tab ${activeTab === 'activity' ? 'active' : ''}`}
                  onClick={() => {
                    console.log('=== ACTIVITY WISE TAB CLICKED ===');
                    console.log('Current activeTab:', activeTab);
                    setActiveTab('activity');
                    console.log('Setting activeTab to: activity');
                  }}
                >
                  ACTIVITY WISE
                </button>
                 <button 
                   className={`simple-tab ${activeTab === 'recovery' ? 'active' : ''}`}
                   onClick={() => {
                     console.log('=== DUE RECOVERY TAB CLICKED ===');
                     console.log('Current activeTab:', activeTab);
                     setActiveTab('recovery');
                     console.log('Setting activeTab to: recovery');
                   }}
                 >
                   DUE RECOVERY
                 </button>
                <button 
                  className={`simple-tab ${activeTab === 'recovery-detail' ? 'active' : ''}`}
                  onClick={() => setActiveTab('recovery-detail')}
                >
                  RECOVERY
                </button>
                <button 
                  className={`simple-tab ${activeTab === 'comparative' ? 'active' : ''}`}
                  onClick={() => {
                    console.log('=== COMPARATIVE TAB CLICKED ===');
                    console.log('Current activeTab:', activeTab);
                    setActiveTab('comparative');
                    console.log('Setting activeTab to: comparative');
                  }}
                >
                  COMPARATIVE
                </button>
                <button 
                  className={`simple-tab ${activeTab === 'regional' ? 'active' : ''}`}
                  onClick={() => {
                    console.log('=== REGIONAL TAB CLICKED ===');
                    console.log('Current activeTab:', activeTab);
                    console.log('Regional Report Data:', regionalReportData);
                    console.log('Number of regions:', regionalReportData.length);
                    regionalReportData.forEach((region, index) => {
                      console.log(`Region ${index + 1}: ${region.regionName} with ${region.districts.length} districts`);
                    });
                    setActiveTab('regional');
                    console.log('Setting activeTab to: regional');
                  }}
                >
                  REGIONAL
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


            {/* Report Tables/Cards */}
            <div className="report-data-container">
              {activeTab === 'monthly' ? (
                // Monthly Progress Report
                <div className="monthly-progress-section">
                  <div className="region-header">
                    <h3>Monthly Progress Report</h3>
                  </div>
                  <div className="table-responsive">
                    <table className="report-table">
                      <thead>
                        <tr className="main-header">
                          <th rowSpan={2}>Sr. No.</th>
                          <th rowSpan={2}>District</th>
                          <th colSpan={2}>Target</th>
                          <th rowSpan={2}>Bank Pendency For the Year</th>
                          <th colSpan={3}>Proposals Received</th>
                          <th colSpan={3}>Proposals Sent To Bank</th>
                          <th colSpan={3}>Sanctioned</th>
                          <th colSpan={4}>Disbursement During The Month</th>
                          <th colSpan={4}>Total Disbursement</th>
                          <th rowSpan={2}>Proposals Pending For Disbursement</th>
                          <th colSpan={2}>Proposals Rejected</th>
                          <th colSpan={2}>Proposals Pending</th>
                        </tr>
                        <tr className="sub-header">
                          <th>Phy</th>
                          <th>Fin</th>
                          <th>Up To Last Month</th>
                          <th>During The Month</th>
                          <th>Total</th>
                          <th>Up To Last Month</th>
                          <th>During The Month</th>
                          <th>Total</th>
                          <th>Up To Last Month</th>
                          <th>During The Month</th>
                          <th>Total</th>
                          <th>Beneficiaries</th>
                          <th>Subsidy</th>
                          <th>M.M.</th>
                          <th>Bank Loan</th>
                          <th>Beneficiaries</th>
                          <th>Subsidy</th>
                          <th>M.M.</th>
                          <th>Bank Loan</th>
                          <th>Bank</th>
                          <th>Office</th>
                          <th>Bank</th>
                          <th>Office</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyProgressData.map((data) => (
                          <tr key={data.srNo} className="data-row">
                            <td>{data.srNo}</td>
                            <td className="bank-name">{data.district}</td>
                            <td>{formatNumber(data.target.phy)}</td>
                            <td>{formatCurrency(data.target.fin)}</td>
                            <td>{formatNumber(data.bankPendencyForYear)}</td>
                            <td>{formatNumber(data.proposalsReceived.upToLastMonth)}</td>
                            <td>{formatNumber(data.proposalsReceived.duringTheMonth)}</td>
                            <td>{formatNumber(data.proposalsReceived.total)}</td>
                            <td>{formatNumber(data.proposalsSentToBank.upToLastMonth)}</td>
                            <td>{formatNumber(data.proposalsSentToBank.duringTheMonth)}</td>
                            <td>{formatNumber(data.proposalsSentToBank.total)}</td>
                            <td>{formatNumber(data.sanctioned.upToLastMonth)}</td>
                            <td>{formatNumber(data.sanctioned.duringTheMonth)}</td>
                            <td>{formatNumber(data.sanctioned.total)}</td>
                            <td>{formatNumber(data.disbursementDuringMonth.beneficiaries)}</td>
                            <td>{formatCurrency(data.disbursementDuringMonth.subsidy)}</td>
                            <td>{formatCurrency(data.disbursementDuringMonth.mm)}</td>
                            <td>{formatCurrency(data.disbursementDuringMonth.bankLoan)}</td>
                            <td>{formatNumber(data.totalDisbursement.beneficiaries)}</td>
                            <td>{formatCurrency(data.totalDisbursement.subsidy)}</td>
                            <td>{formatCurrency(data.totalDisbursement.mm)}</td>
                            <td>{formatCurrency(data.totalDisbursement.bankLoan)}</td>
                            <td>{formatNumber(data.proposalsPendingForDisbursement)}</td>
                            <td>{formatNumber(data.proposalsRejected.bank)}</td>
                            <td>{formatNumber(data.proposalsRejected.office)}</td>
                            <td>{formatNumber(data.proposalsPending.bank)}</td>
                            <td>{formatNumber(data.proposalsPending.office)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : activeTab === 'activity' ? (
                // Activity Wise Report
                <div className="activity-wise-section">
                  <div className="region-header">
                    <h3>Activity Wise Report</h3>
                  </div>
                  <div className="table-responsive">
                    <table className="report-table">
                      <thead>
                        <tr className="main-header">
                          <th rowSpan={2}>Sr. No.</th>
                          <th rowSpan={2}>Scheme Name</th>
                          <th colSpan={4}>Total</th>
                        </tr>
                        <tr className="sub-header">
                          <th>Beneficiaries</th>
                          <th>Subsidy</th>
                          <th>M.M.</th>
                          <th>Bank Loan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityWiseData.map((data) => (
                          <tr key={data.srNo} className="data-row">
                            <td>{data.srNo}</td>
                            <td className="bank-name">{data.schemeName}</td>
                            <td>{formatNumber(data.total.beneficiaries)}</td>
                            <td>{formatCurrency(data.total.subsidy)}</td>
                            <td>{formatCurrency(data.total.mm)}</td>
                            <td>{formatCurrency(data.total.bankLoan)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : activeTab === 'recovery' ? (
                // Due Recovery Report
                <div className="due-recovery-section">
                  <div className="due-recovery-header">
                    <h2>DUE RECOVERY STATEMENT FOR THE YEAR: 2024-25</h2>
                    <IonButton 
                      fill="solid" 
                      color="primary"
                      className="export-excel-btn"
                    >
                      <IonIcon icon={downloadOutline} slot="start" />
                      Export to Excel
                    </IonButton>
                  </div>
                  
                  {/* Scheme Navigation Tabs */}
                  <div className="scheme-tabs-container">
                    <div className="scheme-tabs">
                      {schemeTabs.map((tab) => (
                        <button
                          key={tab.id}
                          className={`scheme-tab ${activeSchemeTab === tab.id ? 'active' : ''}`}
                          onClick={() => {
                            console.log('=== SCHEME TAB CLICKED ===', tab.id);
                            setActiveSchemeTab(tab.id);
                          }}
                        >
                          {tab.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Due Recovery Table */}
                  <div className="table-responsive">
                    <table className="due-recovery-table">
                      <thead>
                        <tr className="main-header">
                          <th rowSpan={2}>Sr</th>
                          <th rowSpan={2}>PARTICULARS</th>
                          <th colSpan={5}>N. S. F. D. C.</th>
                          <th colSpan={5}>N. S. K. F. D. C.</th>
                          <th colSpan={3}>MARGIN MONEY</th>
                          <th rowSpan={2}>NSS</th>
                          <th rowSpan={2}>NBCFDC</th>
                          <th rowSpan={2}>NMFDC</th>
                          <th rowSpan={2}>PILOT</th>
                          <th rowSpan={2}>TOTAL</th>
                        </tr>
                        <tr className="sub-header">
                          <th>T.L.</th>
                          <th>MCF</th>
                          <th>MSY</th>
                          <th>Edu.</th>
                          <th>TOTAL</th>
                          <th>T. L.</th>
                          <th>MCF</th>
                          <th>MSY</th>
                          <th>TOTAL</th>
                          <th>MM</th>
                          <th>NSFDC</th>
                          <th>DFS</th>
                          <th>TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dueRecoveryData.map((data) => (
                          <tr key={data.srNo} className="data-row">
                            <td>{data.srNo}</td>
                            <td className="particulars-cell">{data.particulars}</td>
                            <td>{formatCurrency(data.nsfdc.tl)}</td>
                            <td>{formatCurrency(data.nsfdc.mcf)}</td>
                            <td>{formatCurrency(data.nsfdc.msy)}</td>
                            <td>{formatCurrency(data.nsfdc.edu)}</td>
                            <td className="total-cell">{formatCurrency(data.nsfdc.total)}</td>
                            <td>{formatCurrency(data.nskfdc.tl)}</td>
                            <td>{formatCurrency(data.nskfdc.mcf)}</td>
                            <td>{formatCurrency(data.nskfdc.msy)}</td>
                            <td className="total-cell">{formatCurrency(data.nskfdc.total)}</td>
                            <td>{formatCurrency(data.nskfdc.mm)}</td>
                            <td>{formatCurrency(data.marginMoney.nsfdc)}</td>
                            <td>{formatCurrency(data.marginMoney.dfs)}</td>
                            <td className="total-cell">{formatCurrency(data.marginMoney.total)}</td>
                            <td>{formatCurrency(data.nss)}</td>
                            <td>{formatCurrency(data.nbcfdc)}</td>
                            <td>{formatCurrency(data.nmfdc)}</td>
                            <td>{formatCurrency(data.pilot)}</td>
                            <td className="grand-total-cell">{formatCurrency(data.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : activeTab === 'comparative' ? (
                // Comparative Report
                <div className="comparative-section">
                  <div className="comparative-header">
                    <h2>Comparative Report</h2>
                    <IonButton 
                      fill="solid" 
                      color="primary"
                      className="export-excel-btn"
                    >
                      <IonIcon icon={downloadOutline} slot="start" />
                      Export to Excel
                    </IonButton>
                  </div>
                  
                  {/* Comparative Report Table */}
                  <div className="table-responsive">
                    <table className="comparative-table">
                      <thead>
                        <tr className="main-header">
                          <th rowSpan={2}>Sr. No.</th>
                          <th rowSpan={2}>District</th>
                          <th colSpan={2}>June To July 2024</th>
                          <th colSpan={2}>June To July 2025</th>
                          <th rowSpan={2}>Difference</th>
                        </tr>
                        <tr className="sub-header">
                          <th>Phy</th>
                          <th>Fin</th>
                          <th>Phy</th>
                          <th>Fin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparativeReportData.map((data) => (
                          <tr key={data.srNo} className="data-row">
                            <td>{data.srNo}</td>
                            <td className="district-cell">{data.district}</td>
                            <td>{formatNumber(data.juneToJuly2024.phy)}</td>
                            <td>{formatCurrency(data.juneToJuly2024.fin)}</td>
                            <td>{formatNumber(data.juneToJuly2025.phy)}</td>
                            <td>{formatCurrency(data.juneToJuly2025.fin)}</td>
                            <td className="difference-cell">
                              <div className="difference-content">
                                <div className="phy-diff">
                                  <span className="diff-label">Phy:</span>
                                  <span className={`diff-value ${data.difference.phy >= 0 ? 'positive' : 'negative'}`}>
                                    {data.difference.phy >= 0 ? '+' : ''}{formatNumber(data.difference.phy)}
                                  </span>
                                </div>
                                <div className="fin-diff">
                                  <span className="diff-label">Fin:</span>
                                  <span className={`diff-value ${data.difference.fin >= 0 ? 'positive' : 'negative'}`}>
                                    {data.difference.fin >= 0 ? '+' : ''}{formatCurrency(data.difference.fin)}
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : activeTab === 'regional' ? (
                // Regional Report
                <div className="regional-section">
                  <div className="regional-header">
                    <h2>Regional Report</h2>
                    <IonButton 
                      fill="solid" 
                      color="primary"
                      className="export-excel-btn"
                    >
                      <IonIcon icon={downloadOutline} slot="start" />
                      Export to Excel
                    </IonButton>
                  </div>
                  
                  {/* Debug Info for Regional Report */}
                  <div style={{padding: '10px', background: '#e0f2fe', margin: '10px 0', border: '2px solid #0ea5e9'}}>
                    <strong>🔍 REGIONAL DEBUG:</strong> 
                    <br />Number of regions: {regionalReportData.length}
                    <br />Region names: {regionalReportData.map(r => r.regionName).join(', ')}
                  </div>
                  
                  {/* Regional Report Tables */}
                  <div className="table-responsive">
                    <table className="regional-table">
                      <thead>
                        <tr className="main-header">
                          <th rowSpan={2}>#</th>
                          <th rowSpan={2}>Schemes</th>
                          <th colSpan={3}>State</th>
                          <th colSpan={6}>Central NSFDC</th>
                          <th colSpan={10}>Central NSKFDC</th>
                        </tr>
                        <tr className="sub-header">
                          <th>Subsidy Scheme</th>
                          <th>Direct Finance Scheme</th>
                          <th>Margin Money Scheme</th>
                          <th>Education Loan Scheme (NSFDC INDIA)</th>
                          <th>Utkarsh Loan Scheme (NSFDC)</th>
                          <th>Education Loan Scheme (NSFDC ABROAD)</th>
                          <th>Micro Credit Finance Scheme (NSFDC)</th>
                          <th>Suvidha Loan Scheme (NSFDC)</th>
                          <th>Mahila Samruddhi Yojana (NSFDC For Women)</th>
                          <th>Green Business Scheme (NSKFDC)</th>
                          <th>Scheme for Pay & Use Community Toilet</th>
                          <th>Education Loan Scheme (NSKFDC ABROAD)</th>
                          <th>Swachhta Udyami Yojana Scheme (NSKFDC)</th>
                          <th>Mahila Samruddhi Yojana Scheme (NSKFDC)</th>
                          <th>Sanitary Marts Scheme (NSKFDC)</th>
                          <th>Micro Credit Finance Scheme (NSKFDC)</th>
                          <th>Mahila Adhikarita Scheme (NSKFDC)</th>
                          <th>General Term Loan Scheme (NSKFDC)</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {regionalReportData.map((region) => (
                          <React.Fragment key={region.regionName}>
                            <tr className="region-header-row">
                              <td colSpan={20} className="region-header-cell">
                                {region.regionName.toUpperCase()} ({region.districts.length} districts)
                              </td>
                            </tr>
                            {region.districts.map((district) => (
                              <tr key={district.srNo} className="data-row">
                                <td>{district.srNo}</td>
                                <td className="district-cell">{district.district}</td>
                                <td>{district.state.subsidyScheme}</td>
                                <td>{district.state.directFinanceScheme}</td>
                                <td>{district.state.marginMoneyScheme}</td>
                                <td>{district.centralNSFDC.educationLoanIndia}</td>
                                <td>{district.centralNSFDC.utkarshLoanScheme}</td>
                                <td>{district.centralNSFDC.educationLoanAbroad}</td>
                                <td>{district.centralNSFDC.microCreditFinance}</td>
                                <td>{district.centralNSFDC.suvidhaLoanScheme}</td>
                                <td>{district.centralNSFDC.mahilaSamruddhiYojana}</td>
                                <td>{district.centralNSKFDC.greenBusinessScheme}</td>
                                <td>{district.centralNSKFDC.payUseCommunityToilet}</td>
                                <td>{district.centralNSKFDC.educationLoanAbroad}</td>
                                <td>{district.centralNSKFDC.swachhtaUdyamiYojana}</td>
                                <td>{district.centralNSKFDC.mahilaSamruddhiYojana}</td>
                                <td>{district.centralNSKFDC.sanitaryMartsScheme}</td>
                                <td>{district.centralNSKFDC.microCreditFinance}</td>
                                <td>{district.centralNSKFDC.mahilaAdhikaritaScheme}</td>
                                <td>{district.centralNSKFDC.generalTermLoanScheme}</td>
                                <td className="total-cell">{district.centralNSKFDC.total}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : activeTab === 'bankwise' ? (
                // Bankwise Table View
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
              ) : null}
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
