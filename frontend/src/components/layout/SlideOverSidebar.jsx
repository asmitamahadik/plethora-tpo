import { useEffect } from 'react';
import { Avatar, Typography, theme as antdTheme } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SlideOverSidebar({ open, onClose, items }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = antdTheme.useToken();

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const handleNavigate = (key) => {
    navigate(key);
    onClose();
  };

  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? 'sidebar-backdrop-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`slide-over-sidebar ${open ? 'slide-over-sidebar-open' : ''}`}
        aria-hidden={!open}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
          color: token.colorText,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px 20px' }}>
          <Avatar size={28} style={{ background: token.colorPrimary }} icon={<RocketOutlined />} />
          <Typography.Text strong style={{ fontSize: 18 }}>Plethora</Typography.Text>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map((item) => {
            const active = location.pathname === item.key;
            return (
              <button
                key={item.key}
                type="button"
                className="slide-over-sidebar-link"
                onClick={() => handleNavigate(item.key)}
                style={{
                  background: active ? token.colorPrimaryBg : 'transparent',
                  color: active ? token.colorPrimary : token.colorText,
                  fontWeight: active ? 600 : 400,
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
