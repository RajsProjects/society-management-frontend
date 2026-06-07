import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getComplaints,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint,
  getComplaintStats,
} from '../api/complaints'
import { useAuth } from '../context/AuthContext'
import { useListQuery } from '../hooks/useListQuery'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import QueryError from '../components/QueryError'
import Modal from '../components/Modal'
import { formatDate, getErrorMessage } from '../utils/format'

const CATEGORIES = [
  'PLUMBING', 'ELECTRICAL', 'SECURITY', 'CLEANLINESS',
  'NOISE', 'PARKING', 'LIFT', 'INTERNET', 'OTHER',
]

export default function ComplaintsPage() {
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [updateTarget, setUpdateTarget] = useState(null)
  const [error, setError] = useState('')

  const { items: complaints, meta, isLoading, isError, error: fetchError, refetch } = useListQuery({
    queryKey: ['complaints', statusFilter],
    queryFn: getComplaints,
    params: statusFilter ? { status: statusFilter } : {},
  })

  const { data: stats } = useQuery({
    queryKey: ['complaint-stats'],
    queryFn: getComplaintStats,
    enabled: isAdmin,
    staleTime: 30_000,
  })

  const createMutation = useMutation({
    mutationFn: createComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
      queryClient.invalidateQueries({ queryKey: ['complaint-stats'] })
      setShowCreate(false)
      setError('')
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateComplaintStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
      queryClient.invalidateQueries({ queryKey: ['complaint-stats'] })
      setUpdateTarget(null)
      setError('')
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
      queryClient.invalidateQueries({ queryKey: ['complaint-stats'] })
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Complaints</h1>
          <p className="page-subtitle">
            Report and track society complaints
            {meta.totalElements > 0 && ` · ${meta.totalElements} total`}
          </p>
        </div>
        <div className="flex gap-2">
          <select
            className="input w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            New Complaint
          </button>
        </div>
      </div>

      {isAdmin && stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: 'Total', value: stats.total },
            { label: 'Open', value: stats.open },
            { label: 'In Progress', value: stats.inProgress },
            { label: 'Resolved', value: stats.resolved },
            { label: 'Rejected', value: stats.rejected },
          ].map(({ label, value }) => (
            <div key={label} className="card py-3 text-center">
              <p className="text-xs font-medium text-charcoal-light">{label}</p>
              <p className="text-xl font-bold text-navy">{value}</p>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {isError ? (
        <QueryError error={fetchError} onRetry={refetch} />
      ) : isLoading ? (
        <LoadingSpinner />
      ) : complaints.length === 0 ? (
        <EmptyState title="No complaints" description="File a complaint to get started." />
      ) : (
        <div className="space-y-3">
          {complaints.map((item) => (
            <div key={item.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-navy">{item.title}</h3>
                    <StatusBadge status={item.status} />
                    <StatusBadge status={item.category} />
                  </div>
                  <p className="mt-2 text-sm text-charcoal-light">{item.description}</p>
                  <p className="mt-2 text-xs text-charcoal-light/60">
                    {item.residentName} · {item.apartmentNumber} · {formatDate(item.createdAt)}
                  </p>
                  {item.adminNote && (
                    <p className="mt-2 rounded-lg bg-surface-muted px-3 py-2 text-xs text-charcoal-light">
                      Admin note: {item.adminNote}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  {isAdmin && (
                    <button className="btn-secondary" onClick={() => setUpdateTarget(item)}>
                      Update
                    </button>
                  )}
                  {item.status === 'OPEN' && (
                    <button
                      className="btn-danger"
                      onClick={() => deleteMutation.mutate(item.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateComplaintModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={(form) => createMutation.mutate(form)}
        loading={createMutation.isPending}
      />

      <UpdateStatusModal
        complaint={updateTarget}
        onClose={() => setUpdateTarget(null)}
        onSubmit={(form) => updateMutation.mutate({ id: updateTarget.id, data: form })}
        loading={updateMutation.isPending}
      />
    </div>
  )
}

function CreateComplaintModal({ open, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({ title: '', description: '', category: 'OTHER' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Modal open={open} onClose={onClose} title="New Complaint">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={100} required />
        </div>
        <div>
          <label className="label">Category</label>
          <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-[100px] resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={1000} required />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function UpdateStatusModal({ complaint, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({ status: 'IN_PROGRESS', adminNote: '' })

  if (!complaint) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Modal open={!!complaint} onClose={onClose} title="Update Complaint Status">
      <p className="mb-4 text-sm text-charcoal-light">{complaint.title}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div>
          <label className="label">Admin Note</label>
          <textarea className="input min-h-[80px] resize-y" value={form.adminNote} onChange={(e) => setForm({ ...form, adminNote: e.target.value })} />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
