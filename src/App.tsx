import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { SidebarProvider } from './admin/contexts/SidebarContext';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Signup from './pages/Signup';
import Dashboard from './admin/pages/Dashboard';
import ApplicationType from './admin/pages/ApplicationType';
import NewRequests from './admin/pages/NewRequests';
import ViewDetails from './pages/ViewDetails';
import Schemes from './admin/pages/Schemes';
import CustomReports from './pages/CustomReports';
import ManagePages from './pages/ManagePages';
import BranchMaster from './admin/pages/BranchMaster';
import CasteMaster from './admin/pages/CasteMaster';
import TalukaMaster from './admin/pages/TalukaMaster';
import ActionMasters from './admin/pages/ActionMasters';
import OrganizationMasters from './admin/pages/OrganizationMasters';
import StatusMaster from './admin/pages/StatusMaster';
import PartnerMaster from './pages/PartnerMaster';
import StatusMapping from './pages/StatusMapping';
import RejectionMaster from './pages/RejectionMaster';
import DatabaseAccess from './pages/DatabaseAccess';
import Roles from './pages/Roles';
import Workflow from './pages/Workflow';
import AccessMapping from './pages/AccessMapping';
import BranchMapping from './pages/BranchMapping';
import PincodeMapping from './pages/PincodeMapping';
import Members from './pages/Members';
import Config from './pages/Config';
import Reports from './pages/Reports';
import AdminReport from './admin/pages/Report';
import Others from './pages/Others';
import PublicSchemesPage from './pages/PublicSchemesPage';
import About from './pages/About';
import LoanApplication from './pages/LoanApplication';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <SidebarProvider>
      <IonReactRouter>
        <IonRouterOutlet id="main-content">
        {/* Home Page */}
        <Route exact path="/home">
          <Home />
        </Route>

        {/* Login Page */}
        <Route exact path="/login">
          <Login />
        </Route>

        {/* Forgot Password Page */}
        <Route exact path="/forgot-password">
          <ForgotPassword />
        </Route>

        {/* Signup Page */}
        <Route exact path="/signup">
          <Signup />
        </Route>

        {/* Admin Dashboard Page */}
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>

        {/* Application Type Page */}
        <Route exact path="/application-type">
          <ApplicationType />
        </Route>

        {/* New Requests Page */}
        <Route exact path="/new-requests">
          <NewRequests />
        </Route>
        <Route exact path="/view-details/:id">
          <ViewDetails />
        </Route>
        <Route exact path="/custom-reports">
          <CustomReports />
        </Route>
        <Route exact path="/manage-pages">
          <ManagePages />
        </Route>
        <Route exact path="/branch-master">
          <BranchMaster />
        </Route>
        <Route exact path="/caste-master">
          <CasteMaster />
        </Route>
        <Route exact path="/taluka-master">
          <TalukaMaster />
        </Route>
        <Route exact path="/action-masters">
          <ActionMasters />
        </Route>
        <Route exact path="/organization-masters">
          <OrganizationMasters />
        </Route>
        <Route exact path="/status-master">
          <StatusMaster />
        </Route>
        <Route exact path="/partner-master">
          <PartnerMaster />
        </Route>
        <Route exact path="/status-mapping">
          <StatusMapping />
        </Route>
        <Route exact path="/rejection-masters">
          <RejectionMaster />
        </Route>
        <Route exact path="/database-access">
          <DatabaseAccess />
        </Route>
        <Route exact path="/roles">
          <Roles />
        </Route>
        <Route exact path="/workflow">
          <Workflow />
        </Route>
        <Route exact path="/access-mapping">
          <AccessMapping />
        </Route>
        <Route exact path="/branch-mapping">
          <BranchMapping />
        </Route>
        <Route exact path="/pincode-mapping">
          <PincodeMapping />
        </Route>
        <Route exact path="/members">
          <Members />
        </Route>
        <Route exact path="/config">
          <Config />
        </Route>
        <Route exact path="/reports">
          <AdminReport />
        </Route>
        <Route exact path="/others">
          <Others />
        </Route>

        {/* Admin Schemes Page */}
        <Route exact path="/admin/schemes">
          <Schemes />
        </Route>

        {/* Public Schemes Page */}
        <Route exact path="/schemes">
          <PublicSchemesPage />
        </Route>

        {/* About Page */}
        <Route exact path="/about">
          <About />
        </Route>

        {/* Loan Application Page */}
        <Route exact path="/loan-application">
          <LoanApplication />
        </Route>

        {/* Default route → go to home directly */}
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
    </SidebarProvider>
  </IonApp>
);

export default App;
