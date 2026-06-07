import client from './client'

export const getUsers = (params = {}) =>
  client.get('/users', { params }).then((r) => r.data)

export const updateUserStatus = (userId, status) =>
  client.patch(`/users/${userId}/status`, { status }).then((r) => r.data)
