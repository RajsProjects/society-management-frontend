import client from './client'

export const getBills = (params = {}) =>
  client.get('/finance/bills', { params }).then((r) => r.data)

export const createBill = (data) =>
  client.post('/finance/bills', data).then((r) => r.data)

export const payBill = (id, data) =>
  client.post(`/finance/bills/${id}/pay`, data).then((r) => r.data)
