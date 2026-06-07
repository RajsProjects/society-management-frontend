import client from './client'

export const login = (credentials) =>
  client.post('/auth/login', credentials).then((r) => r.data)

export const signup = (data) =>
  client.post('/auth/signup', data).then((r) => r.data)

export const registerSociety = (data) =>
  client.post('/societies/register', data).then((r) => r.data)
