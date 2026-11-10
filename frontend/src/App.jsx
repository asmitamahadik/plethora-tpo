import { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));

const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const DriveList = lazy(() => import('./pages/student/DriveList'));
const MyApplications = lazy(() => import('./pages/student/MyApplications'));
const StudentProfile = lazy(() => import('./pages/student/Profile'));

const CompanyDashboard = lazy(() => import('./pages/company/Dashboard'));
const CompanyMyDrives = lazy(() => import('./pages/company/MyDrives'));
const CompanyProfile = lazy(() => import('./pages/company/Profile'));

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageDrives = lazy(() => import('./pages/admin/ManageDrives'));
const AdminStudents = lazy(() => import('./pages/admin/Students'));
const AdminCompanies = lazy(() => import('./pages/admin/Companies'));
const AdminHods = lazy(() => import('./pages/admin/Hods'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AuditLogView = lazy(() => import('./pages/admin/AuditLogView'));

const HodDashboard = lazy(() => import('./pages/hod/Dashboard'));
const HodStudents = lazy(() => import('./pages/hod/Students'));
const HodDrives = lazy(() => import('./pages/hod/Drives'));

const Applicants = lazy(() => import('./pages/shared/Applicants'));

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

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Spin size="large" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
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
            <Route path="/admin/users" element={<AdminUsers />} />
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
    </Suspense>
  );
}
