import { useEffect, useState } from 'react';
import { Table, Tag, Typography } from 'antd';
import { listAuditLogs } from '../../api/auditLogs';

export default function AuditLogView() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    listAuditLogs().then(setLogs).catch(() => {});
  }, []);

  const columns = [
    { title: 'Timestamp', dataIndex: 'timestamp', render: (v) => new Date(v).toLocaleString() },
    { title: 'Actor', dataIndex: 'actorEmail' },
    { title: 'Role', dataIndex: 'actorRole', render: (r) => <Tag>{r}</Tag> },
    { title: 'Action', dataIndex: 'action' },
    { title: 'Entity', render: (_, r) => `${r.entityType} #${r.entityId}` },
    { title: 'Details', dataIndex: 'details' },
  ];

  return (
    <div>
      <Typography.Title level={3}>Audit Log</Typography.Title>
      <Table rowKey="id" columns={columns} dataSource={logs} />
    </div>
  );
}
