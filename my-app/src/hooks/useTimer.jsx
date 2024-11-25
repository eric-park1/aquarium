import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useTimer = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const timer = async (email, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('api/userActions/createSession', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ userID, duration, marineType })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      return true
    }
  }

  return { timer, isLoading, error }
}