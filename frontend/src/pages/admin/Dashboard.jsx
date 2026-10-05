import { useEffect, useState } from 'react';
import { Avatar, Button, Card, Col, List, Row, Statistic, Table, Typography } from 'antd';
import {
  BankOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  RocketOutlined,
  TeamOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { listStudents } from '../../api/students';
import { listCompanies } from '../../api/companies';
import { listDrives } from '../../api/drives';
import { listAuditLogs } from '../../api/auditLogs';
import { useAuth } from '../../auth/AuthContext';
import StatusTag from '../../components/StatusTag';

function StatCard({ title, value, icon, color, onClick }) {
  return (
    <Card hoverable className="stat-card" onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Avatar size={48} style={{ backgroundColor: color, flexShrink: 0 }} icon={icon} />
        <Statistic title={title} value={value} />
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    listStudents().then(setStudents).catch(() => {});
    listCompanies().then(setCompanies).catch(() => {});
    listDrives().then(setDrives).catch(() => {});
    listAuditLogs().then(setAuditLogs).catch(() => {});
  }, []);

  const publishedDrives = drives.filter((d) => d.status === 'PUBLISHED').length;
  const recentDrives = [...drives]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  const recentActivity = auditLogs.slice(0, 6);

  const driveColumns = [
    { title: 'Title', dataIndex: 'title' },
    { title: 'Company', dataIndex: 'companyName' },
    { title: 'Status', dataIndex: 'status', render: (s) => <StatusTag status={s} /> },
    { title: 'Deadline', dataIndex: 'applicationDeadline' },
  ];

  return (
    <div>
      <div
        style={{
          background: 'linear-gradient(135deg, #4f6ef7 0%, #6a4cf0 100%)',
          borderRadius: 12,
          padding: '28px 32px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <Typography.Title level={3} style={{ color: '#fff', margin: 0 }}>
            Hello, {user?.displayName || 'TPO Admin'} 👋
          </Typography.Title>
          <Typography.Text style={{ color: 'rgba(255,255,255,0.85)' }}>
            Here is an overview of the ongoing placement season and active recruitment drives.
          </Typography.Text>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/drives')}>
            Create Drive
          </Button>
          <Button icon={<UserAddOutlined />} onClick={() => navigate('/admin/companies')}>
            Add Company
          </Button>
        </div>
      </div>

      <Row gutter={16}>
        <Col span={6}>
          <StatCard
            title="Students"
            value={students.length}
            icon={<TeamOutlined />}
            color="#1677ff"
            onClick={() => navigate('/admin/students')}
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="Companies"
            value={companies.length}
            icon={<BankOutlined />}
            color="#722ed1"
            onClick={() => navigate('/admin/companies')}
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="Total drives"
            value={drives.length}
            icon={<RocketOutlined />}
            color="#fa8c16"
            onClick={() => navigate('/admin/drives')}
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="Published drives"
            value={publishedDrives}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            onClick={() => navigate('/admin/drives')}
          />
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card title="Active Drives" extra={<a onClick={() => navigate('/admin/drives')}>View all</a>}>
            <Table
              rowKey="id"
              size="small"
              columns={driveColumns}
              dataSource={recentDrives}
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Recent Activity" extra={<a onClick={() => navigate('/admin/audit-logs')}>View all</a>}>
            <List
              size="small"
              dataSource={recentActivity}
              locale={{ emptyText: 'No recent activity' }}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.action.replaceAll('_', ' ')}
                    description={`${item.details || ''} — ${new Date(item.timestamp).toLocaleString()}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
