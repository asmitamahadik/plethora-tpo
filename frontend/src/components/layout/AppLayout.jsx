import { useMemo, useState } from 'react';
import { Card, Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import AppHeader from './AppHeader';
import SlideOverSidebar from './SlideOverSidebar';

const { Content } = Layout;

const MENUS = {
  STUDENT: [
    { key: '/student', label: 'Dashboard' },
    { key: '/student/drives', label: 'Placement Drives' },
    { key: '/student/applications', label: 'My Applications' },
    { key: '/student/profile', label: 'Profile' },
  ],
  TPO_ADMIN: [
    { key: '/admin', label: 'Dashboard' },
    { key: '/admin/drives', label: 'Manage Drives' },
    { key: '/admin/students', label: 'Students' },
    { key: '/admin/companies', label: 'Companies' },
    { key: '/admin/hods', label: 'Manage HODs' },
    { key: '/admin/users', label: 'User Management' },
    { key: '/admin/audit-logs', label: 'Audit Log' },
  ],
  COMPANY: [
    { key: '/company', label: 'Dashboard' },
    { key: '/company/drives', label: 'My Drives' },
    { key: '/company/profile', label: 'Profile' },
  ],
  HOD: [
    { key: '/hod', label: 'Dashboard' },
    { key: '/hod/students', label: 'Students' },
    { key: '/hod/drives', label: 'Placement Drives' },
  ],
};

export default function AppLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = useMemo(() => MENUS[user?.role] || [], [user?.role]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader navItems={navItems} onMenuClick={() => setSidebarOpen(true)} />
      <SlideOverSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} items={navItems} />
      <Content style={{ margin: 24 }}>
        <Card
          style={{ borderRadius: 14, boxShadow: 'var(--app-shadow-soft)' }}
          styles={{ body: { padding: 24 } }}
        >
          <Outlet />
        </Card>
      </Content>
    </Layout>
  );
}
