import { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import { listCompanies } from '../../api/companies';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    listCompanies().then(setCompanies).catch(() => {});
  }, []);

  const columns = [
    { title: 'Company', dataIndex: 'companyName' },
    { title: 'Industry', dataIndex: 'industry' },
    { title: 'Contact person', dataIndex: 'contactPerson' },
    { title: 'Website', dataIndex: 'website' },
    { title: 'Email', dataIndex: 'email' },
  ];

  return (
    <div>
      <Typography.Title level={3}>Companies</Typography.Title>
      <Table rowKey="id" columns={columns} dataSource={companies} />
    </div>
  );
}
