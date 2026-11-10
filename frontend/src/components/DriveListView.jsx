import { Card, Col, Empty, Row, Typography } from 'antd';
import StatusTag from './StatusTag';

export default function DriveListView({ drives, renderActions }) {
  if (!drives.length) {
    return <Empty description="No drives yet" />;
  }

  return (
    <Row gutter={16}>
      {drives.map((drive) => (
        <Col span={8} key={drive.id} style={{ marginBottom: 16 }}>
          <Card
            title={drive.title}
            extra={<StatusTag status={drive.status} />}
            actions={renderActions ? renderActions(drive) : undefined}
          >
            <Typography.Paragraph type="secondary" style={{ margin: 0 }}>{drive.companyName}</Typography.Paragraph>
            <Typography.Paragraph style={{ margin: 0 }}>
              CTC: {drive.ctcPackage ? `₹${drive.ctcPackage} LPA` : 'Not disclosed'}
            </Typography.Paragraph>
            <Typography.Paragraph style={{ margin: 0 }}>Min CGPA: {drive.minCgpa}</Typography.Paragraph>
            <Typography.Paragraph style={{ margin: 0 }}>
              Deadline: {drive.applicationDeadline || 'Rolling'}
            </Typography.Paragraph>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
