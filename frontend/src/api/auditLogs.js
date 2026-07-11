import client from './client';

export const listAuditLogs = () => client.get('/audit-logs').then((r) => r.data);
