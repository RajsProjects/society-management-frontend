import client from './client'

export const getAnnouncements = (params = {}) =>
  client.get('/announcements', { params }).then((r) => r.data)

export const getAnnouncement = (id) =>
  client.get(`/announcements/${id}`).then((r) => r.data)

export const createAnnouncement = (data) =>
  client.post('/announcements', data).then((r) => r.data)

export const updateAnnouncement = (id, data) =>
  client.put(`/announcements/${id}`, data).then((r) => r.data)

export const deleteAnnouncement = (id) =>
  client.delete(`/announcements/${id}`)
