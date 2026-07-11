import client from './client';

export const myNotifications = () => client.get('/notifications/me').then((r) => r.data);
export const markNotificationRead = (id) => client.put(`/notifications/${id}/read`).then((r) => r.data);
