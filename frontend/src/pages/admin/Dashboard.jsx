import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { listStudents } from '../../api/students';
import { listCompanies } from '../../api/companies';
import { listDrives } from '../../api/drives';
import { useAuth } from '../../auth/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    listStudents().then(setStudents).catch(() => {});
    listCompanies().then(setCompanies).catch(() => {});
    listDrives().then(setDrives).catch(() => {});
  }, []);

  const publishedDrives = drives.filter((d) => d.status === 'PUBLISHED').length;

  return (
    <div>
      <Typography.Title level={3}>Welcome, {user?.displayName}</Typography.Title>
      <Row gutter={16}>
        <Col span={6}>
          <Card><Statistic title="Students" value={students.length} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Companies" value={companies.length} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Total drives" value={drives.length} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Published drives" value={publishedDrives} /></Card>
        </Col>
      </Row>
    </div>
  );
}
