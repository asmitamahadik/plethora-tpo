import client from './client';

export const listUsers = (params) => client.get('/admin/users', { params }).then((r) => r.data);
export const getUser = (id) => client.get(`/admin/users/${id}`).then((r) => r.data);
export const updateUser = (id, payload) => client.put(`/admin/users/${id}`, payload).then((r) => r.data);
export const deleteUser = (id) => client.delete(`/admin/users/${id}`).then((r) => r.data);
