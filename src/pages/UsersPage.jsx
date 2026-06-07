import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, updateUserStatus } from '../api/users'
import { useListQuery } from '../hooks/useListQuery'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import QueryError from '../components/QueryError'
import { formatDate, getErrorMessage } from '../utils/format'

export default function UsersPage() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [error, setError] = useState('')

  const { items: users, meta, isLoading, isError, error: fetchError, refetch } = useListQuery({
    queryKey: ['users', statusFilter],
    queryFn: getUsers,
    params: statusFilter ? { status: statusFilter } : {},
  })

  const updateMutation = useMutation({
    mutationFn: ({ userId, status }) => updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setError('')
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Residents</h1>
          <p className="page-subtitle">
            Manage resident accounts and approvals
            {meta.totalElements > 0 && ` · ${meta.totalElements} total`}
          </p>
        </div>
        <select
          className="input w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="BLOCKED">Blocked</option>
        </select>
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
      ) : users.length === 0 ? (
        <EmptyState title="No residents found" description="Resident accounts will appear here." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-cool-blue/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-cool-blue/10 bg-surface-muted">
              <tr>
                <th className="px-4 py-3 font-bold text-navy">Name</th>
                <th className="px-4 py-3 font-bold text-navy">Email</th>
                <th className="px-4 py-3 font-bold text-navy">Apartment</th>
                <th className="px-4 py-3 font-bold text-navy">Role</th>
                <th className="px-4 py-3 font-bold text-navy">Status</th>
                <th className="px-4 py-3 font-bold text-navy">Joined</th>
                <th className="px-4 py-3 font-bold text-navy">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-cool-blue/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-charcoal">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-charcoal-light">{user.email}</td>
                  <td className="px-4 py-3 text-charcoal-light">{user.apartmentNumber || '—'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.role} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3 text-charcoal-light">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    {user.role !== 'ADMIN' && user.status === 'PENDING' && (
                      <button
                        className="btn-primary text-xs"
                        onClick={() => updateMutation.mutate({ userId: user.id, status: 'ACTIVE' })}
                      >
                        Approve
                      </button>
                    )}
                    {user.role !== 'ADMIN' && user.status === 'ACTIVE' && (
                      <button
                        className="btn-danger text-xs"
                        onClick={() => updateMutation.mutate({ userId: user.id, status: 'BLOCKED' })}
                      >
                        Block
                      </button>
                    )}
                    {user.role !== 'ADMIN' && user.status === 'BLOCKED' && (
                      <button
                        className="btn-secondary text-xs"
                        onClick={() => updateMutation.mutate({ userId: user.id, status: 'ACTIVE' })}
                      >
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
