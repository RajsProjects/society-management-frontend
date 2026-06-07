import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getBills, createBill, payBill } from '../api/bills'
import { useAuth } from '../context/AuthContext'
import { useListQuery } from '../hooks/useListQuery'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import QueryError from '../components/QueryError'
import Modal from '../components/Modal'
import { formatDate, formatCurrency, getErrorMessage } from '../utils/format'

export default function MaintenancePage() {
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [showPay, setShowPay] = useState(null)
  const [error, setError] = useState('')

  const { items: bills, meta, isLoading, isError, error: fetchError, refetch } = useListQuery({
    queryKey: ['bills', statusFilter],
    queryFn: getBills,
    params: statusFilter ? { status: statusFilter } : {},
  })

  const createMutation = useMutation({
    mutationFn: createBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] })
      setShowCreate(false)
      setError('')
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  const payMutation = useMutation({
    mutationFn: ({ id, data }) => payBill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] })
      setShowPay(null)
      setError('')
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Maintenance</h1>
          <p className="page-subtitle">
            View and manage maintenance bills
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
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
          {isAdmin && (
            <button className="btn-primary" onClick={() => setShowCreate(true)}>
              Create Bill
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
      ) : bills.length === 0 ? (
        <EmptyState title="No bills found" description="Maintenance bills will appear here." />
      ) : (
        <div className="space-y-3">
          {bills.map((bill) => (
            <div key={bill.id} className="card flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-navy">{bill.apartmentNumber}</h3>
                  <StatusBadge status={bill.status} />
                </div>
                <p className="mt-1 text-sm text-charcoal-light">
                  {bill.billingMonth} · Due {formatDate(bill.dueDate)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-navy">{formatCurrency(bill.amount)}</span>
                {!isAdmin && bill.status === 'PENDING' && (
                  <button className="btn-primary" onClick={() => setShowPay(bill)}>
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateBillModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={(form) => createMutation.mutate(form)}
        loading={createMutation.isPending}
      />

      <PayBillModal
        bill={showPay}
        onClose={() => setShowPay(null)}
        onSubmit={(form) => payMutation.mutate({ id: showPay.id, data: form })}
        loading={payMutation.isPending}
      />
    </div>
  )
}

function CreateBillModal({ open, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    userId: '',
    apartmentNumber: '',
    amount: '',
    billingMonth: '',
    dueDate: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...form, amount: parseFloat(form.amount) })
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Maintenance Bill">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Resident User ID</label>
          <input className="input" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required />
        </div>
        <div>
          <label className="label">Apartment Number</label>
          <input className="input" value={form.apartmentNumber} onChange={(e) => setForm({ ...form, apartmentNumber: e.target.value })} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Amount</label>
            <input type="number" step="0.01" className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </div>
          <div>
            <label className="label">Billing Month</label>
            <input type="month" className="input" value={form.billingMonth} onChange={(e) => setForm({ ...form, billingMonth: e.target.value })} required />
          </div>
        </div>
        <div>
          <label className="label">Due Date</label>
          <input type="date" className="input" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Bill'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function PayBillModal({ bill, onClose, onSubmit, loading }) {
  const [upiTransactionId, setUpiTransactionId] = useState('')

  if (!bill) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ upiTransactionId, amount: bill.amount })
  }

  return (
    <Modal open={!!bill} onClose={onClose} title="Pay Maintenance Bill">
      <p className="mb-4 text-sm text-charcoal-light">
        Paying {formatCurrency(bill.amount)} for {bill.apartmentNumber} ({bill.billingMonth})
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">UPI Transaction ID</label>
          <input className="input" value={upiTransactionId} onChange={(e) => setUpiTransactionId(e.target.value)} required />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
