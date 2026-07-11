import client from './client';

export const applyToDrive = (driveId) => client.post(`/drives/${driveId}/apply`).then((r) => r.data);
export const myApplications = () => client.get('/applications/me').then((r) => r.data);
export const applicationsForDrive = (driveId) => client.get(`/drives/${driveId}/applications`).then((r) => r.data);
export const updateApplicationStatus = (id, payload) => client.put(`/applications/${id}/status`, payload).then((r) => r.data);
export const updateInterviewStatus = (id, payload) => client.put(`/applications/${id}/interview-status`, payload).then((r) => r.data);
