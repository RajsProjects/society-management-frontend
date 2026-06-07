import client from './client'

export const getComplaints = (params = {}) =>
  client.get('/complaints', { params }).then((r) => r.data)

export const getComplaint = (id) =>
  client.get(`/complaints/${id}`).then((r) => r.data)

export const createComplaint = (data) =>
  client.post('/complaints', data).then((r) => r.data)

export const updateComplaintStatus = (id, data) =>
  client.patch(`/complaints/${id}/status`, data).then((r) => r.data)

export const deleteComplaint = (id) =>
  client.delete(`/complaints/${id}`)

export const getComplaintStats = () =>
  client.get('/complaints/stats').then((r) => r.data)
