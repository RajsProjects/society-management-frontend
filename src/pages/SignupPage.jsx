import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signup } from '../api/auth'
import { getErrorMessage } from '../utils/format'

export default function SignupPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    apartmentNumber: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const data = await signup(form)
      setSuccess(data.message || 'Registration successful. Pending admin approval.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-navy">Create account</h2>
      <p className="page-subtitle mb-6">Register as a society resident</p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg border border-cool-green/20 bg-cool-green/5 px-4 py-3 text-sm text-cool-green">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              className="input"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              className="input"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="apartment">Apartment Number</label>
          <input
            id="apartment"
            className="input"
            value={form.apartmentNumber}
            onChange={(e) => setForm({ ...form, apartmentNumber: e.target.value })}
            placeholder="A-101"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Min 8 chars, upper, lower, digit"
            required
            minLength={8}
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-charcoal-light">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-cool-blue hover:text-sea-hover">
          Sign in
        </Link>
      </p>
    </div>
  )
}
