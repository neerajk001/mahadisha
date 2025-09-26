import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonButtons, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonBadge, IonChip, IonFab, IonFabButton, IonLabel
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline,
  checkmarkOutline, documentTextOutline, closeCircleOutline,
  swapVerticalOutline, eyeOutline, settingsOutline, copyOutline, linkOutline, timeOutline,
  peopleOutline, globeOutline, locationOutline, mapOutline, businessOutline, 
  barChartOutline, fileTrayOutline, accessibilityOutline, keyOutline, homeOutline, 
  gitBranchOutline, shieldOutline, shuffleOutline, checkmark
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import ActionDropdown from '../admin/components/common/ActionDropdown';
import { Pagination } from '../admin/components/shared';
import { MasterCard, MasterHeader, MasterControls, ScrollableTableContainer } from '../components/shared';
import { mockDataService } from '../services/api';
import type { StatusMappingData } from '../types';
import './StatusMapping.css';
import './shared/MasterMobile.css';

const StatusMapping: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMapping, setEditingMapping] = useState<StatusMappingData | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [statusSearchQuery, setStatusSearchQuery] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [showVisibleFieldsDropdown, setShowVisibleFieldsDropdown] = useState(false);
  const [visibleFieldsSearchQuery, setVisibleFieldsSearchQuery] = useState('');
  const [showNextStatusDropdown, setShowNextStatusDropdown] = useState(false);
  const [nextStatusSearchQuery, setNextStatusSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const visibleFieldsDropdownRef = useRef<HTMLDivElement>(null);
  const nextStatusDropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    currentStatus: '',
    role: '',
    visibleFields: '',
    nextPossibleStatuses: [] as string[]
  });
  
  // Enhanced state for new functionality
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'status' | 'role'>('status');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 5;

  // Status options for dropdown
  const statusOptions = [
    { value: "Submitted to Managing Director", label: "Submitted to Managing Director", hasCheckmark: true },
    { value: "Cleared by DGM - Finance", label: "Cleared by DGM - Finance", hasCheckmark: true },
    { value: "NPA", label: "NPA", hasCheckmark: false },
    { value: "Loan Deployment verified", label: "Loan Deployment verified", hasCheckmark: true },
    { value: "Sent to District Accountant", label: "Sent to District Accountant", hasCheckmark: true },
    { value: "Documents Verified", label: "Documents Verified", hasCheckmark: true },
    { value: "Sanctioned by General Manager", label: "Sanctioned by General Manager", hasCheckmark: true },
    { value: "Funds Disbursed to Region", label: "Funds Disbursed to Region", hasCheckmark: true },
    { value: "Sanctioned by Managing Director", label: "Sanctioned by Managing Director", hasCheckmark: true },
    { value: "Payment Accept", label: "Payment Accept", hasCheckmark: true },
    { value: "Assign to Recovery Agent", label: "Assign to Recovery Agent", hasCheckmark: true },
    { value: "Funds Sent to District Office", label: "Funds Sent to District Office", hasCheckmark: true },
    { value: "Assigned to Deputy General Manager", label: "Assigned to Deputy General Manager", hasCheckmark: true },
    { value: "Sanctioned by Selection Committee", label: "Sanctioned by Selection Committee", hasCheckmark: true },
    { value: "Submitted to Regional Accountant", label: "Submitted to Regional Accountant", hasCheckmark: true },
    { value: "Proposal Rejected by Bank", label: "Proposal Rejected by Bank", hasCheckmark: false },
    { value: "Accepted", label: "Accepted", hasCheckmark: true },
    { value: "Sanctioned", label: "Sanctioned", hasCheckmark: true },
    { value: "Submitted to Head Office", label: "Submitted to Head Office", hasCheckmark: true },
    { value: "Cleared by GM Finance", label: "Cleared by GM Finance", hasCheckmark: true },
    { value: "Payment Pending", label: "Payment Pending", hasCheckmark: false },
    { value: "Approval for Bank", label: "Approval for Bank", hasCheckmark: true },
    { value: "Proposals Pending in Bank", label: "Proposals Pending in Bank", hasCheckmark: false },
    { value: "Incomplete Application", label: "Incomplete Application", hasCheckmark: false },
    { value: "Disbursement Processed", label: "Disbursement Processed", hasCheckmark: true },
    { value: "Approved for Disbursement", label: "Approved for Disbursement", hasCheckmark: true },
    { value: "State Scheme Sanctioned", label: "State Scheme Sanctioned", hasCheckmark: true },
    { value: "Submitted to Assistant General Manager P2", label: "Submitted to Assistant General Manager P2", hasCheckmark: true },
    { value: "Approved and Submitted to Account Assistant Officer", label: "Approved and Submitted to Account Assistant Officer", hasCheckmark: true },
    { value: "Pending", label: "Pending", hasCheckmark: false },
    { value: "Proposal sent to Bank", label: "Proposal sent to Bank", hasCheckmark: true },
    { value: "Return Money Demand Raised", label: "Return Money Demand Raised", hasCheckmark: false },
    { value: "Submitted to General Manager P1", label: "Submitted to General Manager P1", hasCheckmark: true },
    { value: "Proposal Sent to Bank", label: "Proposal Sent to Bank", hasCheckmark: true },
    { value: "Proposal Pending in bank", label: "Proposal Pending in bank", hasCheckmark: false },
    { value: "Application Received in Regional Office", label: "Application Received in Regional Office", hasCheckmark: true },
    { value: "Submitted for Selection Committee review", label: "Submitted for Selection Committee review", hasCheckmark: true },
    { value: "Loans Dirbursed Proposals", label: "Loans Dirbursed Proposals", hasCheckmark: false },
    { value: "Recieved by Head Office", label: "Recieved by Head Office", hasCheckmark: true },
    { value: "Rejected by Head Office", label: "Rejected by Head Office", hasCheckmark: false },
    { value: "Sanctioned By Regional Manager", label: "Sanctioned By Regional Manager", hasCheckmark: true },
    { value: "Application Received", label: "Application Received", hasCheckmark: false },
    { value: "Submitted to Regional Office", label: "Submitted to Regional Office", hasCheckmark: true },
    { value: "Documents Rejected", label: "Documents Rejected", hasCheckmark: false },
    { value: "Submitted to Regional Manager", label: "Submitted to Regional Manager", hasCheckmark: true },
    { value: "Funds Sent to Regional Office", label: "Funds Sent to Regional Office", hasCheckmark: true },
    { value: "Sent for Regional Office approval", label: "Sent for Regional Office approval", hasCheckmark: true },
    { value: "Approved by Bank", label: "Approved by Bank", hasCheckmark: true },
    { value: "State Scheme Disbursed", label: "State Scheme Disbursed", hasCheckmark: true },
    { value: "Partial Payment", label: "Partial Payment", hasCheckmark: true },
    { value: "Submitted to Assistant General Manager P3", label: "Submitted to Assistant General Manager P3", hasCheckmark: true },
    { value: "Approved By Selection Committee", label: "Approved By Selection Committee", hasCheckmark: true },
    { value: "Loan sanctioned by Bank", label: "Loan sanctioned by Bank", hasCheckmark: true },
    { value: "Defaulted", label: "Defaulted", hasCheckmark: false },
    { value: "Submitted to Deputy General Manager P3", label: "Submitted to Deputy General Manager P3", hasCheckmark: true },
    { value: "Submitted to Deputy General Manager P2", label: "Submitted to Deputy General Manager P2", hasCheckmark: true },
    { value: "Return by Bank", label: "Return by Bank", hasCheckmark: true },
    { value: "Due diligence failed", label: "Due diligence failed", hasCheckmark: false },
    { value: "Submitted to Selection Committee review", label: "Submitted to Selection Committee review", hasCheckmark: true },
    { value: "Cleared by AGM - Finance", label: "Cleared by AGM - Finance", hasCheckmark: true },
    { value: "Disbursement Executed", label: "Disbursement Executed", hasCheckmark: true },
    { value: "Proposals Rejected", label: "Proposals Rejected", hasCheckmark: false },
    { value: "Rejected", label: "Rejected", hasCheckmark: false },
    { value: "Submitted to District Assistant", label: "Submitted to District Assistant", hasCheckmark: true },
    { value: "Due diligence verified", label: "Due diligence verified", hasCheckmark: true },
    { value: "Submitted to General Manager P2", label: "Submitted to General Manager P2", hasCheckmark: true },
    { value: "Cleared for Disbursement", label: "Cleared for Disbursement", hasCheckmark: true },
    { value: "Sent to Regional Assistant", label: "Sent to Regional Assistant", hasCheckmark: true },
    { value: "Submitted to General Manager P3", label: "Submitted to General Manager P3", hasCheckmark: true },
    { value: "Submitted to Deputy General Manager P1", label: "Submitted to Deputy General Manager P1", hasCheckmark: true },
    { value: "Eligible for Sanctioning and Disbursement", label: "Eligible for Sanctioning and Disbursement", hasCheckmark: true },
    { value: "Submitted to Assistant General Manager P1", label: "Submitted to Assistant General Manager P1", hasCheckmark: true },
    { value: "Central Schemed Sanctioned", label: "Central Schemed Sanctioned", hasCheckmark: true },
    { value: "Submitted to District Manager", label: "Submitted to District Manager", hasCheckmark: true },
    { value: "Disbursed", label: "Disbursed", hasCheckmark: true },
    { value: "Funds Disbursed to District", label: "Funds Disbursed to District", hasCheckmark: true },
    { value: "Rejected by Selection Committee", label: "Rejected by Selection Committee", hasCheckmark: false },
    { value: "Submitted to Deputy General Manager Finance", label: "Submitted to Deputy General Manager Finance", hasCheckmark: true },
    { value: "Submitted to Assistant General Manager Finance", label: "Submitted to Assistant General Manager Finance", hasCheckmark: true },
    { value: "Disbursed by Bank", label: "Disbursed by Bank", hasCheckmark: true },
    { value: "Return by Bank", label: "Return by Bank", hasCheckmark: true }
  ];

  // Role options for dropdown
  const roleOptions = [
    { value: "Wardha_District Accountant", label: "Wardha_District Accountant", hasCheckmark: true },
    { value: "Thane_District Accountant", label: "Thane_District Accountant", hasCheckmark: true },
    { value: "Thane_District Scrutiny Clerk", label: "Thane_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Nashik_District Assistant", label: "Nashik_District Assistant", hasCheckmark: true },
    { value: "Aurangabad(Chh. Sambhaji Nagar)_District Accountant", label: "Aurangabad(Chh. Sambhaji Nagar)_District Accountant", hasCheckmark: true },
    { value: "Buldhana_District Manager", label: "Buldhana_District Manager", hasCheckmark: true },
    { value: "Nashik_District Manager", label: "Nashik_District Manager", hasCheckmark: true },
    { value: "Aurangabad (Chh.Sambhaji Nagar) Region_Regional Accountant", label: "Aurangabad (Chh.Sambhaji Nagar) Region_Regional Accountant", hasCheckmark: true },
    { value: "Nanded_District Assistant", label: "Nanded_District Assistant", hasCheckmark: true },
    { value: "Wardha_Scrutiny Clerk", label: "Wardha_Scrutiny Clerk", hasCheckmark: false },
    { value: "Solapur_District Assistant", label: "Solapur_District Assistant", hasCheckmark: true },
    { value: "General Manager P2", label: "General Manager P2", hasCheckmark: true },
    { value: "Amravati_District Manager", label: "Amravati_District Manager", hasCheckmark: true },
    { value: "Hingoli_District Assistant", label: "Hingoli_District Assistant", hasCheckmark: true },
    { value: "Ratnagiri_District Manager", label: "Ratnagiri_District Manager", hasCheckmark: true },
    { value: "Sindhudurg_District Accountant", label: "Sindhudurg_District Accountant", hasCheckmark: true },
    { value: "Sindhudurg_District Scrutiny Clerk", label: "Sindhudurg_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Mumbai Suburban_District Manager", label: "Mumbai Suburban_District Manager", hasCheckmark: true },
    { value: "Aurangabad(Chh. Sambhaji Nagar)_District Assistant", label: "Aurangabad(Chh. Sambhaji Nagar)_District Assistant", hasCheckmark: true },
    { value: "Chandrapur_District Accountant", label: "Chandrapur_District Accountant", hasCheckmark: true },
    { value: "Satara_District_Selection Committee", label: "Satara_District_Selection Committee", hasCheckmark: true },
    { value: "Beed_District_Selection Committee", label: "Beed_District_Selection Committee", hasCheckmark: true },
    { value: "Nanded_District_Selection Committee", label: "Nanded_District_Selection Committee", hasCheckmark: true },
    { value: "Nagpur_District_Selection Committee", label: "Nagpur_District_Selection Committee", hasCheckmark: true },
    { value: "Nandurbar_District Assistant", label: "Nandurbar_District Assistant", hasCheckmark: true },
    { value: "Dhule_District Assistant", label: "Dhule_District Assistant", hasCheckmark: true },
    { value: "Raigad_District Manager", label: "Raigad_District Manager", hasCheckmark: true },
    { value: "Raigad_District Assistant", label: "Raigad_District Assistant", hasCheckmark: true },
    { value: "Latur_District Accountant", label: "Latur_District Accountant", hasCheckmark: true },
    { value: "Jalgaon_District Assistant", label: "Jalgaon_District Assistant", hasCheckmark: true },
    { value: "Amravati Region_Regional Manager", label: "Amravati Region_Regional Manager", hasCheckmark: true },
    { value: "Solapur_Scrutiny Clerk", label: "Solapur_Scrutiny Clerk", hasCheckmark: false },
    { value: "Managing Director", label: "Managing Director", hasCheckmark: true },
    { value: "Gondia_District Scrutiny Clerk", label: "Gondia_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Assistant General Manager P2 / P3", label: "Assistant General Manager P2 / P3", hasCheckmark: true },
    { value: "Mumbai Suburban_District Accountant", label: "Mumbai Suburban_District Accountant", hasCheckmark: true },
    { value: "Parbhani_District_Selection Committee", label: "Parbhani_District_Selection Committee", hasCheckmark: true },
    { value: "Latur_District_Selection Committee", label: "Latur_District_Selection Committee", hasCheckmark: true },
    { value: "Assistant General Manager P2", label: "Assistant General Manager P2", hasCheckmark: true },
    { value: "Kolhapur_District_Selection Committee", label: "Kolhapur_District_Selection Committee", hasCheckmark: true },
    { value: "Solapur_District_Selection Committee", label: "Solapur_District_Selection Committee", hasCheckmark: true },
    { value: "Mumbai City_District_Selection Committee", label: "Mumbai City_District_Selection Committee", hasCheckmark: true },
    { value: "Hingoli_District_Selection Committee", label: "Hingoli_District_Selection Committee", hasCheckmark: true },
    { value: "Jalgaon_District_Selection Committee", label: "Jalgaon_District_Selection Committee", hasCheckmark: true },
    { value: "Latur_District Manager", label: "Latur_District Manager", hasCheckmark: true },
    { value: "Parbhani_Scrutiny Clerk", label: "Parbhani_Scrutiny Clerk", hasCheckmark: false },
    { value: "Sangli_Scrutiny Clerk", label: "Sangli_Scrutiny Clerk", hasCheckmark: false },
    { value: "Amravati_District Assistant", label: "Amravati_District Assistant", hasCheckmark: true },
    { value: "Nashik_District Scrutiny Clerk", label: "Nashik_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Thane_District Assistant", label: "Thane_District Assistant", hasCheckmark: true },
    { value: "Mumbai Region_Regional Clerk", label: "Mumbai Region_Regional Clerk", hasCheckmark: false },
    { value: "Nagpur Region_Regional Clerk", label: "Nagpur Region_Regional Clerk", hasCheckmark: false },
    { value: "Nanded_District Accountant", label: "Nanded_District Accountant", hasCheckmark: true },
    { value: "Satara_Scrutiny Clerk", label: "Satara_Scrutiny Clerk", hasCheckmark: false },
    { value: "Chandrapur_District Assistant", label: "Chandrapur_District Assistant", hasCheckmark: true },
    { value: "Assistant General Manager P1", label: "Assistant General Manager P1", hasCheckmark: true },
    { value: "Pune Region_Regional Manager", label: "Pune Region_Regional Manager", hasCheckmark: true },
    { value: "Chandrapur_District Manager", label: "Chandrapur_District Manager", hasCheckmark: true },
    { value: "Ahilyanagar_District Accountant", label: "Ahilyanagar_District Accountant", hasCheckmark: true },
    { value: "Jalna_District Manager", label: "Jalna_District Manager", hasCheckmark: true },
    { value: "Parbhani_District Accountant", label: "Parbhani_District Accountant", hasCheckmark: true },
    { value: "Aurangabad(Chh. Sambhaji Nagar)_District Scrutiny Clerk", label: "Aurangabad(Chh. Sambhaji Nagar)_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Deputy General Manager - Recovery", label: "Deputy General Manager - Recovery", hasCheckmark: true },
    { value: "Jalna_District Assistant", label: "Jalna_District Assistant", hasCheckmark: true },
    { value: "Yavatmal_District Assistant", label: "Yavatmal_District Assistant", hasCheckmark: true },
    { value: "Gondia_District Manager", label: "Gondia_District Manager", hasCheckmark: true },
    { value: "Bhandara_District Manager", label: "Bhandara_District Manager", hasCheckmark: true },
    { value: "Gadchiroli_District Assistant", label: "Gadchiroli_District Assistant", hasCheckmark: true },
    { value: "Amravati Region_Regional Accountant", label: "Amravati Region_Regional Accountant", hasCheckmark: true },
    { value: "Nagpur_Scrutiny Clerk", label: "Nagpur_Scrutiny Clerk", hasCheckmark: false },
    { value: "Nashik Region_Regional Assistant", label: "Nashik Region_Regional Assistant", hasCheckmark: true },
    { value: "Gondia_District Assistant", label: "Gondia_District Assistant", hasCheckmark: true },
    { value: "Thane_District_Selection Committee", label: "Thane_District_Selection Committee", hasCheckmark: true },
    { value: "Nandurbar_District_Selection Committee", label: "Nandurbar_District_Selection Committee", hasCheckmark: true },
    { value: "Nagpur Region_Regional Manager", label: "Nagpur Region_Regional Manager", hasCheckmark: true },
    { value: "Nagpur Region_Regional Accountant", label: "Nagpur Region_Regional Accountant", hasCheckmark: true },
    { value: "Nagpur_District Accountant", label: "Nagpur_District Accountant", hasCheckmark: true },
    { value: "Nagpur_District Assistant", label: "Nagpur_District Assistant", hasCheckmark: true },
    { value: "Wardha_District Assistant", label: "Wardha_District Assistant", hasCheckmark: true },
    { value: "Yavatmal_District Accountant", label: "Yavatmal_District Accountant", hasCheckmark: true },
    { value: "Hingoli_District Manager", label: "Hingoli_District Manager", hasCheckmark: true },
    { value: "Dharashiv_District Manager", label: "Dharashiv_District Manager", hasCheckmark: true },
    { value: "Parbhani_District Manager", label: "Parbhani_District Manager", hasCheckmark: true },
    { value: "General Manager P3", label: "General Manager P3", hasCheckmark: true },
    { value: "Aurangabad (Chh.Sambhaji Nagar) Region_Regional Manager", label: "Aurangabad (Chh.Sambhaji Nagar) Region_Regional Manager", hasCheckmark: true },
    { value: "Sangli_District Accountant", label: "Sangli_District Accountant", hasCheckmark: true },
    { value: "Palghar_Scrutiny Clerk", label: "Palghar_Scrutiny Clerk", hasCheckmark: false },
    { value: "Gadchiroli_District Manager", label: "Gadchiroli_District Manager", hasCheckmark: true },
    { value: "Gadchiroli_District Scrutiny Clerk", label: "Gadchiroli_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Bhandara_District Assistant", label: "Bhandara_District Assistant", hasCheckmark: true },
    { value: "Ahilyanagar_District Manager", label: "Ahilyanagar_District Manager", hasCheckmark: true },
    { value: "Pune_District Assistant", label: "Pune_District Assistant", hasCheckmark: true },
    { value: "Nashik_District_Selection Committee", label: "Nashik_District_Selection Committee", hasCheckmark: true },
    { value: "Gadchiroli_District_Selection Committee", label: "Gadchiroli_District_Selection Committee", hasCheckmark: true },
    { value: "Amravati Region_Regional Assistant", label: "Amravati Region_Regional Assistant", hasCheckmark: true },
    { value: "Nanded_Scrutiny Clerk", label: "Nanded_Scrutiny Clerk", hasCheckmark: false },
    { value: "Mumbai Suburban_District Scrutiny Clerk", label: "Mumbai Suburban_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Beed_Scrutiny Clerk", label: "Beed_Scrutiny Clerk", hasCheckmark: false },
    { value: "Mumbai Suburban_District Assistant", label: "Mumbai Suburban_District Assistant", hasCheckmark: true },
    { value: "Ratnagiri_District Assistant", label: "Ratnagiri_District Assistant", hasCheckmark: true },
    { value: "Latur_District Scrutiny Clerk", label: "Latur_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Jalna_District Accountant", label: "Jalna_District Accountant", hasCheckmark: true },
    { value: "Jalna_District Assistant", label: "Jalna_District Assistant", hasCheckmark: true },
    { value: "Assistant General Manager Finance", label: "Assistant General Manager Finance", hasCheckmark: true },
    { value: "Assistant General Manager admin", label: "Assistant General Manager admin", hasCheckmark: true },
    { value: "Dhule_District_Selection Committee", label: "Dhule_District_Selection Committee", hasCheckmark: true },
    { value: "Gondia_District_Selection Committee", label: "Gondia_District_Selection Committee", hasCheckmark: true },
    { value: "Hingoli_District Accountant", label: "Hingoli_District Accountant", hasCheckmark: true },
    { value: "Pune Region_Regional Accountant", label: "Pune Region_Regional Accountant", hasCheckmark: true },
    { value: "Washim_District Manager", label: "Washim_District Manager", hasCheckmark: true },
    { value: "Ahilyanagar_District Scrutiny Clerk", label: "Ahilyanagar_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Mumbai Region_Regional Assistant", label: "Mumbai Region_Regional Assistant", hasCheckmark: true },
    { value: "Assistant General Manager Recovery", label: "Assistant General Manager Recovery", hasCheckmark: true },
    { value: "Pune_District_Selection Committee", label: "Pune_District_Selection Committee", hasCheckmark: true },
    { value: "Washim_District_Selection Committee", label: "Washim_District_Selection Committee", hasCheckmark: true },
    { value: "Sindhudurg_District Manager", label: "Sindhudurg_District Manager", hasCheckmark: true },
    { value: "Mumbai City_District Accountant", label: "Mumbai City_District Accountant", hasCheckmark: true },
    { value: "Dhule_District Manager", label: "Dhule_District Manager", hasCheckmark: true },
    { value: "Thane_new test role", label: "Thane_new test role", hasCheckmark: false },
    { value: "Jalgaon_District Manager", label: "Jalgaon_District Manager", hasCheckmark: true },
    { value: "Deputy General Manager Finance", label: "Deputy General Manager Finance", hasCheckmark: true },
    { value: "Amravati_District Accountant", label: "Amravati_District Accountant", hasCheckmark: true },
    { value: "Nashik_District Accountant", label: "Nashik_District Accountant", hasCheckmark: true },
    { value: "Chandrapur_District Scrutiny Clerk", label: "Chandrapur_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Palghar_District Manager", label: "Palghar_District Manager", hasCheckmark: true },
    { value: "Kolhapur_District Accountant", label: "Kolhapur_District Accountant", hasCheckmark: true },
    { value: "Head Office Assistant", label: "Head Office Assistant", hasCheckmark: true },
    { value: "Solapur_District Accountant", label: "Solapur_District Accountant", hasCheckmark: true },
    { value: "Dharashiv_District Assistant", label: "Dharashiv_District Assistant", hasCheckmark: true },
    { value: "Ahilyanagar_District Assistant", label: "Ahilyanagar_District Assistant", hasCheckmark: true },
    { value: "Buldhana_District Assistant", label: "Buldhana_District Assistant", hasCheckmark: true },
    { value: "Beneficiary", label: "Beneficiary", hasCheckmark: false },
    { value: "Dharashiv_District Scrutiny Clerk", label: "Dharashiv_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Deputy General Manager P2", label: "Deputy General Manager P2", hasCheckmark: true },
    { value: "Sangli_District Manager", label: "Sangli_District Manager", hasCheckmark: true },
    { value: "Kolhapur_District Manager", label: "Kolhapur_District Manager", hasCheckmark: true },
    { value: "Nanded_District Manager", label: "Nanded_District Manager", hasCheckmark: true },
    { value: "Nashik Region_Regional Clerk", label: "Nashik Region_Regional Clerk", hasCheckmark: false },
    { value: "Pune_District Scrutiny Clerk", label: "Pune_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Solapur_District Manager", label: "Solapur_District Manager", hasCheckmark: true },
    { value: "Jalgaon_District Accountant", label: "Jalgaon_District Accountant", hasCheckmark: true },
    { value: "Dharashiv_District Accountant", label: "Dharashiv_District Accountant", hasCheckmark: true },
    { value: "Mumbai Region_Regional Manager", label: "Mumbai Region_Regional Manager", hasCheckmark: true },
    { value: "Satara_District Assistant", label: "Satara_District Assistant", hasCheckmark: true },
    { value: "Dhule_District Accountant", label: "Dhule_District Accountant", hasCheckmark: true },
    { value: "Nandurbar_District Accountant", label: "Nandurbar_District Accountant", hasCheckmark: true },
    { value: "Mumbai City_District Scrutiny Clerk", label: "Mumbai City_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Ratnagiri_District Scrutiny Clerk", label: "Ratnagiri_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Bhandara_District Manager", label: "Bhandara_District Manager", hasCheckmark: true },
    { value: "Master Admin", label: "Master Admin", hasCheckmark: true },
    { value: "Sangli_District Assistant", label: "Sangli_District Assistant", hasCheckmark: true },
    { value: "Kolhapur_Scrutiny Clerk", label: "Kolhapur_Scrutiny Clerk", hasCheckmark: false },
    { value: "Pune Region_Regional Clerk", label: "Pune Region_Regional Clerk", hasCheckmark: false },
    { value: "Akola_District Accountant", label: "Akola_District Accountant", hasCheckmark: true },
    { value: "Kolhapur_District Assistant", label: "Kolhapur_District Assistant", hasCheckmark: true },
    { value: "Assistant General Manager P3", label: "Assistant General Manager P3", hasCheckmark: true },
    { value: "Sindhudurg_District_Selection Committee", label: "Sindhudurg_District_Selection Committee", hasCheckmark: true },
    { value: "Buldhana_District_Selection Committee", label: "Buldhana_District_Selection Committee", hasCheckmark: true },
    { value: "Yavatmal_District_Selection Committee", label: "Yavatmal_District_Selection Committee", hasCheckmark: true },
    { value: "Ahilyanagar_District_Selection Committee", label: "Ahilyanagar_District_Selection Committee", hasCheckmark: true },
    { value: "Satara_District Manager", label: "Satara_District Manager", hasCheckmark: true },
    { value: "Raigad_District_Selection Committee", label: "Raigad_District_Selection Committee", hasCheckmark: true },
    { value: "Akola_District_Selection Committee", label: "Akola_District_Selection Committee", hasCheckmark: true },
    { value: "Wardha_District_Selection Committee", label: "Wardha_District_Selection Committee", hasCheckmark: true },
    { value: "Bhandara_District Scrutiny Clerk", label: "Bhandara_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Raigad_District Accountant", label: "Raigad_District Accountant", hasCheckmark: true },
    { value: "Nandurbar_District Scrutiny Clerk", label: "Nandurbar_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Pune_District Manager", label: "Pune_District Manager", hasCheckmark: true },
    { value: "Gadchiroli_District Accountant", label: "Gadchiroli_District Accountant", hasCheckmark: true },
    { value: "Aurangabad (Chh.Sambhaji Nagar) Region_Regional Clerk", label: "Aurangabad (Chh.Sambhaji Nagar) Region_Regional Clerk", hasCheckmark: false },
    { value: "Buldhana_District Scrutiny Clerk", label: "Buldhana_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Deputy General Manager P1", label: "Deputy General Manager P1", hasCheckmark: true },
    { value: "Parbhani_District Assistant", label: "Parbhani_District Assistant", hasCheckmark: true },
    { value: "Deputy General Manager Admin", label: "Deputy General Manager Admin", hasCheckmark: true },
    { value: "Sangli_District_Selection Committee", label: "Sangli_District_Selection Committee", hasCheckmark: true },
    { value: "Amravati_District Scrutiny Clerk", label: "Amravati_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Washim_District Assistant", label: "Washim_District Assistant", hasCheckmark: true },
    { value: "Akola_District Manager", label: "Akola_District Manager", hasCheckmark: true },
    { value: "Aurangabad (Chh.Sambhaji Nagar) Region_Regional Assistant", label: "Aurangabad (Chh.Sambhaji Nagar) Region_Regional Assistant", hasCheckmark: true },
    { value: "General Manager P1", label: "General Manager P1", hasCheckmark: true },
    { value: "Amravati Region_Regional Clerk", label: "Amravati Region_Regional Clerk", hasCheckmark: false },
    { value: "Nagpur Region_Regional_Assistant", label: "Nagpur Region_Regional_Assistant", hasCheckmark: true },
    { value: "Beed_District Assistant", label: "Beed_District Assistant", hasCheckmark: true },
    { value: "Bhandara_District Accountant", label: "Bhandara_District Accountant", hasCheckmark: true },
    { value: "Sindhudurg_District Assistant", label: "Sindhudurg_District Assistant", hasCheckmark: true },
    { value: "Bhandara_District Assistant", label: "Bhandara_District Assistant", hasCheckmark: true },
    { value: "Deputy General Manager P3", label: "Deputy General Manager P3", hasCheckmark: true },
    { value: "Satara_District Accountant", label: "Satara_District Accountant", hasCheckmark: true },
    { value: "Mumbai_Blockchain", label: "Mumbai_Blockchain", hasCheckmark: false },
    { value: "Jalna_District_Selection Committee", label: "Jalna_District_Selection Committee", hasCheckmark: true },
    { value: "Bhandara_District_Selection Committee", label: "Bhandara_District_Selection Committee", hasCheckmark: true },
    { value: "Palghar_District Accountant", label: "Palghar_District Accountant", hasCheckmark: true },
    { value: "Yavatmal_District Manager", label: "Yavatmal_District Manager", hasCheckmark: true },
    { value: "Buldhana_District Accountant", label: "Buldhana_District Accountant", hasCheckmark: true },
    { value: "Mumbai Region_Regional Accountant", label: "Mumbai Region_Regional Accountant", hasCheckmark: true },
    { value: "Hingoli_District Scrutiny Clerk", label: "Hingoli_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Ratnagiri_District Accountant", label: "Ratnagiri_District Accountant", hasCheckmark: true },
    { value: "Chandrapur_District Accountant", label: "Chandrapur_District Accountant", hasCheckmark: true },
    { value: "Akola_District Scrutiny Clerk", label: "Akola_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Raigad_District Scrutiny Clerk", label: "Raigad_District Scrutiny Clerk", hasCheckmark: false },
    { value: "General Manager P2 P3 Finance- Admin", label: "General Manager P2 P3 Finance- Admin", hasCheckmark: true },
    { value: "General Manager Finance", label: "General Manager Finance", hasCheckmark: true },
    { value: "Amravati_District_Selection Committee", label: "Amravati_District_Selection Committee", hasCheckmark: true },
    { value: "Thane_Error_testing", label: "Thane_Error_testing", hasCheckmark: false },
    { value: "Aurangabad(Chh. Sambhaji Nagar)_District Manager", label: "Aurangabad(Chh. Sambhaji Nagar)_District Manager", hasCheckmark: true },
    { value: "Latur_District Assistant", label: "Latur_District Assistant", hasCheckmark: true },
    { value: "Washim_District Scrutiny Clerk", label: "Washim_District Scrutiny Clerk", hasCheckmark: false },
    { value: "Mumbai City_District Assistant", label: "Mumbai City_District Assistant", hasCheckmark: true },
    { value: "Thane_District Manager", label: "Thane_District Manager", hasCheckmark: true },
    { value: "Wardha_District Manager", label: "Wardha_District Manager", hasCheckmark: true },
    { value: "Pune Region_Regional Assistant", label: "Pune Region_Regional Assistant", hasCheckmark: true },
    { value: "General Manager P1 Recovery", label: "General Manager P1 Recovery", hasCheckmark: true }
  ];

  // Visible Fields options for dropdown
  const visibleFieldsOptions = [
    { value: "Application ID", label: "Application ID", hasCheckmark: true },
    { value: "Applicant Name", label: "Applicant Name", hasCheckmark: true },
    { value: "Loan Amount", label: "Loan Amount", hasCheckmark: true },
  
    { value: "NOC from Office Center Body", label: "NOC from Office Center Body", hasCheckmark: true }
  ];

  // Next Possible Status options for dropdown (same as Current Status)
  const nextStatusOptions = [
    { value: "Submitted to Managing Director", label: "Submitted to Managing Director", hasCheckmark: true },
    { value: "Cleared by DGM - Finance", label: "Cleared by DGM - Finance", hasCheckmark: true },
    { value: "NPA", label: "NPA", hasCheckmark: false },
    { value: "Loan Deployment verified", label: "Loan Deployment verified", hasCheckmark: true },
    { value: "Sent to District Accountant", label: "Sent to District Accountant", hasCheckmark: true },
    { value: "Documents Verified", label: "Documents Verified", hasCheckmark: true },
    { value: "Sanctioned by General Manager", label: "Sanctioned by General Manager", hasCheckmark: true },
    { value: "Funds Disbursed to Region", label: "Funds Disbursed to Region", hasCheckmark: true },
    { value: "Sanctioned by Managing Director", label: "Sanctioned by Managing Director", hasCheckmark: true },
    { value: "Payment Accept", label: "Payment Accept", hasCheckmark: true },
    { value: "Assign to Recovery Agent", label: "Assign to Recovery Agent", hasCheckmark: true },
    { value: "Funds Sent to District Office", label: "Funds Sent to District Office", hasCheckmark: true },
    { value: "Assigned to Deputy General Manager", label: "Assigned to Deputy General Manager", hasCheckmark: true },
    { value: "Sanctioned by Selection Committee", label: "Sanctioned by Selection Committee", hasCheckmark: true },
    { value: "Submitted to Regional Accountant", label: "Submitted to Regional Accountant", hasCheckmark: true },
    { value: "Proposal Rejected by Bank", label: "Proposal Rejected by Bank", hasCheckmark: false },
    { value: "Accepted", label: "Accepted", hasCheckmark: true },
    { value: "Sanctioned", label: "Sanctioned", hasCheckmark: true },
    { value: "Submitted to Head Office", label: "Submitted to Head Office", hasCheckmark: true },
    { value: "Cleared by GM Finance", label: "Cleared by GM Finance", hasCheckmark: true },
    { value: "Payment Pending", label: "Payment Pending", hasCheckmark: false },
    { value: "Approval for Bank", label: "Approval for Bank", hasCheckmark: true },
    { value: "Proposals Pending in Bank", label: "Proposals Pending in Bank", hasCheckmark: false },
    { value: "Incomplete Application", label: "Incomplete Application", hasCheckmark: false },
    { value: "Disbursement Processed", label: "Disbursement Processed", hasCheckmark: true },
    { value: "Approved for Disbursement", label: "Approved for Disbursement", hasCheckmark: true },
    { value: "State Scheme Sanctioned", label: "State Scheme Sanctioned", hasCheckmark: true },
    { value: "Submitted to Assistant General Manager P2", label: "Submitted to Assistant General Manager P2", hasCheckmark: true },
    { value: "Approved and Submitted to Account Assistant Officer", label: "Approved and Submitted to Account Assistant Officer", hasCheckmark: true },
    { value: "Pending", label: "Pending", hasCheckmark: false },
    { value: "Proposal sent to Bank", label: "Proposal sent to Bank", hasCheckmark: true },
    { value: "Return Money Demand Raised", label: "Return Money Demand Raised", hasCheckmark: false },
    { value: "Submitted to General Manager P1", label: "Submitted to General Manager P1", hasCheckmark: true },
    { value: "Proposal Sent to Bank", label: "Proposal Sent to Bank", hasCheckmark: true },
    { value: "Proposal Pending in bank", label: "Proposal Pending in bank", hasCheckmark: false },
    { value: "Application Received in Regional Office", label: "Application Received in Regional Office", hasCheckmark: true },
    { value: "Submitted for Selection Committee review", label: "Submitted for Selection Committee review", hasCheckmark: true },
    { value: "Loans Dirbursed Proposals", label: "Loans Dirbursed Proposals", hasCheckmark: false },
    { value: "Recieved by Head Office", label: "Recieved by Head Office", hasCheckmark: true },
    { value: "Rejected by Head Office", label: "Rejected by Head Office", hasCheckmark: false },
    { value: "Sanctioned By Regional Manager", label: "Sanctioned By Regional Manager", hasCheckmark: true },
    { value: "Application Received", label: "Application Received", hasCheckmark: false },
    { value: "Submitted to Regional Office", label: "Submitted to Regional Office", hasCheckmark: true },
    { value: "Documents Rejected", label: "Documents Rejected", hasCheckmark: false },
    { value: "Submitted to Regional Manager", label: "Submitted to Regional Manager", hasCheckmark: true },
    { value: "Funds Sent to Regional Office", label: "Funds Sent to Regional Office", hasCheckmark: true },
    { value: "Sent for Regional Office approval", label: "Sent for Regional Office approval", hasCheckmark: true },
    { value: "Approved by Bank", label: "Approved by Bank", hasCheckmark: true },
    { value: "State Scheme Disbursed", label: "State Scheme Disbursed", hasCheckmark: true },
    { value: "Partial Payment", label: "Partial Payment", hasCheckmark: true },
    { value: "Submitted to Assistant General Manager P3", label: "Submitted to Assistant General Manager P3", hasCheckmark: true },
    { value: "Approved By Selection Committee", label: "Approved By Selection Committee", hasCheckmark: true },
    { value: "Loan sanctioned by Bank", label: "Loan sanctioned by Bank", hasCheckmark: true },
    { value: "Defaulted", label: "Defaulted", hasCheckmark: false },
    { value: "Submitted to Deputy General Manager P3", label: "Submitted to Deputy General Manager P3", hasCheckmark: true },
    { value: "Submitted to Deputy General Manager P2", label: "Submitted to Deputy General Manager P2", hasCheckmark: true },
    { value: "Return by Bank", label: "Return by Bank", hasCheckmark: true },
    { value: "Due diligence failed", label: "Due diligence failed", hasCheckmark: false },
    { value: "Submitted to Selection Committee review", label: "Submitted to Selection Committee review", hasCheckmark: true },
    { value: "Cleared by AGM - Finance", label: "Cleared by AGM - Finance", hasCheckmark: true },
    { value: "Disbursement Executed", label: "Disbursement Executed", hasCheckmark: true },
    { value: "Proposals Rejected", label: "Proposals Rejected", hasCheckmark: false },
    { value: "Rejected", label: "Rejected", hasCheckmark: false },
    { value: "Submitted to District Assistant", label: "Submitted to District Assistant", hasCheckmark: true },
    { value: "Due diligence verified", label: "Due diligence verified", hasCheckmark: true },
    { value: "Submitted to General Manager P2", label: "Submitted to General Manager P2", hasCheckmark: true },
    { value: "Cleared for Disbursement", label: "Cleared for Disbursement", hasCheckmark: true },
    { value: "Sent to Regional Assistant", label: "Sent to Regional Assistant", hasCheckmark: true },
    { value: "Submitted to General Manager P3", label: "Submitted to General Manager P3", hasCheckmark: true },
    { value: "Submitted to Deputy General Manager P1", label: "Submitted to Deputy General Manager P1", hasCheckmark: true },
    { value: "Eligible for Sanctioning and Disbursement", label: "Eligible for Sanctioning and Disbursement", hasCheckmark: true },
    { value: "Submitted to Assistant General Manager P1", label: "Submitted to Assistant General Manager P1", hasCheckmark: true },
    { value: "Central Schemed Sanctioned", label: "Central Schemed Sanctioned", hasCheckmark: true },
    { value: "Submitted to District Manager", label: "Submitted to District Manager", hasCheckmark: true },
    { value: "Disbursed", label: "Disbursed", hasCheckmark: true },
    { value: "Funds Disbursed to District", label: "Funds Disbursed to District", hasCheckmark: true },
    { value: "Rejected by Selection Committee", label: "Rejected by Selection Committee", hasCheckmark: false },
    { value: "Submitted to Deputy General Manager Finance", label: "Submitted to Deputy General Manager Finance", hasCheckmark: true },
    { value: "Submitted to Assistant General Manager Finance", label: "Submitted to Assistant General Manager Finance", hasCheckmark: true },
    { value: "Disbursed by Bank", label: "Disbursed by Bank", hasCheckmark: true },
    { value: "Return by Bank", label: "Return by Bank", hasCheckmark: true }
  ];

  // Filter status options based on search query
  const filteredStatusOptions = statusOptions.filter(option =>
    option.label.toLowerCase().includes(statusSearchQuery.toLowerCase())
  );

  // Filter role options based on search query
  const filteredRoleOptions = roleOptions.filter(option =>
    option.label.toLowerCase().includes(roleSearchQuery.toLowerCase())
  );

  // Filter visible fields options based on search query
  const filteredVisibleFieldsOptions = visibleFieldsOptions.filter(option =>
    option.label.toLowerCase().includes(visibleFieldsSearchQuery.toLowerCase())
  );

  // Filter next status options based on search query
  const filteredNextStatusOptions = nextStatusOptions.filter(option =>
    option.label.toLowerCase().includes(nextStatusSearchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showStatusDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
        setStatusSearchQuery('');
      }
      if (showRoleDropdown && roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setShowRoleDropdown(false);
        setRoleSearchQuery('');
      }
      if (showVisibleFieldsDropdown && visibleFieldsDropdownRef.current && !visibleFieldsDropdownRef.current.contains(event.target as Node)) {
        setShowVisibleFieldsDropdown(false);
        setVisibleFieldsSearchQuery('');
      }
      if (showNextStatusDropdown && nextStatusDropdownRef.current && !nextStatusDropdownRef.current.contains(event.target as Node)) {
        setShowNextStatusDropdown(false);
        setNextStatusSearchQuery('');
      }
    };

    if (showStatusDropdown || showRoleDropdown || showVisibleFieldsDropdown || showNextStatusDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown, showRoleDropdown, showVisibleFieldsDropdown, showNextStatusDropdown]);

  // Get status mapping data from mock service
  // State for managing status mapping data - REAL-TIME CRUD
  const [allMappings, setAllMappings] = useState<StatusMappingData[]>(() => mockDataService.getStatusMappingData());
  
  // Filter and sort mappings
  const filteredAndSortedMappings = useMemo(() => {
    let filtered = allMappings.filter(mapping =>
      mapping.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(mapping.visibleFields) ? mapping.visibleFields.some(field => field.toLowerCase().includes(searchQuery.toLowerCase())) : (mapping.visibleFields as string).toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Sort mappings
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
  }, [allMappings, searchQuery, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedMappings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMappings = filteredAndSortedMappings.slice(startIndex, endIndex);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'swapVerticalOutline': return swapVerticalOutline;
      case 'settingsOutline': return settingsOutline;
      case 'documentTextOutline': return documentTextOutline;
      case 'checkmarkOutline': return checkmarkOutline;
      case 'closeCircleOutline': return closeCircleOutline;
      default: return swapVerticalOutline;
    }
  };

  const handleAddNewMapping = () => {
    setFormData({
      currentStatus: '',
      role: '',
      visibleFields: '',
      nextPossibleStatuses: []
    });
    setShowAddModal(true);
  };

  const handleView = (mapping: StatusMappingData) => {
    setToastMessage(`Viewing status mapping: ${mapping.status}`);
    setShowToast(true);
  };

  const handleCopyName = (mappingStatus: string) => {
    navigator.clipboard.writeText(mappingStatus);
    setToastMessage('Status mapping copied to clipboard');
    setShowToast(true);
  };

  const handleEdit = (mappingId: string) => {
    const mapping = allMappings.find(m => m.id === mappingId);
    if (mapping) {
      setEditingMapping(mapping);
      setFormData({
        currentStatus: mapping.status,
        role: mapping.role,
        visibleFields: Array.isArray(mapping.visibleFields) ? mapping.visibleFields[0] || '' : mapping.visibleFields,
        nextPossibleStatuses: mapping.nextPossibleStatuses
      });
      setShowEditModal(true);
    }
  };

  const handleSaveAdd = () => {
    if (formData.currentStatus && formData.role) {
      // Generate a new ID for the status mapping
      const newId = `mapping-${Date.now()}`;
      
      // Create the new status mapping object
      const newMapping: StatusMappingData = {
        id: newId,
        status: formData.currentStatus,
        role: formData.role,
        visibleFields: formData.visibleFields ? [formData.visibleFields] : [],
        nextPossibleStatuses: formData.nextPossibleStatuses,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add the new mapping to the state
      setAllMappings(prevMappings => [...prevMappings, newMapping]);
      
      setToastMessage(`Status mapping "${formData.currentStatus}" created successfully`);
      setShowToast(true);
      setShowAddModal(false);
      setFormData({
        currentStatus: '',
        role: '',
        visibleFields: '',
        nextPossibleStatuses: []
      });
    } else {
      setToastMessage('Please fill in all required fields');
      setShowToast(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingMapping && formData.currentStatus && formData.role) {
      // Update the mapping in the state
      setAllMappings(prevMappings => 
        prevMappings.map(mapping => 
          mapping.id === editingMapping.id 
            ? { 
                ...mapping, 
                status: formData.currentStatus, 
                role: formData.role,
                visibleFields: formData.visibleFields ? [formData.visibleFields] : [],
                nextPossibleStatuses: formData.nextPossibleStatuses,
                updatedAt: new Date().toISOString() 
              }
            : mapping
        )
      );
      
      setToastMessage(`Status mapping "${formData.currentStatus}" updated successfully`);
      setShowToast(true);
      setShowEditModal(false);
      setEditingMapping(null);
      setFormData({
        currentStatus: '',
        role: '',
        visibleFields: '',
        nextPossibleStatuses: []
      });
    } else {
      setToastMessage('Please fill in all required fields');
      setShowToast(true);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingMapping(null);
    setFormData({
      currentStatus: '',
      role: '',
      visibleFields: '',
      nextPossibleStatuses: []
    });
  };

  const handleDelete = (mappingId: string) => {
    setSelectedMappingId(mappingId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedMappingId) {
      // Remove the mapping from state
      setAllMappings(prevMappings => prevMappings.filter(mapping => mapping.id !== selectedMappingId));
      
      const mappingToDelete = allMappings.find(mapping => mapping.id === selectedMappingId);
      setToastMessage(`Status mapping "${mappingToDelete?.status || selectedMappingId}" deleted successfully`);
      setShowToast(true);
      setSelectedMappingId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedMappingId(null);
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

  const getStatusIcon = (status: string) => {
    if (status.includes('Submitted') || status.includes('Sanctioned')) {
      return <IonIcon icon={checkmarkOutline} className="status-icon success" />;
    } else if (status.includes('Rejected') || status.includes('Incomplete')) {
      return <IonIcon icon={closeCircleOutline} className="status-icon error" />;
    } else if (status.includes('Incomplete')) {
      return <IonIcon icon={documentTextOutline} className="status-icon warning" />;
    }
    return null;
  };

  const renderVisibleFields = (fields: string[]) => {
    return fields.map((field, index) => (
      <span key={index} className="visible-field">
        {field}
        {getStatusIcon(field)}
        {index < fields.length - 1 && ', '}
      </span>
    ));
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
              <MasterHeader
                title="Status Mapping"
                subtitle="Manage workflow status mappings and role assignments"
              />

              {/* Enhanced Search and Actions */}
              <MasterControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search mappings by status, role, or fields..."
                viewMode={viewMode}
                onViewModeToggle={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                onAddNew={handleAddNewMapping}
                addButtonText="Add New Mapping"
              />

              {/* Status Mappings Grid */}
              {viewMode === 'grid' ? (
                <div className="master-cards-grid" style={{ padding: '1rem' }}>
                  {currentMappings.map((mapping) => (
                    <MasterCard
                      key={mapping.id}
                      id={mapping.id}
                      title={mapping.status}
                      subtitle="Status Mapping"
                      icon={swapVerticalOutline}
                      metaItems={[
                        {
                          icon: peopleOutline,
                          label: "Role",
                          value: mapping.role
                        },
                        {
                          icon: documentTextOutline,
                          label: "Fields",
                          value: `${Array.isArray(mapping.visibleFields) ? mapping.visibleFields.length : (mapping.visibleFields ? 1 : 0)} fields`
                        }
                      ]}
                      onView={() => handleView(mapping)}
                      onEdit={() => handleEdit(mapping.id)}
                      onDelete={() => handleDelete(mapping.id)}
                    />
                  ))}
                </div>
              ) : (
                <ScrollableTableContainer cardClassName="pages-table-card">
                  <table className="pages-table">
                    <thead>
                      <tr>
                        <th>
                          <div className="table-header">
                            <span>Status</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Role</span>
                            <IonIcon icon={searchOutline} className="filter-icon" />
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Visible Fields</span>
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Mapping Code</span>
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Icon</span>
                          </div>
                        </th>
                        <th>
                          <div className="table-header">
                            <span>Actions</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentMappings.map((mapping, index) => (
                        <tr key={mapping.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="name-cell">
                            <div className="page-name">
                              <IonIcon icon={swapVerticalOutline} className="page-icon" />
                              <span>{mapping.status}</span>
                            </div>
                          </td>
                          <td className="url-cell">
                            <span className="role-text">{mapping.role}</span>
                          </td>
                          <td className="url-cell">
                            <div className="visible-fields">
                              {Array.isArray(mapping.visibleFields) ? (
                                <>
                              {mapping.visibleFields.slice(0, 2).map((field, idx) => (
                                <span key={idx} className="visible-field">
                                  {field}
                                  {idx < Math.min(mapping.visibleFields.length, 2) - 1 && ', '}
                                </span>
                              ))}
                              {mapping.visibleFields.length > 2 && (
                                <span className="visible-field">+{mapping.visibleFields.length - 2} more</span>
                                  )}
                                </>
                              ) : (
                                <span className="visible-field">{mapping.visibleFields}</span>
                              )}
                            </div>
                          </td>
                          <td className="url-cell">
                            <code className="url-code">MAP-{mapping.id.slice(-3)}</code>
                          </td>
                          <td className="icon-cell">
                            <div className="icon-display">
                              <IonIcon icon={swapVerticalOutline} className="display-icon" />
                              <span className="icon-name">swapVerticalOutline</span>
                            </div>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <ActionDropdown
                                itemId={mapping.id}
                                onView={() => handleView(mapping)}
                                onEdit={() => handleEdit(mapping.id)}
                                onDelete={() => handleDelete(mapping.id)}
                                size="small"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollableTableContainer>
              )}

              {/* Pagination */}
              {filteredAndSortedMappings.length > 0 && (
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

      {/* Add Mapping Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar style={{ '--background': '#4ecdc4', '--color': 'white' }}>
            <IonTitle>Add Mapping</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)} style={{ '--color': 'white' }}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Current Status
                </IonLabel>
                <div style={{ position: 'relative' }} ref={dropdownRef}>
              <IonInput
                    value={formData.currentStatus || ''}
                placeholder="Search and select status"
                    readonly
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    style={{ 
                      '--background': '#e8e8e8',
                      '--border-radius': '12px',
                      '--padding-start': '16px',
                      '--padding-end': '16px',
                      '--padding-top': '12px',
                      '--padding-bottom': '12px',
                      '--color': '#333',
                      '--placeholder-color': '#666',
                      cursor: 'pointer'
                    }}
                  />
                  {showStatusDropdown && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        maxHeight: '300px',
                        overflow: 'hidden'
                      }}>
                      <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
              <IonInput
                          value={statusSearchQuery}
                          onIonChange={(e) => setStatusSearchQuery(e.detail.value!)}
                          placeholder="Search status..."
                          style={{
                            '--background': '#f8f9fa',
                            '--border-radius': '8px',
                            '--padding-start': '12px',
                            '--padding-end': '12px',
                            '--padding-top': '8px',
                            '--padding-bottom': '8px'
                          }}
                        />
                      </div>
                      <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {filteredStatusOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setFormData({...formData, currentStatus: option.value});
                              setShowStatusDropdown(false);
                              setStatusSearchQuery('');
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: formData.currentStatus === option.value ? '#2196f3' : 'white',
                              color: formData.currentStatus === option.value ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (formData.currentStatus !== option.value) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (formData.currentStatus !== option.value) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: formData.currentStatus === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: formData.currentStatus === option.value ? 'white' : '#00C851', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                            {!option.hasCheckmark && (
                              <IonIcon 
                                icon={closeOutline} 
                                style={{ 
                                  color: formData.currentStatus === option.value ? 'white' : '#FF4444', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Role
                </IonLabel>
                <div style={{ position: 'relative' }} ref={roleDropdownRef}>
                  <IonInput
                    value={formData.role || ''}
                placeholder="Search and select role"
                    readonly
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    style={{ 
                      '--background': '#e8e8e8',
                      '--border-radius': '12px',
                      '--padding-start': '16px',
                      '--padding-end': '16px',
                      '--padding-top': '12px',
                      '--padding-bottom': '12px',
                      '--color': '#333',
                      '--placeholder-color': '#666',
                      cursor: 'pointer'
                    }}
                  />
                  {showRoleDropdown && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        maxHeight: '300px',
                        overflow: 'hidden'
                      }}>
                      <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                        <IonInput
                          value={roleSearchQuery}
                          onIonChange={(e) => setRoleSearchQuery(e.detail.value!)}
                          placeholder="Search role..."
                          style={{
                            '--background': '#f8f9fa',
                            '--border-radius': '8px',
                            '--padding-start': '12px',
                            '--padding-end': '12px',
                            '--padding-top': '8px',
                            '--padding-bottom': '8px'
                          }}
                        />
                      </div>
                      <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {filteredRoleOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setFormData({...formData, role: option.value});
                              setShowRoleDropdown(false);
                              setRoleSearchQuery('');
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: formData.role === option.value ? '#2196f3' : 'white',
                              color: formData.role === option.value ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (formData.role !== option.value) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (formData.role !== option.value) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: formData.role === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: formData.role === option.value ? 'white' : '#00C851', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                            {!option.hasCheckmark && (
                              <IonIcon 
                                icon={closeOutline} 
                                style={{ 
                                  color: formData.role === option.value ? 'white' : '#FF4444', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Visible Fields
                </IonLabel>
                <div style={{ position: 'relative' }} ref={visibleFieldsDropdownRef}>
                  <IonInput
                    value={formData.visibleFields || ''}
                    placeholder="Search and select visible field"
                    readonly
                    onClick={() => setShowVisibleFieldsDropdown(!showVisibleFieldsDropdown)}
                    style={{ 
                      '--background': '#e8e8e8',
                      '--border-radius': '12px',
                      '--padding-start': '16px',
                      '--padding-end': '16px',
                      '--padding-top': '12px',
                      '--padding-bottom': '12px',
                      '--color': '#333',
                      '--placeholder-color': '#666',
                      cursor: 'pointer'
                    }}
                  />
                  {showVisibleFieldsDropdown && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        maxHeight: '300px',
                        overflow: 'hidden'
                      }}>
                      <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                        <IonInput
                          value={visibleFieldsSearchQuery}
                          onIonChange={(e) => setVisibleFieldsSearchQuery(e.detail.value!)}
                          placeholder="Search visible fields..."
                          style={{
                            '--background': '#f8f9fa',
                            '--border-radius': '8px',
                            '--padding-start': '12px',
                            '--padding-end': '12px',
                            '--padding-top': '8px',
                            '--padding-bottom': '8px'
                          }}
                        />
                      </div>
                      <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {filteredVisibleFieldsOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setFormData({...formData, visibleFields: option.value});
                              setShowVisibleFieldsDropdown(false);
                              setVisibleFieldsSearchQuery('');
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: formData.visibleFields === option.value ? '#2196f3' : 'white',
                              color: formData.visibleFields === option.value ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (formData.visibleFields !== option.value) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (formData.visibleFields !== option.value) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: formData.visibleFields === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: formData.visibleFields === option.value ? 'white' : '#00C851', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                            {!option.hasCheckmark && (
                              <IonIcon 
                                icon={closeOutline} 
                                style={{ 
                                  color: formData.visibleFields === option.value ? 'white' : '#FF4444', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Next Possible Statuses
                </IonLabel>
                <div style={{ position: 'relative' }} ref={nextStatusDropdownRef}>
                  <div
                    onClick={() => setShowNextStatusDropdown(!showNextStatusDropdown)}
                    style={{ 
                      background: '#e8e8e8',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      minHeight: '48px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '8px',
                      border: '1px solid transparent'
                    }}
                  >
                    {formData.nextPossibleStatuses.length > 0 ? (
                      formData.nextPossibleStatuses.map((status, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#2196f3',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          <span>{status}</span>
                          <IonIcon
                            icon={closeOutline}
                            style={{
                              fontSize: '16px',
                              cursor: 'pointer',
                              color: 'white'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const newNextStatuses = formData.nextPossibleStatuses.filter((_, i) => i !== index);
                              setFormData({...formData, nextPossibleStatuses: newNextStatuses});
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <span style={{ color: '#666', fontSize: '16px' }}>
                        Search and select next possible statuses
                      </span>
                    )}
                  </div>
                  {showNextStatusDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      zIndex: 1000,
                      maxHeight: '300px',
                      overflow: 'hidden'
                    }}>
                      <IonInput
                        value={nextStatusSearchQuery}
                        onIonInput={(e) => setNextStatusSearchQuery(e.detail.value!)}
                        placeholder="Search statuses..."
                        style={{
                          '--background': '#f5f5f5',
                          '--border': 'none',
                          '--border-radius': '8px',
                          '--padding-start': '16px',
                          '--padding-end': '16px',
                          '--padding-top': '12px',
                          '--padding-bottom': '12px',
                          '--color': '#333',
                          '--placeholder-color': '#666'
                        }}
                      />
                      <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {filteredNextStatusOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              const isSelected = formData.nextPossibleStatuses.includes(option.value);
                              let newNextStatuses;
                              if (isSelected) {
                                newNextStatuses = formData.nextPossibleStatuses.filter(status => status !== option.value);
                              } else {
                                newNextStatuses = [...formData.nextPossibleStatuses, option.value];
                              }
                              setFormData({...formData, nextPossibleStatuses: newNextStatuses});
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: formData.nextPossibleStatuses.includes(option.value) ? '#2196f3' : 'white',
                              color: formData.nextPossibleStatuses.includes(option.value) ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (!formData.nextPossibleStatuses.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!formData.nextPossibleStatuses.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                border: `2px solid ${formData.nextPossibleStatuses.includes(option.value) ? 'white' : '#ddd'}`,
                                backgroundColor: formData.nextPossibleStatuses.includes(option.value) ? 'white' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                              }}>
                                {formData.nextPossibleStatuses.includes(option.value) && (
                                  <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: '#2196f3'
                                  }} />
                                )}
                              </div>
                              <span style={{ color: formData.nextPossibleStatuses.includes(option.value) ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            </div>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: formData.nextPossibleStatuses.includes(option.value) ? 'white' : '#00C851', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                            {!option.hasCheckmark && (
                              <IonIcon 
                                icon={closeOutline} 
                                style={{ 
                                  color: formData.nextPossibleStatuses.includes(option.value) ? 'white' : '#FF4444', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <IonButton 
                expand="block" 
                style={{ 
                  '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '--color': 'white',
                  '--border-radius': '12px',
                  marginTop: '1rem'
                }}
                onClick={handleSaveAdd}
              >
                <IonIcon icon={checkmarkOutline} slot="start" />
                Create Status Mapping
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Mapping Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar style={{ '--background': '#4ecdc4', '--color': 'white' }}>
            <IonTitle>Edit Mapping</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)} style={{ '--color': 'white' }}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="page-modal-content">
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Current Status
                </IonLabel>
                <div style={{ position: 'relative' }} ref={dropdownRef}>
              <IonInput
                    value={formData.currentStatus || ''}
                    placeholder="Search and select status"
                    readonly
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    style={{ 
                      '--background': '#e8e8e8',
                      '--border-radius': '12px',
                      '--padding-start': '16px',
                      '--padding-end': '16px',
                      '--padding-top': '12px',
                      '--padding-bottom': '12px',
                      '--color': '#333',
                      '--placeholder-color': '#666',
                      cursor: 'pointer'
                    }}
                  />
                  {showStatusDropdown && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        maxHeight: '300px',
                        overflow: 'hidden'
                      }}>
                      <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
              <IonInput
                          value={statusSearchQuery}
                          onIonChange={(e) => setStatusSearchQuery(e.detail.value!)}
                          placeholder="Search status..."
                          style={{
                            '--background': '#f8f9fa',
                            '--border-radius': '8px',
                            '--padding-start': '12px',
                            '--padding-end': '12px',
                            '--padding-top': '8px',
                            '--padding-bottom': '8px'
                          }}
                        />
                      </div>
                      <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {filteredStatusOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setFormData({...formData, currentStatus: option.value});
                              setShowStatusDropdown(false);
                              setStatusSearchQuery('');
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: formData.currentStatus === option.value ? '#2196f3' : 'white',
                              color: formData.currentStatus === option.value ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (formData.currentStatus !== option.value) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (formData.currentStatus !== option.value) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: formData.currentStatus === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: formData.currentStatus === option.value ? 'white' : '#00C851', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                            {!option.hasCheckmark && (
                              <IonIcon 
                                icon={closeOutline} 
                                style={{ 
                                  color: formData.currentStatus === option.value ? 'white' : '#FF4444', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Role
                </IonLabel>
                <div style={{ position: 'relative' }} ref={roleDropdownRef}>
                  <IonInput
                    value={formData.role || ''}
                    placeholder="Search and select role"
                    readonly
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    style={{ 
                      '--background': '#e8e8e8',
                      '--border-radius': '12px',
                      '--padding-start': '16px',
                      '--padding-end': '16px',
                      '--padding-top': '12px',
                      '--padding-bottom': '12px',
                      '--color': '#333',
                      '--placeholder-color': '#666',
                      cursor: 'pointer'
                    }}
                  />
                  {showRoleDropdown && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        maxHeight: '300px',
                        overflow: 'hidden'
                      }}>
                      <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                        <IonInput
                          value={roleSearchQuery}
                          onIonChange={(e) => setRoleSearchQuery(e.detail.value!)}
                          placeholder="Search role..."
                          style={{
                            '--background': '#f8f9fa',
                            '--border-radius': '8px',
                            '--padding-start': '12px',
                            '--padding-end': '12px',
                            '--padding-top': '8px',
                            '--padding-bottom': '8px'
                          }}
                        />
                      </div>
                      <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {filteredRoleOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setFormData({...formData, role: option.value});
                              setShowRoleDropdown(false);
                              setRoleSearchQuery('');
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: formData.role === option.value ? '#2196f3' : 'white',
                              color: formData.role === option.value ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (formData.role !== option.value) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (formData.role !== option.value) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: formData.role === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: formData.role === option.value ? 'white' : '#00C851', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                            {!option.hasCheckmark && (
                              <IonIcon 
                                icon={closeOutline} 
                                style={{ 
                                  color: formData.role === option.value ? 'white' : '#FF4444', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Visible Fields
                </IonLabel>
                <div style={{ position: 'relative' }} ref={visibleFieldsDropdownRef}>
                  <IonInput
                    value={formData.visibleFields || ''}
                    placeholder="Search and select visible field"
                    readonly
                    onClick={() => setShowVisibleFieldsDropdown(!showVisibleFieldsDropdown)}
                    style={{ 
                      '--background': '#e8e8e8',
                      '--border-radius': '12px',
                      '--padding-start': '16px',
                      '--padding-end': '16px',
                      '--padding-top': '12px',
                      '--padding-bottom': '12px',
                      '--color': '#333',
                      '--placeholder-color': '#666',
                      cursor: 'pointer'
                    }}
                  />
                  {showVisibleFieldsDropdown && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        maxHeight: '300px',
                        overflow: 'hidden'
                      }}>
                      <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                        <IonInput
                          value={visibleFieldsSearchQuery}
                          onIonChange={(e) => setVisibleFieldsSearchQuery(e.detail.value!)}
                          placeholder="Search visible fields..."
                          style={{
                            '--background': '#f8f9fa',
                            '--border-radius': '8px',
                            '--padding-start': '12px',
                            '--padding-end': '12px',
                            '--padding-top': '8px',
                            '--padding-bottom': '8px'
                          }}
                        />
                      </div>
                      <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {filteredVisibleFieldsOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setFormData({...formData, visibleFields: option.value});
                              setShowVisibleFieldsDropdown(false);
                              setVisibleFieldsSearchQuery('');
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: formData.visibleFields === option.value ? '#2196f3' : 'white',
                              color: formData.visibleFields === option.value ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (formData.visibleFields !== option.value) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (formData.visibleFields !== option.value) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <span style={{ color: formData.visibleFields === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: formData.visibleFields === option.value ? 'white' : '#00C851', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                            {!option.hasCheckmark && (
                              <IonIcon 
                                icon={closeOutline} 
                                style={{ 
                                  color: formData.visibleFields === option.value ? 'white' : '#FF4444', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <IonLabel style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Next Possible Statuses
                </IonLabel>
                <div style={{ position: 'relative' }} ref={nextStatusDropdownRef}>
                  <div
                    onClick={() => setShowNextStatusDropdown(!showNextStatusDropdown)}
                    style={{ 
                      background: '#e8e8e8',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      minHeight: '48px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '8px',
                      border: '1px solid transparent'
                    }}
                  >
                    {formData.nextPossibleStatuses.length > 0 ? (
                      formData.nextPossibleStatuses.map((status, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#2196f3',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          <span>{status}</span>
                          <IonIcon
                            icon={closeOutline}
                            style={{
                              fontSize: '16px',
                              cursor: 'pointer',
                              color: 'white'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const newNextStatuses = formData.nextPossibleStatuses.filter((_, i) => i !== index);
                              setFormData({...formData, nextPossibleStatuses: newNextStatuses});
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <span style={{ color: '#666', fontSize: '16px' }}>
                        Search and select next possible statuses
                      </span>
                    )}
                  </div>
                  {showNextStatusDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      zIndex: 1000,
                      maxHeight: '300px',
                      overflow: 'hidden'
                    }}>
                      <IonInput
                        value={nextStatusSearchQuery}
                        onIonInput={(e) => setNextStatusSearchQuery(e.detail.value!)}
                        placeholder="Search statuses..."
                        style={{
                          '--background': '#f5f5f5',
                          '--border': 'none',
                          '--border-radius': '8px',
                          '--padding-start': '16px',
                          '--padding-end': '16px',
                          '--padding-top': '12px',
                          '--padding-bottom': '12px',
                          '--color': '#333',
                          '--placeholder-color': '#666'
                        }}
                      />
                      <div style={{ maxHeight: '240px', overflowY: 'auto', paddingBottom: '12px' }}>
                        {filteredNextStatusOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              const isSelected = formData.nextPossibleStatuses.includes(option.value);
                              let newNextStatuses;
                              if (isSelected) {
                                newNextStatuses = formData.nextPossibleStatuses.filter(status => status !== option.value);
                              } else {
                                newNextStatuses = [...formData.nextPossibleStatuses, option.value];
                              }
                              setFormData({...formData, nextPossibleStatuses: newNextStatuses});
                            }}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: formData.nextPossibleStatuses.includes(option.value) ? '#2196f3' : 'white',
                              color: formData.nextPossibleStatuses.includes(option.value) ? 'white' : '#333'
                            }}
                            onMouseEnter={(e) => {
                              if (!formData.nextPossibleStatuses.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!formData.nextPossibleStatuses.includes(option.value)) {
                                e.currentTarget.style.backgroundColor = 'white';
                              }
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                border: `2px solid ${formData.nextPossibleStatuses.includes(option.value) ? 'white' : '#ddd'}`,
                                backgroundColor: formData.nextPossibleStatuses.includes(option.value) ? 'white' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                              }}>
                                {formData.nextPossibleStatuses.includes(option.value) && (
                                  <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: '#2196f3'
                                  }} />
                                )}
                              </div>
                              <span style={{ color: formData.nextPossibleStatuses.includes(option.value) ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                            </div>
                            {option.hasCheckmark && (
                              <IonIcon 
                                icon={checkmark} 
                                style={{ 
                                  color: formData.nextPossibleStatuses.includes(option.value) ? 'white' : '#00C851', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                            {!option.hasCheckmark && (
                              <IonIcon 
                                icon={closeOutline} 
                                style={{ 
                                  color: formData.nextPossibleStatuses.includes(option.value) ? 'white' : '#FF4444', 
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                Update Status Mapping
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
        message="Are you sure you want to delete this status mapping? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Floating Action Button */}
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton className="fab-add-page" onClick={handleAddNewMapping}>
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

export default StatusMapping;
