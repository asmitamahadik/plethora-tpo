import client from './client';

export const createHod = (payload) => client.post('/admin/hods', payload).then((r) => r.data);
export const listHods = () => client.get('/admin/hods').then((r) => r.data);
export const listDepartmentStudents = () => client.get('/hod/dashboard/students').then((r) => r.data);
export const listDepartmentDrives = () => client.get('/hod/dashboard/drives').then((r) => r.data);
export const departmentApplicantsForDrive = (driveId) => client.get(`/hod/drives/${driveId}/applicants`).then((r) => r.data);
