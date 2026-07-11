import { Tag } from 'antd';

const COLORS = {
  DRAFT: 'default',
  PUBLISHED: 'blue',
  CLOSED: 'default',
  APPLIED: 'blue',
  SHORTLISTED: 'gold',
  INTERVIEW_SCHEDULED: 'purple',
  SELECTED: 'green',
  REJECTED: 'red',
};

export default function StatusTag({ status }) {
  return <Tag color={COLORS[status] || 'default'}>{status?.replaceAll('_', ' ')}</Tag>;
}
