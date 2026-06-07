import { createContext, useContext, useState, useCallback } from 'react'
import { login as loginApi } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [role, setRole] = useState(() => localStorage.getItem('role'))

  const login = useCallback(async (credentials) => {
    const data = await loginApi(credentials)
    localStorage.setItem('token', data.token)
    localStorage.setItem('role', data.role)
    setToken(data.token)
    setRole(data.role)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setToken(null)
    setRole(null)
  }, [])

  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN'
  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ token, role, login, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
