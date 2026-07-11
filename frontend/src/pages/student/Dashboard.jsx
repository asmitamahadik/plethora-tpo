import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { listDrives } from '../../api/drives';
import { myApplications } from '../../api/applications';
import { useAuth } from '../../auth/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    listDrives().then(setDrives).catch(() => {});
    myApplications().then(setApplications).catch(() => {});
  }, []);

  const selected = applications.filter((a) => a.status === 'SELECTED').length;
  const inProgress = applications.filter((a) => !['SELECTED', 'REJECTED'].includes(a.status)).length;

  return (
    <div>
      <Typography.Title level={3}>Welcome, {user?.displayName}</Typography.Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Eligible open drives" value={drives.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Applications in progress" value={inProgress} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Offers received" value={selected} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
