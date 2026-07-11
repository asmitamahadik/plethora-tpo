import { Layout, Menu, Space, Typography, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import NotificationsBell from './NotificationsBell';

const { Header, Sider, Content } = Layout;

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const items = MENUS[user?.role] || [];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, padding: '16px 20px' }}>
          Plethora
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, padding: '0 24px' }}>
          <NotificationsBell />
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Typography.Text strong>{user?.displayName}</Typography.Text>
          </Space>
          <Button icon={<LogoutOutlined />} onClick={() => { logout(); navigate('/login'); }}>
            Logout
          </Button>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
