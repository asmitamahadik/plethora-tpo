import client from './client';

export const listDrives = () => client.get('/drives').then((r) => r.data);
export const listMyCompanyDrives = () => client.get('/drives/me').then((r) => r.data);
export const getDrive = (id) => client.get(`/drives/${id}`).then((r) => r.data);
export const createDrive = (payload) => client.post('/drives', payload).then((r) => r.data);
export const updateDrive = (id, payload) => client.put(`/drives/${id}`, payload).then((r) => r.data);
export const publishDrive = (id) => client.put(`/drives/${id}/publish`).then((r) => r.data);
export const closeDrive = (id) => client.put(`/drives/${id}/close`).then((r) => r.data);
export const deleteDrive = (id) => client.delete(`/drives/${id}`).then((r) => r.data);
