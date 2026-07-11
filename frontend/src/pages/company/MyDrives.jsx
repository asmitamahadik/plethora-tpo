import { useEffect, useState } from 'react';
import { Button, Popconfirm, Space, Table, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { closeDrive, deleteDrive, listMyCompanyDrives, publishDrive } from '../../api/drives';
import DriveFormModal from '../../components/DriveFormModal';
import StatusTag from '../../components/StatusTag';
import { getMyCompanyProfile } from '../../api/companies';

export default function CompanyMyDrives() {
  const [drives, setDrives] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const navigate = useNavigate();

  const load = () => {
    listMyCompanyDrives().then(setDrives).catch(() => {});
  };

  useEffect(() => {
    load();
    getMyCompanyProfile().then((p) => setCompanyId(p.id));
  }, []);

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
    await closeDrive(id);
    message.success('Drive closed');
    load();
  };

  const handleDelete = async (id) => {
    await deleteDrive(id);
    message.success('Drive deleted');
    load();
  };

  const columns = [
    { title: 'Title', dataIndex: 'title' },
    { title: 'Status', dataIndex: 'status', render: (s) => <StatusTag status={s} /> },
    { title: 'Min CGPA', dataIndex: 'minCgpa' },
    { title: 'Deadline', dataIndex: 'applicationDeadline' },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => navigate(`/company/drives/${record.id}/applicants`)}>
            Applicants
          </Button>
          <Button size="small" onClick={() => { setEditingDrive(record); setModalOpen(true); }}>
            Edit
          </Button>
          {record.status === 'DRAFT' && (
            <Button size="small" type="primary" onClick={() => handlePublish(record.id)}>
              Publish
            </Button>
          )}
          {record.status === 'PUBLISHED' && (
            <Button size="small" onClick={() => handleClose(record.id)}>
              Close
            </Button>
          )}
          <Popconfirm title="Delete this drive?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>My Drives</Typography.Title>
        <Button type="primary" onClick={() => { setEditingDrive(null); setModalOpen(true); }}>
          New Drive
        </Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={drives} />
      <DriveFormModal
        open={modalOpen}
        drive={editingDrive}
        companyId={companyId}
        onClose={() => setModalOpen(false)}
        onSaved={() => { setModalOpen(false); load(); }}
      />
    </div>
  );
}
