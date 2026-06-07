import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '../api/dashboard'
import QueryError from '../components/QueryError'
import LoadingSpinner from '../components/LoadingSpinner'

const STAT_CARDS = [
  { key: 'totalResidents', label: 'Total Residents', color: 'bg-cool-blue/10 text-cool-blue' },
  { key: 'pendingApprovals', label: 'Pending Approvals', color: 'bg-amber-50 text-amber-700' },
  { key: 'totalFlats', label: 'Total Flats', color: 'bg-cool-green/10 text-cool-green' },
  { key: 'occupiedFlats', label: 'Occupied Flats', color: 'bg-cool-green/10 text-cool-green' },
  { key: 'openComplaints', label: 'Open Complaints', color: 'bg-cool-blue/10 text-cool-blue' },
  { key: 'inProgressComplaints', label: 'In Progress', color: 'bg-amber-50 text-amber-700' },
  { key: 'resolvedComplaints', label: 'Resolved Complaints', color: 'bg-cool-green/10 text-cool-green' },
  { key: 'totalBills', label: 'Total Bills', color: 'bg-navy/5 text-navy' },
  { key: 'paidBills', label: 'Paid Bills', color: 'bg-cool-green/10 text-cool-green' },
  { key: 'overdueBills', label: 'Overdue Bills', color: 'bg-red-50 text-red-600' },
  { key: 'openIssues', label: 'Open Issues', color: 'bg-cool-blue/10 text-cool-blue' },
  { key: 'resolvedIssues', label: 'Resolved Issues', color: 'bg-cool-green/10 text-cool-green' },
]

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  })

  if (isLoading) return <LoadingSpinner />
  if (error) {
    return <QueryError error={error} />
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your society at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {STAT_CARDS.map(({ key, label, color }) => (
          <div key={key} className="card">
            <p className="text-sm font-medium text-charcoal-light">{label}</p>
            <p className={`mt-2 text-3xl font-bold ${color.split(' ').slice(1).join(' ')}`}>
              {data[key] ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
