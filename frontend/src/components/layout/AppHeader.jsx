import { useEffect, useMemo, useRef, useState } from 'react';
import { AutoComplete, Avatar, Button, Dropdown, Input, Layout, Space, Typography, theme as antdTheme } from 'antd';
import { LogoutOutlined, MenuOutlined, RocketOutlined, SearchOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import NotificationsBell from '../NotificationsBell';
import ThemeToggleButton from '../common/ThemeToggleButton';

const { Header } = Layout;

const SETTINGS_ROUTE_BY_ROLE = {
  STUDENT: '/student/profile',
  COMPANY: '/company/profile',
};

export default function AppHeader({ navItems, onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { token } = antdTheme.useToken();
  const searchRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');

  const settingsRoute = SETTINGS_ROUTE_BY_ROLE[user?.role];

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const searchOptions = useMemo(
    () => navItems.map((item) => ({ value: item.label, key: item.key, label: item.label })),
    [navItems],
  );

  const goTo = (key) => {
    setSearchValue('');
    navigate(key);
  };

  const userMenuItems = [
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout' },
  ];

  return (
    <Header
      style={{
        height: 'auto',
        lineHeight: 'normal',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        padding: '12px 24px',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <Button shape="circle" type="text" icon={<MenuOutlined />} onClick={onMenuClick} aria-label="Open navigation" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Avatar size={28} style={{ background: token.colorPrimary }} icon={<RocketOutlined />} />
          <Typography.Text strong style={{ fontSize: 18 }}>Plethora</Typography.Text>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <AutoComplete
          options={searchOptions}
          value={searchValue}
          onChange={setSearchValue}
          onSelect={goTo}
          filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
          style={{ width: 220 }}
        >
          <Input
            ref={searchRef}
            prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
            placeholder="Search..."
            suffix={
              <span
                style={{
                  fontSize: 11,
                  color: token.colorTextTertiary,
                  border: `1px solid ${token.colorBorder}`,
                  borderRadius: 4,
                  padding: '0 5px',
                }}
              >
                ⌘K
              </span>
            }
          />
        </AutoComplete>

        <NotificationsBell />

        {settingsRoute && (
          <Button
            shape="circle"
            icon={<SettingOutlined />}
            onClick={() => navigate(settingsRoute)}
            aria-label="Settings"
          />
        )}

        <ThemeToggleButton />

        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: ({ key }) => {
              if (key === 'logout') {
                logout();
                navigate('/login');
              }
            },
          }}
          trigger={['click']}
        >
          <Space
            style={{
              cursor: 'pointer',
              padding: '4px 10px 4px 4px',
              borderRadius: 999,
              background: token.colorFillTertiary,
            }}
          >
            <Avatar size={28} icon={<UserOutlined />} />
            <Typography.Text strong style={{ fontSize: 13 }}>{user?.displayName}</Typography.Text>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
}
