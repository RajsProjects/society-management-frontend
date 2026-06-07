import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-navy to-cool-blue p-12 lg:flex">
        <div>
          <h1 className="text-3xl font-bold text-white">CivicLink</h1>
          <p className="mt-2 text-cool-blue-light/80">Smart society management platform</p>
        </div>
        <div className="space-y-4">
          <p className="text-lg font-semibold text-white/90">
            Manage complaints, maintenance, announcements and more — all in one place.
          </p>
          <div className="flex gap-3">
            <div className="h-2 w-2 rounded-full bg-cool-green" />
            <div className="h-2 w-2 rounded-full bg-cool-green/60" />
            <div className="h-2 w-2 rounded-full bg-cool-green/30" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-surface px-6 py-12">
        <div className="mb-8 text-center lg:hidden">
          <h1 className="text-2xl font-bold text-navy">CivicLink</h1>
          <p className="text-sm text-charcoal-light">Society Management</p>
        </div>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
        <p className="mt-8 text-center text-xs text-charcoal-light">
          <Link to="/login" className="text-cool-blue hover:text-sea-hover">Login</Link>
          {' · '}
          <Link to="/signup" className="text-cool-blue hover:text-sea-hover">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}
