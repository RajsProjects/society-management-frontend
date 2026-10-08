export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse rounded bg-cool-blue/10 ${className}`} />
  )
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="card space-y-3">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-8 w-1/3" />
        </div>
      ))}
    </div>
  )
}

export function AnnouncementSkeleton() {
  return (
    <div className="card space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  )
}

export function AnnouncementsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <AnnouncementSkeleton key={i} />
      ))}
    </div>
  )
}

export function ComplaintsSkeleton({ isAdmin = false }) {
  return (
    <div className="space-y-6">
      {isAdmin && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card py-3 text-center space-y-2">
              <Skeleton className="mx-auto h-3 w-1/2" />
              <Skeleton className="mx-auto h-6 w-1/3" />
            </div>
          ))}
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function IssuesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-3 w-1/4" />
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function MaintenanceSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function UsersSkeleton() {
  return (
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
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className="border-b border-cool-blue/5 last:border-0">
              <td className="px-4 py-3.5"><Skeleton className="h-4 w-28" /></td>
              <td className="px-4 py-3.5"><Skeleton className="h-4 w-36" /></td>
              <td className="px-4 py-3.5"><Skeleton className="h-4 w-12" /></td>
              <td className="px-4 py-3.5"><Skeleton className="h-5 w-16 rounded-full" /></td>
              <td className="px-4 py-3.5"><Skeleton className="h-5 w-16 rounded-full" /></td>
              <td className="px-4 py-3.5"><Skeleton className="h-4 w-20" /></td>
              <td className="px-4 py-3.5"><Skeleton className="h-8 w-16 rounded-lg" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
