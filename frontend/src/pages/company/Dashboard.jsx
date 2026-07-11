import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { listMyCompanyDrives } from '../../api/drives';
import { useAuth } from '../../auth/AuthContext';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    listMyCompanyDrives().then(setDrives).catch(() => {});
  }, []);

  const published = drives.filter((d) => d.status === 'PUBLISHED').length;

  return (
    <div>
      <Typography.Title level={3}>Welcome, {user?.displayName}</Typography.Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Total drives posted" value={drives.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Currently published" value={published} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
