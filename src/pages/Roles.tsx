import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  IonPage, IonContent, IonSplitPane, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonSpinner, IonAlert, IonToast, IonSearchbar,
  IonModal, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonButtons
} from '@ionic/react';
import { 
  addOutline, createOutline, trashOutline, searchOutline,
  chevronBackOutline, chevronForwardOutline, closeOutline, checkmarkOutline,
  eyeOutline, checkmark, closeOutline as closeOutlineIcon
} from 'ionicons/icons';
import Sidebar from '../admin/components/sidebar/Sidebar';
import DashboardHeader from '../admin/components/header/DashboardHeader';
import ActionDropdown from '../admin/components/common/ActionDropdown';
import { Pagination } from '../admin/components/shared';
import { RBACControls, RBACHeader, ScrollableTableContainer } from '../components/shared';
import { mockDataService } from '../services/api';
import type { RolesData } from '../types';
import './Roles.css';

const Roles: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingRole, setViewingRole] = useState<RolesData | null>(null);
  const [editingRole, setEditingRole] = useState<RolesData | null>(null);
  const [addForm, setAddForm] = useState({
    organization: '',
    branch: '',
    name: '',
    statuses: [] as string[]
  });
  const [editForm, setEditForm] = useState({
    organization: '',
    branch: '',
    name: '',
    statuses: [] as string[]
  });
  
  const itemsPerPage = 5;

  // Searchable dropdown state
  const [showOrganizationDropdown, setShowOrganizationDropdown] = useState(false);
  const [organizationSearchQuery, setOrganizationSearchQuery] = useState('');
  const [showEditOrganizationDropdown, setShowEditOrganizationDropdown] = useState(false);
  const [editOrganizationSearchQuery, setEditOrganizationSearchQuery] = useState('');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [branchSearchQuery, setBranchSearchQuery] = useState('');
  const [showEditBranchDropdown, setShowEditBranchDropdown] = useState(false);
  const [editBranchSearchQuery, setEditBranchSearchQuery] = useState('');
  const [showNameDropdown, setNameDropdown] = useState(false);
  const [nameSearchQuery, setNameSearchQuery] = useState('');
  const [showEditNameDropdown, setShowEditNameDropdown] = useState(false);
  const [editNameSearchQuery, setEditNameSearchQuery] = useState('');
  const [showStatusesDropdown, setShowStatusesDropdown] = useState(false);
  const [statusesSearchQuery, setStatusesSearchQuery] = useState('');
  const [showEditStatusesDropdown, setShowEditStatusesDropdown] = useState(false);
  const [editStatusesSearchQuery, setEditStatusesSearchQuery] = useState('');
  
  const organizationDropdownRef = useRef<HTMLDivElement>(null);
  const editOrganizationDropdownRef = useRef<HTMLDivElement>(null);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const editBranchDropdownRef = useRef<HTMLDivElement>(null);
  const nameDropdownRef = useRef<HTMLDivElement>(null);
  const editNameDropdownRef = useRef<HTMLDivElement>(null);
  const statusesDropdownRef = useRef<HTMLDivElement>(null);
  const editStatusesDropdownRef = useRef<HTMLDivElement>(null);

  // Organization options
  const organizationOptions = [
    { value: "Aaryahub", label: "Aaryahub", hasCheckmark: true },
    { value: "MPBCDC", label: "MPBCDC", hasCheckmark: true }
  ];

  // Branch options
  const branchOptions = [
    { value: "Mumbai Branch", label: "Mumbai Branch", hasCheckmark: true },
    { value: "Pune Branch", label: "Pune Branch", hasCheckmark: true },
    { value: "Nagpur Branch", label: "Nagpur Branch", hasCheckmark: true },
    { value: "Aurangabad Branch", label: "Aurangabad Branch", hasCheckmark: true },
    { value: "Nashik Branch", label: "Nashik Branch", hasCheckmark: true },
    { value: "Amravati Branch", label: "Amravati Branch", hasCheckmark: true }
  ];

  // Role name options (from StatusMapping)
  const roleNameOptions = [
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


  // Status options (from StatusMapping)
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

  // State for managing roles data - EXACTLY LIKE MANAGEPAGES
  const [allRoles, setAllRoles] = useState<RolesData[]>(() => mockDataService.getRolesData());
  
  // Filter options based on search query
  const filteredOrganizationOptions = organizationOptions.filter(option =>
    option.label.toLowerCase().includes(organizationSearchQuery.toLowerCase())
  );
  const filteredEditOrganizationOptions = organizationOptions.filter(option =>
    option.label.toLowerCase().includes(editOrganizationSearchQuery.toLowerCase())
  );
  const filteredBranchOptions = branchOptions.filter(option =>
    option.label.toLowerCase().includes(branchSearchQuery.toLowerCase())
  );
  const filteredEditBranchOptions = branchOptions.filter(option =>
    option.label.toLowerCase().includes(editBranchSearchQuery.toLowerCase())
  );
  const filteredNameOptions = roleNameOptions.filter(option =>
    option.label.toLowerCase().includes(nameSearchQuery.toLowerCase())
  );
  const filteredEditNameOptions = roleNameOptions.filter(option =>
    option.label.toLowerCase().includes(editNameSearchQuery.toLowerCase())
  );
  const filteredStatusOptions = statusOptions.filter(option =>
    option.label.toLowerCase().includes(statusesSearchQuery.toLowerCase())
  );
  const filteredEditStatusOptions = statusOptions.filter(option =>
    option.label.toLowerCase().includes(editStatusesSearchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showOrganizationDropdown && organizationDropdownRef.current && !organizationDropdownRef.current.contains(event.target as Node)) {
        setShowOrganizationDropdown(false);
        setOrganizationSearchQuery('');
      }
      if (showEditOrganizationDropdown && editOrganizationDropdownRef.current && !editOrganizationDropdownRef.current.contains(event.target as Node)) {
        setShowEditOrganizationDropdown(false);
        setEditOrganizationSearchQuery('');
      }
      if (showBranchDropdown && branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
        setShowBranchDropdown(false);
        setBranchSearchQuery('');
      }
      if (showEditBranchDropdown && editBranchDropdownRef.current && !editBranchDropdownRef.current.contains(event.target as Node)) {
        setShowEditBranchDropdown(false);
        setEditBranchSearchQuery('');
      }
      if (showNameDropdown && nameDropdownRef.current && !nameDropdownRef.current.contains(event.target as Node)) {
        setNameDropdown(false);
        setNameSearchQuery('');
      }
      if (showEditNameDropdown && editNameDropdownRef.current && !editNameDropdownRef.current.contains(event.target as Node)) {
        setShowEditNameDropdown(false);
        setEditNameSearchQuery('');
      }
      if (showStatusesDropdown && statusesDropdownRef.current && !statusesDropdownRef.current.contains(event.target as Node)) {
        setShowStatusesDropdown(false);
        setStatusesSearchQuery('');
      }
      if (showEditStatusesDropdown && editStatusesDropdownRef.current && !editStatusesDropdownRef.current.contains(event.target as Node)) {
        setShowEditStatusesDropdown(false);
        setEditStatusesSearchQuery('');
      }
    };

    if (showOrganizationDropdown || showEditOrganizationDropdown || showBranchDropdown || showEditBranchDropdown || 
        showNameDropdown || showEditNameDropdown || showStatusesDropdown || showEditStatusesDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOrganizationDropdown, showEditOrganizationDropdown, showBranchDropdown, showEditBranchDropdown, 
      showNameDropdown, showEditNameDropdown, showStatusesDropdown, showEditStatusesDropdown]);
  
  // Filter roles based on search query
  const filteredRoles = useMemo(() => {
    return allRoles.filter(role =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allRoles, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRoles = filteredRoles.slice(startIndex, endIndex);

  const handleAddRole = () => {
    setAddForm({ organization: '', branch: '', name: '', statuses: [] });
    setShowAddModal(true);
  };

  const handleSaveAdd = () => {
    if (!addForm.organization.trim() || !addForm.branch.trim() || !addForm.name.trim() || addForm.statuses.length === 0) {
      setToastMessage('Please fill in all required fields');
      setShowToast(true);
      return;
    }

    // Check if role name already exists
    if (allRoles.some(role => role.name.toLowerCase() === addForm.name.toLowerCase())) {
      setToastMessage('Role name already exists. Please choose a different name.');
      setShowToast(true);
      return;
    }
    
    // Create new role
    const newRole: RolesData = {
      id: `role_${Date.now()}`,
      name: addForm.name.trim(),
      organization: addForm.organization,
      branch: addForm.branch,
      statuses: addForm.statuses.join(', '),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add the new role to the state - EXACTLY LIKE MANAGEPAGES
    setAllRoles(prevRoles => [...prevRoles, newRole]);
    
    setToastMessage(`Role "${addForm.name}" added successfully`);
    setShowToast(true);
    setShowAddModal(false);
    setAddForm({ organization: '', branch: '', name: '', statuses: [] });
  };

  const handleCloseAdd = () => {
    setShowAddModal(false);
    setAddForm({ organization: '', branch: '', name: '', statuses: [] });
  };

  const handleEdit = (roleId: string) => {
    const role = allRoles.find(r => r.id === roleId);
    if (role) {
      setEditingRole(role);
      setEditForm({ 
        organization: role.organization || '',
        branch: role.branch || '',
        name: role.name,
        statuses: role.statuses ? role.statuses.split(', ').filter(s => s.trim()) : []
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (!editForm.organization.trim() || !editForm.branch.trim() || !editForm.name.trim() || editForm.statuses.length === 0) {
      setToastMessage('Please fill in all required fields');
      setShowToast(true);
      return;
    }

    if (!editingRole) return;

    // Check if role name already exists (excluding current item)
    if (allRoles.some(role => 
      role.id !== editingRole.id && 
      role.name.toLowerCase() === editForm.name.toLowerCase()
    )) {
      setToastMessage('Role name already exists. Please choose a different name.');
      setShowToast(true);
      return;
    }
    
    // Update the role in the state - EXACTLY LIKE MANAGEPAGES
    setAllRoles(prevRoles => 
      prevRoles.map(role => 
        role.id === editingRole.id 
          ? { 
              ...role, 
              name: editForm.name.trim(),
              organization: editForm.organization,
              branch: editForm.branch,
              statuses: editForm.statuses.join(', '),
              updatedAt: new Date().toISOString() 
            }
          : role
      )
    );
    
    setToastMessage(`Role "${editForm.name}" updated successfully`);
    setShowToast(true);
    setShowEditModal(false);
    setEditingRole(null);
    setEditForm({ organization: '', branch: '', name: '', statuses: [] });
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingRole(null);
    setEditForm({ organization: '', branch: '', name: '', statuses: [] });
  };

  const handleView = (roleId: string) => {
    const role = allRoles.find(r => r.id === roleId);
    if (role) {
      setViewingRole(role);
      setShowViewModal(true);
    }
  };

  const handleCloseView = () => {
    setShowViewModal(false);
    setViewingRole(null);
  };

  const handleDelete = (roleId: string) => {
    setSelectedRoleId(roleId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedRoleId) {
      // Actually remove the role from the state - EXACTLY LIKE MANAGEPAGES
      setAllRoles(prevRoles => prevRoles.filter(role => role.id !== selectedRoleId));
      
      const roleToDelete = allRoles.find(role => role.id === selectedRoleId);
      setToastMessage(`Role "${roleToDelete?.name || selectedRoleId}" deleted successfully`);
      setShowToast(true);
      setSelectedRoleId(null);
    }
    setShowDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSelectedRoleId(null);
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
          
          <IonContent className="roles-content">
            <div className="roles-container">
              {/* Header Section */}
              <RBACHeader
                title="Roles"
                subtitle="Manage district roles and their permissions"
              />

              {/* Search and Actions */}
              <RBACControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search roles by name..."
                onAddNew={handleAddRole}
                addButtonText="+ ADD ROLE"
              />

              {/* Roles Table */}
              <ScrollableTableContainer cardClassName="roles-table-card">
                <table className="roles-table">
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
                            <span>Actions</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRoles.map((role, index) => (
                        <tr key={role.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td className="role-name-cell">
                            <span className="role-name">{role.name}</span>
                          </td>
                          <td className="actions-cell">
                            <ActionDropdown
                              itemId={role.id}
                              onView={() => handleView(role.id)}
                              onEdit={() => handleEdit(role.id)}
                              onDelete={() => handleDelete(role.id)}
                              showView={true}
                              size="small"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </ScrollableTableContainer>

              {/* Pagination */}
              {filteredRoles.length > 0 && (
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

      {/* Delete Confirmation Alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={cancelDelete}
        header="Confirm Delete"
        message="Are you sure you want to delete this role? This action cannot be undone."
        buttons={[
          { text: 'Cancel', role: 'cancel', handler: cancelDelete },
          { text: 'Delete', role: 'destructive', handler: confirmDelete }
        ]}
      />

      {/* Add Role Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={handleCloseAdd}>
        <IonContent className="add-role-modal">
          <div className="modal-header">
            <h2>Add New Role</h2>
            <IonButton fill="clear" onClick={handleCloseAdd}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <div className="form-group">
              <IonLabel className="form-label">Select an Organization *</IonLabel>
              <div style={{ position: 'relative' }} ref={organizationDropdownRef}>
                <IonInput
                  value={addForm.organization || ''}
                  placeholder="Select an Organization"
                  readonly
                  onClick={() => setShowOrganizationDropdown(!showOrganizationDropdown)}
                  style={{ 
                    '--background': '#e8e8e8',
                    '--border-radius': '12px',
                    '--padding-start': '16px',
                    '--padding-end': '16px',
                    '--padding-top': '12px',
                    '--padding-bottom': '12px',
                    '--color': '#333',
                    '--placeholder-color': '#666'
                  }}
                />
                {showOrganizationDropdown && (
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
                      value={organizationSearchQuery}
                      onIonInput={(e) => setOrganizationSearchQuery(e.detail.value!)}
                      placeholder="Search organizations..."
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
                      {filteredOrganizationOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setAddForm(prev => ({ ...prev, organization: option.value }));
                            setShowOrganizationDropdown(false);
                            setOrganizationSearchQuery('');
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: addForm.organization === option.value ? '#2196f3' : 'white',
                            color: addForm.organization === option.value ? 'white' : '#333'
                          }}
                          onMouseEnter={(e) => {
                            if (addForm.organization !== option.value) {
                              e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (addForm.organization !== option.value) {
                              e.currentTarget.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          <span style={{ color: addForm.organization === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                          {option.hasCheckmark && (
                            <IonIcon 
                              icon={checkmark} 
                              style={{ 
                                color: addForm.organization === option.value ? 'white' : '#00C851', 
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

            <div className="form-group">
              <IonLabel className="form-label">Select a Branch *</IonLabel>
              <div style={{ position: 'relative' }} ref={branchDropdownRef}>
                <IonInput
                  value={addForm.branch || ''}
                  placeholder="Select a Branch"
                  readonly
                  onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                  style={{ 
                    '--background': '#e8e8e8',
                    '--border-radius': '12px',
                    '--padding-start': '16px',
                    '--padding-end': '16px',
                    '--padding-top': '12px',
                    '--padding-bottom': '12px',
                    '--color': '#333',
                    '--placeholder-color': '#666'
                  }}
                />
                {showBranchDropdown && (
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
                      value={branchSearchQuery}
                      onIonInput={(e) => setBranchSearchQuery(e.detail.value!)}
                      placeholder="Search branches..."
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
                      {filteredBranchOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setAddForm(prev => ({ ...prev, branch: option.value }));
                            setShowBranchDropdown(false);
                            setBranchSearchQuery('');
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: addForm.branch === option.value ? '#2196f3' : 'white',
                            color: addForm.branch === option.value ? 'white' : '#333'
                          }}
                          onMouseEnter={(e) => {
                            if (addForm.branch !== option.value) {
                              e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (addForm.branch !== option.value) {
                              e.currentTarget.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          <span style={{ color: addForm.branch === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                          {option.hasCheckmark && (
                            <IonIcon 
                              icon={checkmark} 
                              style={{ 
                                color: addForm.branch === option.value ? 'white' : '#00C851', 
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

            <div className="form-group">
              <IonLabel className="form-label">Role Name *</IonLabel>
              <div style={{ position: 'relative' }} ref={nameDropdownRef}>
                <IonInput
                  value={addForm.name || ''}
                  placeholder="Search and select role name"
                  readonly
                  onClick={() => setNameDropdown(!showNameDropdown)}
                  style={{ 
                    '--background': '#e8e8e8',
                    '--border-radius': '12px',
                    '--padding-start': '16px',
                    '--padding-end': '16px',
                    '--padding-top': '12px',
                    '--padding-bottom': '12px',
                    '--color': '#333',
                    '--placeholder-color': '#666'
                  }}
                />
                {showNameDropdown && (
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
                      value={nameSearchQuery}
                      onIonInput={(e) => setNameSearchQuery(e.detail.value!)}
                      placeholder="Search role names..."
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
                      {filteredNameOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setAddForm(prev => ({ ...prev, name: option.value }));
                            setNameDropdown(false);
                            setNameSearchQuery('');
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: addForm.name === option.value ? '#2196f3' : 'white',
                            color: addForm.name === option.value ? 'white' : '#333'
                          }}
                          onMouseEnter={(e) => {
                            if (addForm.name !== option.value) {
                              e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (addForm.name !== option.value) {
                              e.currentTarget.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          <span style={{ color: addForm.name === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                          {option.hasCheckmark && (
                            <IonIcon 
                              icon={checkmark} 
                              style={{ 
                                color: addForm.name === option.value ? 'white' : '#00C851', 
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


            <div className="form-group">
              <IonLabel className="form-label">Select Statuses *</IonLabel>
              <div style={{ position: 'relative' }} ref={statusesDropdownRef}>
                <div
                  onClick={() => setShowStatusesDropdown(!showStatusesDropdown)}
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
                  {addForm.statuses.length > 0 ? (
                    addForm.statuses.map((status, index) => (
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
                            const newStatuses = addForm.statuses.filter((_, i) => i !== index);
                            setAddForm({...addForm, statuses: newStatuses});
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <span style={{ color: '#666', fontSize: '16px' }}>
                      Search and select statuses
                    </span>
                  )}
                </div>
                {showStatusesDropdown && (
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
                      value={statusesSearchQuery}
                      onIonInput={(e) => setStatusesSearchQuery(e.detail.value!)}
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
                      {filteredStatusOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            const isSelected = addForm.statuses.includes(option.value);
                            let newStatuses;
                            if (isSelected) {
                              newStatuses = addForm.statuses.filter(s => s !== option.value);
                            } else {
                              newStatuses = [...addForm.statuses, option.value];
                            }
                            setAddForm(prev => ({ ...prev, statuses: newStatuses }));
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: addForm.statuses.includes(option.value) ? '#2196f3' : 'white',
                            color: addForm.statuses.includes(option.value) ? 'white' : '#333'
                          }}
                          onMouseEnter={(e) => {
                            if (!addForm.statuses.includes(option.value)) {
                              e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!addForm.statuses.includes(option.value)) {
                              e.currentTarget.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              border: `2px solid ${addForm.statuses.includes(option.value) ? 'white' : '#ddd'}`,
                              backgroundColor: addForm.statuses.includes(option.value) ? 'white' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative'
                            }}>
                              {addForm.statuses.includes(option.value) && (
                                <div style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: '#2196f3'
                                }} />
                              )}
                            </div>
                            <span style={{ color: addForm.statuses.includes(option.value) ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                          </div>
                          {option.hasCheckmark && (
                            <IonIcon 
                              icon={checkmark} 
                              style={{ 
                                color: addForm.statuses.includes(option.value) ? 'white' : '#00C851', 
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
          </div>
          
          <div className="modal-actions">
            <IonButton 
              fill="solid"
              onClick={handleSaveAdd}
              className="add-button"
            >
              <IonIcon icon={checkmarkOutline} slot="start" />
              ADD ROLE
            </IonButton>
            <IonButton 
              fill="outline"
              onClick={handleCloseAdd}
              className="cancel-button"
            >
              CANCEL
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* Edit Role Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={handleCloseEdit}>
        <IonContent className="add-role-modal">
          <div className="modal-header">
            <h2>Edit Role</h2>
            <IonButton fill="clear" onClick={handleCloseEdit}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          
          <div className="modal-content">
            <div className="form-group">
              <IonLabel className="form-label">Select an Organization *</IonLabel>
              <div style={{ position: 'relative' }} ref={editOrganizationDropdownRef}>
                <IonInput
                  value={editForm.organization || ''}
                  placeholder="Select an Organization"
                  readonly
                  onClick={() => setShowEditOrganizationDropdown(!showEditOrganizationDropdown)}
                  style={{ 
                    '--background': '#e8e8e8',
                    '--border-radius': '12px',
                    '--padding-start': '16px',
                    '--padding-end': '16px',
                    '--padding-top': '12px',
                    '--padding-bottom': '12px',
                    '--color': '#333',
                    '--placeholder-color': '#666'
                  }}
                />
                {showEditOrganizationDropdown && (
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
                      value={editOrganizationSearchQuery}
                      onIonInput={(e) => setEditOrganizationSearchQuery(e.detail.value!)}
                      placeholder="Search organizations..."
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
                      {filteredEditOrganizationOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setEditForm(prev => ({ ...prev, organization: option.value }));
                            setShowEditOrganizationDropdown(false);
                            setEditOrganizationSearchQuery('');
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: editForm.organization === option.value ? '#2196f3' : 'white',
                            color: editForm.organization === option.value ? 'white' : '#333'
                          }}
                          onMouseEnter={(e) => {
                            if (editForm.organization !== option.value) {
                              e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (editForm.organization !== option.value) {
                              e.currentTarget.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          <span style={{ color: editForm.organization === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                          {option.hasCheckmark && (
                            <IonIcon 
                              icon={checkmark} 
                              style={{ 
                                color: editForm.organization === option.value ? 'white' : '#00C851', 
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

            <div className="form-group">
              <IonLabel className="form-label">Select a Branch *</IonLabel>
              <div style={{ position: 'relative' }} ref={editBranchDropdownRef}>
                <IonInput
                  value={editForm.branch || ''}
                  placeholder="Select a Branch"
                  readonly
                  onClick={() => setShowEditBranchDropdown(!showEditBranchDropdown)}
                  style={{ 
                    '--background': '#e8e8e8',
                    '--border-radius': '12px',
                    '--padding-start': '16px',
                    '--padding-end': '16px',
                    '--padding-top': '12px',
                    '--padding-bottom': '12px',
                    '--color': '#333',
                    '--placeholder-color': '#666'
                  }}
                />
                {showEditBranchDropdown && (
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
                      value={editBranchSearchQuery}
                      onIonInput={(e) => setEditBranchSearchQuery(e.detail.value!)}
                      placeholder="Search branches..."
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
                      {filteredEditBranchOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setEditForm(prev => ({ ...prev, branch: option.value }));
                            setShowEditBranchDropdown(false);
                            setEditBranchSearchQuery('');
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: editForm.branch === option.value ? '#2196f3' : 'white',
                            color: editForm.branch === option.value ? 'white' : '#333'
                          }}
                          onMouseEnter={(e) => {
                            if (editForm.branch !== option.value) {
                              e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (editForm.branch !== option.value) {
                              e.currentTarget.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          <span style={{ color: editForm.branch === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                          {option.hasCheckmark && (
                            <IonIcon 
                              icon={checkmark} 
                              style={{ 
                                color: editForm.branch === option.value ? 'white' : '#00C851', 
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

            <div className="form-group">
              <IonLabel className="form-label">Role Name *</IonLabel>
              <div style={{ position: 'relative' }} ref={editNameDropdownRef}>
                <IonInput
                  value={editForm.name || ''}
                  placeholder="Search and select role name"
                  readonly
                  onClick={() => setShowEditNameDropdown(!showEditNameDropdown)}
                  style={{ 
                    '--background': '#e8e8e8',
                    '--border-radius': '12px',
                    '--padding-start': '16px',
                    '--padding-end': '16px',
                    '--padding-top': '12px',
                    '--padding-bottom': '12px',
                    '--color': '#333',
                    '--placeholder-color': '#666'
                  }}
                />
                {showEditNameDropdown && (
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
                      value={editNameSearchQuery}
                      onIonInput={(e) => setEditNameSearchQuery(e.detail.value!)}
                      placeholder="Search role names..."
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
                      {filteredEditNameOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setEditForm(prev => ({ ...prev, name: option.value }));
                            setShowEditNameDropdown(false);
                            setEditNameSearchQuery('');
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: editForm.name === option.value ? '#2196f3' : 'white',
                            color: editForm.name === option.value ? 'white' : '#333'
                          }}
                          onMouseEnter={(e) => {
                            if (editForm.name !== option.value) {
                              e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (editForm.name !== option.value) {
                              e.currentTarget.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          <span style={{ color: editForm.name === option.value ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                          {option.hasCheckmark && (
                            <IonIcon 
                              icon={checkmark} 
                              style={{ 
                                color: editForm.name === option.value ? 'white' : '#00C851', 
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


            <div className="form-group">
              <IonLabel className="form-label">Select Statuses *</IonLabel>
              <div style={{ position: 'relative' }} ref={editStatusesDropdownRef}>
                <div
                  onClick={() => setShowEditStatusesDropdown(!showEditStatusesDropdown)}
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
                  {editForm.statuses.length > 0 ? (
                    editForm.statuses.map((status, index) => (
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
                            const newStatuses = editForm.statuses.filter((_, i) => i !== index);
                            setEditForm({...editForm, statuses: newStatuses});
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <span style={{ color: '#666', fontSize: '16px' }}>
                      Search and select statuses
                    </span>
                  )}
                </div>
                {showEditStatusesDropdown && (
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
                      value={editStatusesSearchQuery}
                      onIonInput={(e) => setEditStatusesSearchQuery(e.detail.value!)}
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
                      {filteredEditStatusOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            const isSelected = editForm.statuses.includes(option.value);
                            let newStatuses;
                            if (isSelected) {
                              newStatuses = editForm.statuses.filter(s => s !== option.value);
                            } else {
                              newStatuses = [...editForm.statuses, option.value];
                            }
                            setEditForm(prev => ({ ...prev, statuses: newStatuses }));
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: editForm.statuses.includes(option.value) ? '#2196f3' : 'white',
                            color: editForm.statuses.includes(option.value) ? 'white' : '#333'
                          }}
                          onMouseEnter={(e) => {
                            if (!editForm.statuses.includes(option.value)) {
                              e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!editForm.statuses.includes(option.value)) {
                              e.currentTarget.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              border: `2px solid ${editForm.statuses.includes(option.value) ? 'white' : '#ddd'}`,
                              backgroundColor: editForm.statuses.includes(option.value) ? 'white' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative'
                            }}>
                              {editForm.statuses.includes(option.value) && (
                                <div style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: '#2196f3'
                                }} />
                              )}
                            </div>
                            <span style={{ color: editForm.statuses.includes(option.value) ? 'white' : '#333', fontSize: '14px' }}>{option.label}</span>
                          </div>
                          {option.hasCheckmark && (
                            <IonIcon 
                              icon={checkmark} 
                              style={{ 
                                color: editForm.statuses.includes(option.value) ? 'white' : '#00C851', 
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
          </div>
          
          <div className="modal-actions">
            <IonButton 
              fill="solid"
              onClick={handleSaveEdit}
              className="add-button"
            >
              <IonIcon icon={checkmarkOutline} slot="start" />
              UPDATE ROLE
            </IonButton>
            <IonButton 
              fill="outline"
              onClick={handleCloseEdit}
              className="cancel-button"
            >
              CANCEL
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* View Role Modal */}
      <IonModal isOpen={showViewModal} onDidDismiss={handleCloseView}>
        <IonHeader>
          <IonToolbar style={{ '--background': '#4ecdc4' }}>
            <IonTitle style={{ color: 'white', fontWeight: 'bold' }}>Role Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleCloseView} style={{ color: 'white' }}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="view-modal-content" style={{ '--background': '#f8f9fa' }}>
          {viewingRole && (
            <div style={{ padding: '20px' }}>
              {/* Header Card */}
              <IonCard style={{ 
                margin: '0 0 20px 0', 
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)'
              }}>
                <IonCardHeader style={{ padding: '24px' }}>
                  <IonCardTitle style={{ 
                    color: 'white', 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    textAlign: 'center',
                    margin: 0
                  }}>
                    {viewingRole.name}
                  </IonCardTitle>
                </IonCardHeader>
              </IonCard>

              {/* Information Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Organization Card */}
                {viewingRole.organization && (
                  <IonCard style={{ 
                    margin: 0, 
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <IonCardContent style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}>
                          O
                        </div>
                        <div>
                          <h3 style={{ 
                            margin: '0 0 4px 0', 
                            color: '#333', 
                            fontSize: '16px',
                            fontWeight: '600'
                          }}>
                            Organization
                          </h3>
                          <p style={{ 
                            margin: 0, 
                            color: '#666', 
                            fontSize: '14px'
                          }}>
                            {viewingRole.organization}
                          </p>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                )}

                {/* Branch Card */}
                {viewingRole.branch && (
                  <IonCard style={{ 
                    margin: 0, 
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <IonCardContent style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}>
                          B
                        </div>
                        <div>
                          <h3 style={{ 
                            margin: '0 0 4px 0', 
                            color: '#333', 
                            fontSize: '16px',
                            fontWeight: '600'
                          }}>
                            Branch
                          </h3>
                          <p style={{ 
                            margin: 0, 
                            color: '#666', 
                            fontSize: '14px'
                          }}>
                            {viewingRole.branch}
                          </p>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                )}

                {/* Statuses Card */}
                {viewingRole.statuses && (
                  <IonCard style={{ 
                    margin: 0, 
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <IonCardContent style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          S
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ 
                            margin: '0 0 8px 0', 
                            color: '#333', 
                            fontSize: '16px',
                            fontWeight: '600'
                          }}>
                            Assigned Statuses
                          </h3>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {viewingRole.statuses.split(', ').map((status, index) => (
                              <span
                                key={index}
                                style={{
                                  background: '#e3f2fd',
                                  color: '#1976d2',
                                  padding: '6px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  border: '1px solid #bbdefb'
                                }}
                              >
                                {status}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                )}

                {/* Timestamps Card */}
                <IonCard style={{ 
                  margin: 0, 
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <IonCardContent style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#333',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        ⏰
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          margin: '0 0 8px 0', 
                          color: '#333', 
                          fontSize: '16px',
                          fontWeight: '600'
                        }}>
                          Timeline
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <p style={{ 
                            margin: 0, 
                            color: '#666', 
                            fontSize: '14px'
                          }}>
                            <strong>Created:</strong> {new Date(viewingRole.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p style={{ 
                            margin: 0, 
                            color: '#666', 
                            fontSize: '14px'
                          }}>
                            <strong>Updated:</strong> {new Date(viewingRole.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginTop: '24px',
                padding: '0 4px'
              }}>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(viewingRole.name);
                    setToastMessage('Role name copied to clipboard');
                    setShowToast(true);
                  }}
                  style={{
                    '--border-color': '#4ecdc4',
                    '--color': '#4ecdc4',
                    flex: 1
                  }}
                >
                  <IonIcon icon={checkmarkOutline} slot="start" />
                  Copy Name
                </IonButton>
                <IonButton
                  expand="block"
                  onClick={() => {
                    handleCloseView();
                    handleEdit(viewingRole.id);
                  }}
                  style={{
                    '--background': '#4ecdc4',
                    flex: 1
                  }}
                >
                  <IonIcon icon={createOutline} slot="start" />
                  Edit Role
                </IonButton>
              </div>
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

export default Roles;
