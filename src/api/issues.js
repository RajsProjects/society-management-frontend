import client from './client'

export const getIssues = (params = {}) =>
  client.get('/issues', { params }).then((r) => r.data)

export const createIssue = (data) =>
  client.post('/issues', data).then((r) => r.data)

export const updateIssueStatus = (id, status) =>
  client.patch(`/issues/${id}/status`, { status }).then((r) => r.data)

export const updateIssuePriority = (id, priority) =>
  client.patch(`/issues/${id}/priority`, { priority }).then((r) => r.data)

export const voteIssue = (id) =>
  client.post(`/issues/${id}/votes`)

export const unvoteIssue = (id) =>
  client.delete(`/issues/${id}/votes`)
