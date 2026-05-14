import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { getMe } from '../api/auth'
import { useAuthStore } from '../stores/authStore'

type ProtectedRouteProps = {
  children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token)
  const setSession = useAuthStore((state) => state.setSession)
  const clearSession = useAuthStore((state) => state.clearSession)
  const [isChecking, setIsChecking] = useState(true)
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (!token) {
      setIsAllowed(false)
      setIsChecking(false)
      return () => { cancelled = true }
    }

    setIsChecking(true)

    getMe()
      .then((user) => {
        if (cancelled) return
        setSession(token, user)
        setIsAllowed(true)
      })
      .catch(() => {
        if (cancelled) return
        clearSession()
        setIsAllowed(false)
      })
      .finally(() => {
        if (!cancelled) setIsChecking(false)
      })

    return () => { cancelled = true }
  }, [token, setSession, clearSession])

  if (isChecking) {
    return null
  }

  if (!isAllowed) {
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
