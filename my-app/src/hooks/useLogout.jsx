
import { useAuthContext } from './useAuthContext'
// { useWorkoutsContext } from './useWorkoutsContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  //const { dispatch: dispatchWorkouts } = useWorkoutsContext()

  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })
    //dispatchWorkouts({ type: 'SET_WORKOUTS', payload: null })
  }

  return { logout }
}

