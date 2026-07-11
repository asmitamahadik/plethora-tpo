import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { listDepartmentDrives, listDepartmentStudents } from '../../api/hods';
import { useAuth } from '../../auth/AuthContext';

export default function HodDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    listDepartmentStudents().then(setStudents).catch(() => {});
    listDepartmentDrives().then(setDrives).catch(() => {});
  }, []);

  const publishedDrives = drives.filter((d) => d.status === 'PUBLISHED').length;

  return (
    <div>
      <Typography.Title level={3}>Welcome, {user?.displayName}</Typography.Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card><Statistic title="Students in department" value={students.length} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="Drives open to department" value={drives.length} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="Published drives" value={publishedDrives} /></Card>
        </Col>
      </Row>
    </div>
  );
}
