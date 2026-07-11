import { useEffect, useState } from 'react';
import { Steps, Table, Typography } from 'antd';
import { myApplications } from '../../api/applications';
import StatusTag from '../../components/StatusTag';

const STEP_ORDER = ['APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED'];

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    myApplications().then(setApplications).catch(() => {});
  }, []);

  const columns = [
    { title: 'Drive', dataIndex: 'driveTitle' },
    { title: 'Company', dataIndex: 'companyName' },
    { title: 'Applied on', dataIndex: 'appliedAt', render: (v) => new Date(v).toLocaleDateString() },
    { title: 'Status', dataIndex: 'status', render: (s) => <StatusTag status={s} /> },
  ];

  return (
    <div>
      <Typography.Title level={3}>My Applications</Typography.Title>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={applications}
        expandable={{
          expandedRowKeys: expanded,
          onExpandedRowsChange: setExpanded,
          expandedRowRender: (record) => {
            const current = record.status === 'REJECTED'
              ? STEP_ORDER.indexOf('SHORTLISTED')
              : STEP_ORDER.indexOf(record.status);
            return (
              <div>
                {record.status === 'REJECTED' ? (
                  <Typography.Text type="danger">This application was not selected.</Typography.Text>
                ) : (
                  <Steps
                    size="small"
                    current={current === -1 ? 0 : current}
                    items={STEP_ORDER.map((s) => ({ title: s.replaceAll('_', ' ') }))}
                  />
                )}
                {record.remarks && <Typography.Paragraph style={{ marginTop: 12 }}>Remarks: {record.remarks}</Typography.Paragraph>}
              </div>
            );
          },
        }}
      />
    </div>
  );
}
