import { useEffect, useState } from 'react';
import { Button, Segmented, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { listDepartmentDrives } from '../../api/hods';
import BackButton from '../../components/BackButton';
import DriveListView from '../../components/DriveListView';
import PageHeader from '../../components/PageHeader';
import StatusTag from '../../components/StatusTag';

export default function HodDrives() {
  const [drives, setDrives] = useState([]);
  const [view, setView] = useState('Table');
  const navigate = useNavigate();

  useEffect(() => {
    listDepartmentDrives().then(setDrives).catch(() => {});
  }, []);

  const rowActions = (record) => [
    <Button key="view" size="small" onClick={() => navigate(`/hod/drives/${record.id}/applicants`)}>
      View applicants
    </Button>,
  ];

  const columns = [
    { title: 'Title', dataIndex: 'title' },
    { title: 'Company', dataIndex: 'companyName' },
    { title: 'Status', dataIndex: 'status', render: (s) => <StatusTag status={s} /> },
    {
      title: 'Min CGPA',
      dataIndex: 'minCgpa',
      align: 'right',
      render: (v) => <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{v}</span>,
    },
    { title: 'Deadline', dataIndex: 'applicationDeadline' },
    {
      title: 'Actions',
      render: (_, record) => <div style={{ display: 'flex', gap: 8 }}>{rowActions(record)}</div>,
    },
  ];

  return (
    <div>
      <BackButton />
      <PageHeader
        title="Placement Drives"
        subtitle="Drives open to students in your department"
        actions={<Segmented options={['Table', 'List']} value={view} onChange={setView} />}
      />
      {view === 'Table' ? (
        <Table rowKey="id" columns={columns} dataSource={drives} />
      ) : (
        <DriveListView drives={drives} renderActions={rowActions} />
      )}
    </div>
  );
}
