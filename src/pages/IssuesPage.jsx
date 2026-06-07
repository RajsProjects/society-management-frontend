import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getIssues,
  createIssue,
  updateIssueStatus,
  updateIssuePriority,
  voteIssue,
  unvoteIssue,
} from '../api/issues'
import { useAuth } from '../context/AuthContext'
import { useListQuery } from '../hooks/useListQuery'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import QueryError from '../components/QueryError'
import Modal from '../components/Modal'
import { formatDate, getErrorMessage } from '../utils/format'

export default function IssuesPage() {
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [showCreate, setShowCreate] = useState(false)
  const [error, setError] = useState('')

  const { items: issues, meta, isLoading, isError, error: fetchError, refetch } = useListQuery({
    queryKey: ['issues', statusFilter, sortBy],
    queryFn: getIssues,
    params: {
      ...(statusFilter ? { status: statusFilter } : {}),
      sortBy,
      direction: 'desc',
    },
  })

  const createMutation = useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      setShowCreate(false)
      setError('')
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateIssueStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['issues'] }),
    onError: (err) => setError(getErrorMessage(err)),
  })

  const priorityMutation = useMutation({
    mutationFn: ({ id, priority }) => updateIssuePriority(id, priority),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['issues'] }),
    onError: (err) => setError(getErrorMessage(err)),
  })

  const voteMutation = useMutation({
    mutationFn: (id) => voteIssue(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['issues'] }),
    onError: (err) => setError(getErrorMessage(err)),
  })

  const unvoteMutation = useMutation({
    mutationFn: (id) => unvoteIssue(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['issues'] }),
    onError: (err) => setError(getErrorMessage(err)),
  })

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Issues</h1>
          <p className="page-subtitle">
            Community issues and voting
            {meta.totalElements > 0 && ` · ${meta.totalElements} total`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select className="input w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <select className="input w-auto" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Newest</option>
            <option value="voteCount">Most Voted</option>
          </select>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            Report Issue
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {isError ? (
        <QueryError error={fetchError} onRetry={refetch} />
      ) : isLoading ? (
        <LoadingSpinner />
      ) : issues.length === 0 ? (
        <EmptyState title="No issues reported" description="Report a community issue to get started." />
      ) : (
        <div className="space-y-3">
          {issues.map((item) => (
            <div key={item.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-navy">{item.title}</h3>
                    <StatusBadge status={item.status} />
                    <StatusBadge status={item.priority} />
                  </div>
                  <p className="mt-2 text-sm text-charcoal-light">{item.description}</p>
                  <p className="mt-2 text-xs text-charcoal-light/60">
                    {item.creator?.firstName} {item.creator?.lastName} · {formatDate(item.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-navy">{item.voteCount} votes</span>
                    <button className="btn-secondary text-xs" onClick={() => voteMutation.mutate(item.id)}>
                      Vote
                    </button>
                    <button className="btn-ghost text-xs" onClick={() => unvoteMutation.mutate(item.id)}>
                      Unvote
                    </button>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <select
                        className="input w-auto py-1 text-xs"
                        value={item.status}
                        onChange={(e) => statusMutation.mutate({ id: item.id, status: e.target.value })}
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                      <select
                        className="input w-auto py-1 text-xs"
                        value={item.priority}
                        onChange={(e) => priorityMutation.mutate({ id: item.id, priority: e.target.value })}
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateIssueModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={(form) => createMutation.mutate(form)}
        loading={createMutation.isPending}
      />
    </div>
  )
}

function CreateIssueModal({ open, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({ title: '', description: '', photoUrl: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Modal open={open} onClose={onClose} title="Report Issue">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-[100px] resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>
        <div>
          <label className="label">Photo URL (optional)</label>
          <input className="input" value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} placeholder="https://..." />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Issue'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
