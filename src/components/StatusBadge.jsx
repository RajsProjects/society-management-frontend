const STATUS_STYLES = {
  OPEN: 'bg-cool-blue/10 text-cool-blue',
  IN_PROGRESS: 'bg-amber-50 text-amber-700',
  RESOLVED: 'bg-cool-green/10 text-cool-green',
  REJECTED: 'bg-red-50 text-red-600',
  PENDING: 'bg-amber-50 text-amber-700',
  PAID: 'bg-cool-green/10 text-cool-green',
  OVERDUE: 'bg-red-50 text-red-600',
  ACTIVE: 'bg-cool-green/10 text-cool-green',
  INACTIVE: 'bg-charcoal-light/10 text-charcoal-light',
  BLOCKED: 'bg-red-50 text-red-600',
  LOW: 'bg-surface-muted text-charcoal-light',
  MEDIUM: 'bg-amber-50 text-amber-700',
  HIGH: 'bg-red-50 text-red-600',
  GENERAL: 'bg-cool-blue/10 text-cool-blue',
  MAINTENANCE: 'bg-cool-green/10 text-cool-green',
  EMERGENCY: 'bg-red-50 text-red-600',
  RESIDENT: 'bg-cool-blue/10 text-cool-blue',
  ADMIN: 'bg-navy/10 text-navy',
  SUPER_ADMIN: 'bg-navy/10 text-navy',
  PLUMBING: 'bg-cool-blue/10 text-cool-blue',
  ELECTRICAL: 'bg-amber-50 text-amber-700',
  SECURITY: 'bg-navy/10 text-navy',
  CLEANLINESS: 'bg-cool-green/10 text-cool-green',
  NOISE: 'bg-amber-50 text-amber-700',
  PARKING: 'bg-surface-muted text-charcoal-light',
  LIFT: 'bg-cool-blue/10 text-cool-blue',
  INTERNET: 'bg-cool-green/10 text-cool-green',
  OTHER: 'bg-surface-muted text-charcoal-light',
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-surface-muted text-charcoal-light'
  return (
    <span className={`badge ${style}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  )
}
