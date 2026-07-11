import client from './client';

export const registerStudent = (payload) => client.post('/auth/register/student', payload).then((r) => r.data);
export const registerCompany = (payload) => client.post('/auth/register/company', payload).then((r) => r.data);
export const registerTpo = (payload) => client.post('/auth/register/tpo', payload).then((r) => r.data);
export const registerHod = (payload) => client.post('/auth/register/hod', payload).then((r) => r.data);
export const login = (payload) => client.post('/auth/login', payload).then((r) => r.data);
