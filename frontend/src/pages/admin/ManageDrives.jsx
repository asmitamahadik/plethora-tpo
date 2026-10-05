import { useEffect, useState } from 'react';
import { Button, Popconfirm, Segmented, Table, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { closeDrive, deleteDrive, listDrives, publishDrive } from '../../api/drives';
import BackButton from '../../components/BackButton';
import DriveFormModal from '../../components/DriveFormModal';
import DriveListView from '../../components/DriveListView';
import PageHeader from '../../components/PageHeader';
import StatusTag from '../../components/StatusTag';

export default function ManageDrives() {
  const [drives, setDrives] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [view, setView] = useState('Table');
  const navigate = useNavigate();

  const load = () => {
    listDrives().then(setDrives).catch(() => {});
  };

  useEffect(load, []);

  const handlePublish = async (id) => {
    try {
      await publishDrive(id);
      message.success('Drive published — eligible students have been notified');
      load();
    } catch (err) {
      message.error(err.response?.data?.message || 'Could not publish');
    }
  };

  const handleClose = async (id) => {
    try {
      await closeDrive(id);
      message.success('Drive closed');
      load();
    } catch (err) {
      message.error(err.response?.data?.message || 'Could not close drive');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDrive(id);
      message.success('Drive deleted');
      load();
    } catch (err) {
      message.error(err.response?.data?.message || 'Could not delete drive');
    }
  };

  const rowActions = (record) => [
    <Button key="applicants" size="small" onClick={() => navigate(`/admin/drives/${record.id}/applicants`)}>
      Applicants
    </Button>,
    <Button key="edit" size="small" onClick={() => { setEditingDrive(record); setModalOpen(true); }}>
      Edit
    </Button>,
    record.status === 'DRAFT' && (
      <Button key="publish" size="small" type="primary" onClick={() => handlePublish(record.id)}>
        Publish
      </Button>
    ),
    record.status === 'PUBLISHED' && (
      <Button key="close" size="small" onClick={() => handleClose(record.id)}>
        Close
      </Button>
    ),
    <Popconfirm key="delete" title="Delete this drive?" onConfirm={() => handleDelete(record.id)}>
      <Button size="small" danger>Delete</Button>
    </Popconfirm>,
  ].filter(Boolean);

  const columns = [
    { title: 'Title', dataIndex: 'title' },
    { title: 'Company', dataIndex: 'companyName' },
    { title: 'Status', dataIndex: 'status', render: (s) => <StatusTag status={s} /> },
    {
      title: 'Min CGPA',
      dataIndex: 'minCgpa',
      align: 'right',
      sorter: (a, b) => (a.minCgpa ?? 0) - (b.minCgpa ?? 0),
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
        title="Manage Drives"
        subtitle="Create, publish and track active placement drives"
        actions={
          <>
            <Segmented options={['Table', 'List']} value={view} onChange={setView} />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingDrive(null); setModalOpen(true); }}>
              New Drive
            </Button>
          </>
        }
      />
      {view === 'Table' ? (
        <Table rowKey="id" columns={columns} dataSource={drives} />
      ) : (
        <DriveListView drives={drives} renderActions={rowActions} />
      )}
      <DriveFormModal
        open={modalOpen}
        drive={editingDrive}
        companyId={null}
        onClose={() => setModalOpen(false)}
        onSaved={() => { setModalOpen(false); load(); }}
      />
    </div>
  );
}
