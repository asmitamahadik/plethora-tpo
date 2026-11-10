import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { listStudents } from '../../api/students';
import BackButton from '../../components/BackButton';
import EntityCell from '../../components/EntityCell';
import PageHeader from '../../components/PageHeader';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    listStudents().then(setStudents).catch(() => {});
  }, []);

  const columns = [
    {
      title: 'Student',
      dataIndex: 'fullName',
      render: (_, record) => <EntityCell name={record.fullName} secondary={record.rollNumber} />,
    },
    { title: 'Department', dataIndex: 'department' },
    {
      title: 'CGPA',
      dataIndex: 'cgpa',
      align: 'right',
      sorter: (a, b) => (a.cgpa ?? 0) - (b.cgpa ?? 0),
      render: (v) => <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{v}</span>,
    },
    {
      title: 'Backlogs',
      dataIndex: 'backlogs',
      align: 'right',
      sorter: (a, b) => (a.backlogs ?? 0) - (b.backlogs ?? 0),
      render: (v) => <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{v ?? 0}</span>,
    },
    { title: 'Email', dataIndex: 'email' },
  ];

  return (
    <div>
      <BackButton />
      <PageHeader title="Students" subtitle="All registered students across departments" />
      <Table rowKey="id" columns={columns} dataSource={students} />
    </div>
  );
}
