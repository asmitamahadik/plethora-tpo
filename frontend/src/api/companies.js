import client from './client';

export const getMyCompanyProfile = () => client.get('/companies/me').then((r) => r.data);
export const updateMyCompanyProfile = (payload) => client.put('/companies/me', payload).then((r) => r.data);
export const listCompanies = () => client.get('/companies').then((r) => r.data);
