import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../api/announcements'
import { useAuth } from '../context/AuthContext'
import { useListQuery } from '../hooks/useListQuery'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import QueryError from '../components/QueryError'
import Modal from '../components/Modal'
import { formatDate, getErrorMessage } from '../utils/format'

export default function AnnouncementsPage() {
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [typeFilter, setTypeFilter] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [error, setError] = useState('')

  const { items: announcements, meta, isLoading, isError, error: fetchError, refetch } = useListQuery({
    queryKey: ['announcements', typeFilter],
    queryFn: getAnnouncements,
    params: typeFilter ? { type: typeFilter } : {},
  })

  const createMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      setShowCreate(false)
      setError('')
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
    onError: (err) => setError(getErrorMessage(err)),
  })

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Announcements</h1>
          <p className="page-subtitle">
            Society notices and updates
            {meta.totalElements > 0 && ` · ${meta.totalElements} total`}
          </p>
        </div>
        <div className="flex gap-2">
          <select
            className="input w-auto"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="GENERAL">General</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
          {isAdmin && (
            <button className="btn-primary" onClick={() => setShowCreate(true)}>
              New Announcement
            </button>
          )}
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
      ) : announcements.length === 0 ? (
        <EmptyState title="No announcements" description="Announcements from your society will appear here." />
      ) : (
        <div className="space-y-3">
          {announcements.map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-navy">{item.title}</h3>
                    <StatusBadge status={item.type} />
                  </div>
                  <p className="mt-2 text-sm text-charcoal-light leading-relaxed">{item.content}</p>
                  <p className="mt-3 text-xs text-charcoal-light/60">{formatDate(item.createdAt)}</p>
                </div>
                {isAdmin && (
                  <button
                    className="btn-danger shrink-0"
                    onClick={() => deleteMutation.mutate(item.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateAnnouncementModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={(form) => createMutation.mutate(form)}
        loading={createMutation.isPending}
      />
    </div>
  )
}

function CreateAnnouncementModal({ open, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({ title: '', content: '', type: 'GENERAL' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Modal open={open} onClose={onClose} title="New Announcement">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div>
          <label className="label">Type</label>
          <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="GENERAL">General</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
        </div>
        <div>
          <label className="label">Content</label>
          <textarea
            className="input min-h-[120px] resize-y"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
