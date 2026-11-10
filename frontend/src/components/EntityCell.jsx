import { Avatar, Typography } from 'antd';

function initialsOf(name) {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function EntityCell({ name, secondary, color = '#1d4ed8' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Avatar size={32} style={{ background: color, flexShrink: 0 }}>
        {initialsOf(name)}
      </Avatar>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
        <Typography.Text strong>{name}</Typography.Text>
        {secondary && (
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {secondary}
          </Typography.Text>
        )}
      </div>
    </div>
  );
}
