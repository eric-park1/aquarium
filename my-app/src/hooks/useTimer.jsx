import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useTimer = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const session = async (duration, marineType, success) => {
    console.log("Session function called with:", { duration, marineType, success });
  
    try {
      setIsLoading(true);
      setError(null);
  
      let email = null;
      let currency = 0;
  
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          currency = parsedUser.currency || 0;
          email = parsedUser.email || null;
        } catch (error) {
          console.error("Error parsing user data from localStorage", error);
          setError("Error loading user data.");
          setIsLoading(false);
          return;
        }
      }
  
      if (!email) {
        console.error("Email is missing.");
        setError("User email is missing. Please log in again.");
        setIsLoading(false);
        return;
      }
  
      console.log("Duration before session creation:", duration);
  
      const sessionResponse = await fetch('/api/userActions/createSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, duration, marineType, success }),
      });
  
      if (!sessionResponse.ok) {
        const json = await sessionResponse.json();
        console.error("Failed to create session:", json.error);
        setError(json.error || "Failed to create session");
        setIsLoading(false);
        return;
      }
  
      console.log("Session created successfully. Adjusting currency...");
      duration = Number(duration); 
      console.log("Numeric duration:", duration);
  
      if (duration >= 2) {
        currency += 2000;
      } else if (duration >= 1) {
        currency += 1000;
      }
  
      console.log("Currency after adjustment:", currency);
  
      const currencyResponse = await fetch('/api/userActions/updateCurrency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, currency }),
      });
  
      if (!currencyResponse.ok) {
        const json = await currencyResponse.json();
        console.error("Failed to update currency:", json.error);
        setError(json.error || "Failed to update currency");
        setIsLoading(false);
        return;
      }
  
      const currencyResult = await currencyResponse.json();
      console.log("Currency update result:", currencyResult.message);
  
      const updatedUser = { ...JSON.parse(storedUser), currency };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
  
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Unexpected error in session function:", error);
      setError("Unexpected error occurred.");
      setIsLoading(false);
      return false;
    }
  };  

  return { session, isLoading, error };
};
