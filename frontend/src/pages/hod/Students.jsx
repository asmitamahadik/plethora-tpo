import { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import { listDepartmentStudents } from '../../api/hods';

export default function HodStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    listDepartmentStudents().then(setStudents).catch(() => {});
  }, []);

  const columns = [
    { title: 'Name', dataIndex: 'fullName' },
    { title: 'Roll number', dataIndex: 'rollNumber' },
    { title: 'Department', dataIndex: 'department' },
    { title: 'CGPA', dataIndex: 'cgpa' },
    { title: 'Backlogs', dataIndex: 'backlogs' },
    { title: 'Email', dataIndex: 'email' },
  ];

  return (
    <div>
      <Typography.Title level={3}>Students</Typography.Title>
      <Table rowKey="id" columns={columns} dataSource={students} />
    </div>
  );
}
