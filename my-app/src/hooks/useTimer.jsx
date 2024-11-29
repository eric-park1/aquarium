import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useTimer = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const session = async (duration, marineType) => {
    setIsLoading(true)
    setError(null)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }

    const response = await fetch('api/userActions/createSession', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ storedUser, duration, marineType })
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

  return { session, isLoading, error }
}

