
import { useState } from "react"
import { useSignup } from "../../hooks/useSignup"
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {signup, error, isLoading} = useSignup()
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
        const success = await signup(email, password); // If successful, returns true or user data
  
        if (success) {
          navigate('/'); // Redirect to home page after successful login
        }
      } catch (err) {
        setError('Login failed. Please try again.');
      }
  }

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      
      <label>Email address:</label>
      <input 
        type="email" 
        onChange={(e) => setEmail(e.target.value)} 
        value={email} 
      />
      <label>Password:</label>
      <input 
        type="password" 
        onChange={(e) => setPassword(e.target.value)} 
        value={password} 
      />

      <button disabled={isLoading}>Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Signup
