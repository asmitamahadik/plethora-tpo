import { useEffect, useState } from 'react';
import { Button, Table, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { listDepartmentDrives } from '../../api/hods';
import StatusTag from '../../components/StatusTag';

export default function HodDrives() {
  const [drives, setDrives] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    listDepartmentDrives().then(setDrives).catch(() => {});
  }, []);

  const columns = [
    { title: 'Title', dataIndex: 'title' },
    { title: 'Company', dataIndex: 'companyName' },
    { title: 'Status', dataIndex: 'status', render: (s) => <StatusTag status={s} /> },
    { title: 'Min CGPA', dataIndex: 'minCgpa' },
    { title: 'Deadline', dataIndex: 'applicationDeadline' },
    {
      title: 'Actions',
      render: (_, record) => (
        <Button size="small" onClick={() => navigate(`/hod/drives/${record.id}/applicants`)}>
          View applicants
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={3}>Placement Drives</Typography.Title>
      <Table rowKey="id" columns={columns} dataSource={drives} />
    </div>
  );
}
