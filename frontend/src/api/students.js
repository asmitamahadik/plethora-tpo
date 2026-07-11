import client from './client';

export const getMyStudentProfile = () => client.get('/students/me').then((r) => r.data);
export const updateMyStudentProfile = (payload) => client.put('/students/me', payload).then((r) => r.data);
export const listStudents = () => client.get('/students').then((r) => r.data);
