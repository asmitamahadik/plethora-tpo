import { useEffect, useState } from 'react';
import { Badge, Button, Dropdown, Empty, List } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { markNotificationRead, myNotifications } from '../api/notifications';

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const load = () => {
    myNotifications().then(setNotifications).catch(() => {});
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenChange = (next) => {
    setOpen(next);
    if (next) {
      const unread = notifications.filter((n) => !n.read);
      Promise.all(unread.map((n) => markNotificationRead(n.id))).then(load);
    }
  };

  const menu = (
    <div style={{ width: 340, maxHeight: 400, overflowY: 'auto', background: 'var(--ant-color-bg-elevated, #fff)', border: '1px solid #eee', borderRadius: 8, padding: 8 }}>
      {notifications.length === 0 ? (
        <Empty description="No notifications" style={{ padding: 16 }} />
      ) : (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item style={{ opacity: item.read ? 0.6 : 1 }}>
              <List.Item.Meta
                title={item.type.replaceAll('_', ' ')}
                description={item.message}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Dropdown popupRender={() => menu} trigger={['click']} open={open} onOpenChange={handleOpenChange}>
      <Badge count={unreadCount} size="small">
        <Button shape="circle" icon={<BellOutlined />} />
      </Badge>
    </Dropdown>
  );
}
