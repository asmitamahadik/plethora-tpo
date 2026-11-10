import client from './client';

export const registerStudent = (payload) => client.post('/auth/register/student', payload).then((r) => r.data);
export const registerTpo = (payload) => client.post('/auth/register/tpo', payload).then((r) => r.data);
export const login = (payload) => client.post('/auth/login', payload).then((r) => r.data);
