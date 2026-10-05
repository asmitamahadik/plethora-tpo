import { useEffect, useState } from 'react';
import { Button, Input, Select, Space, Table, message } from 'antd';
import { useParams } from 'react-router-dom';
import { applicationsForDrive, updateApplicationStatus, updateInterviewStatus } from '../../api/applications';
import { departmentApplicantsForDrive } from '../../api/hods';
import { getDrive } from '../../api/drives';
import BackButton from '../../components/BackButton';
import EntityCell from '../../components/EntityCell';
import PageHeader from '../../components/PageHeader';
import StatusTag from '../../components/StatusTag';

const STATUS_OPTIONS = ['APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED'];

export default function Applicants({ mode }) {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [drive, setDrive] = useState(null);
  const [pendingStatus, setPendingStatus] = useState({});
  const [pendingRemarks, setPendingRemarks] = useState({});

  const load = () => {
    const fetchApplicants = mode === 'hod' ? departmentApplicantsForDrive : applicationsForDrive;
    fetchApplicants(id).then(setApplications).catch(() => {});
    getDrive(id).then(setDrive).catch(() => {});
  };

  useEffect(load, [id, mode]);

  const handleUpdate = async (applicationId) => {
    const status = pendingStatus[applicationId];
    if (!status) {
      message.warning('Choose a status first');
      return;
    }
    const remarks = pendingRemarks[applicationId];
    try {
      const updater = mode === 'company' ? updateInterviewStatus : updateApplicationStatus;
      await updater(applicationId, { status, remarks });
      message.success('Status updated — student notified');
      load();
    } catch (err) {
      message.error(err.response?.data?.message || 'Could not update status');
    }
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      render: (_, record) => <EntityCell name={record.studentName} secondary={record.rollNumber} color="#fa541c" />,
    },
    {
      title: 'CGPA',
      dataIndex: 'cgpa',
      align: 'right',
      sorter: (a, b) => (a.cgpa ?? 0) - (b.cgpa ?? 0),
      render: (v) => <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{v}</span>,
    },
    { title: 'Status', dataIndex: 'status', render: (s) => <StatusTag status={s} /> },
    ...(mode === 'hod' ? [] : [{
      title: 'Update status',
      render: (_, record) => (
        <Space>
          <Select
            style={{ width: 170 }}
            placeholder="New status"
            options={STATUS_OPTIONS.map((s) => ({ value: s, label: s.replaceAll('_', ' ') }))}
            onChange={(v) => setPendingStatus((prev) => ({ ...prev, [record.id]: v }))}
          />
          <Input
            placeholder="Remarks"
            style={{ width: 140 }}
            onChange={(e) => setPendingRemarks((prev) => ({ ...prev, [record.id]: e.target.value }))}
          />
          <Button size="small" type="primary" onClick={() => handleUpdate(record.id)}>
            Update
          </Button>
        </Space>
      ),
    }]),
  ];

  return (
    <div>
      <BackButton />
      <PageHeader
        title={`Applicants${drive ? ` — ${drive.title}` : ''}`}
        subtitle="Review applicants and move them through the placement pipeline"
      />
      <Table rowKey="id" columns={columns} dataSource={applications} />
    </div>
  );
}
