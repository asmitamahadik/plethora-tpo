import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import AppLayout from './components/AppLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import StudentDashboard from './pages/student/Dashboard';
import DriveList from './pages/student/DriveList';
import MyApplications from './pages/student/MyApplications';
import StudentProfile from './pages/student/Profile';

import CompanyDashboard from './pages/company/Dashboard';
import CompanyMyDrives from './pages/company/MyDrives';
import CompanyProfile from './pages/company/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import ManageDrives from './pages/admin/ManageDrives';
import AdminStudents from './pages/admin/Students';
import AdminCompanies from './pages/admin/Companies';
import AdminHods from './pages/admin/Hods';
import AuditLogView from './pages/admin/AuditLogView';

import HodDashboard from './pages/hod/Dashboard';
import HodStudents from './pages/hod/Students';
import HodDrives from './pages/hod/Drives';

import Applicants from './pages/shared/Applicants';

const HOME_BY_ROLE = {
  STUDENT: '/student',
  TPO_ADMIN: '/admin',
  COMPANY: '/company',
  HOD: '/hod',
};

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={HOME_BY_ROLE[user.role] || '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
        <Route element={<AppLayout />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/drives" element={<DriveList />} />
          <Route path="/student/applications" element={<MyApplications />} />
          <Route path="/student/profile" element={<StudentProfile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['COMPANY']} />}>
        <Route element={<AppLayout />}>
          <Route path="/company" element={<CompanyDashboard />} />
          <Route path="/company/drives" element={<CompanyMyDrives />} />
          <Route path="/company/drives/:id/applicants" element={<Applicants mode="company" />} />
          <Route path="/company/profile" element={<CompanyProfile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['TPO_ADMIN']} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/drives" element={<ManageDrives />} />
          <Route path="/admin/drives/:id/applicants" element={<Applicants mode="admin" />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/companies" element={<AdminCompanies />} />
          <Route path="/admin/hods" element={<AdminHods />} />
          <Route path="/admin/audit-logs" element={<AuditLogView />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['HOD']} />}>
        <Route element={<AppLayout />}>
          <Route path="/hod" element={<HodDashboard />} />
          <Route path="/hod/students" element={<HodStudents />} />
          <Route path="/hod/drives" element={<HodDrives />} />
          <Route path="/hod/drives/:id/applicants" element={<Applicants mode="hod" />} />
        </Route>
      </Route>

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}
