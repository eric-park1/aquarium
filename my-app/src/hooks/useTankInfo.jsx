import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const getSessions = () =>{
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, [userId]);

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>User Profile</h1>
      <p>Email: {user.email}</p>
      <p>Total Focus Time: {user.totalFocusTime} minutes</p>
      <p>Fish Caught: {user.fishCaught}</p>
      {/* Render additional fields as needed */}
    </div>
  );
};

export default UserProfile;

}