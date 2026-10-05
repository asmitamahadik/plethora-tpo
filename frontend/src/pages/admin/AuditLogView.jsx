import { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { listAuditLogs } from '../../api/auditLogs';
import BackButton from '../../components/BackButton';
import PageHeader from '../../components/PageHeader';

export default function AuditLogView() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    listAuditLogs().then(setLogs).catch(() => {});
  }, []);

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      render: (v) => new Date(v).toLocaleString(),
    },
    { title: 'Actor', dataIndex: 'actorEmail' },
    { title: 'Role', dataIndex: 'actorRole', render: (r) => <Tag>{r}</Tag> },
    { title: 'Action', dataIndex: 'action' },
    { title: 'Entity', render: (_, r) => `${r.entityType} #${r.entityId}` },
    { title: 'Details', dataIndex: 'details' },
  ];

  return (
    <div>
      <BackButton />
      <PageHeader title="Audit Log" subtitle="Every admin action across the platform" />
      <Table rowKey="id" columns={columns} dataSource={logs} />
    </div>
  );
}
