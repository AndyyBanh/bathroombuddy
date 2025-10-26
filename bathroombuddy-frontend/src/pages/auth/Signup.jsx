import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper';
import { signup } from '../../service/authService';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
      e.preventDefault();

      if (!username) {
        setError('Please enter a username');
        return;
      }

      if (!validateEmail(email)) {
        setError('Please enter a valid email');
        return;
      }

      if (!password) {
        setError('Please enter a password');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      setError('');

      try {
        const response = await signup(email, password, username);
        navigate('/login');

      } catch (error) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Something went wrong. Please try again later.');
        }
      }
  }

  return (
      <div className='h-screen flex items-center justify-center'>
            <div className='text-center space-y-2'>
               <h1 className='text-3xl font-bold'>Bathroom Buddy</h1>
               <p>Join us!</p>
               <div className='border p-5'>
                  <form 
                    onSubmit={handleSignup}
                    className='flex flex-col space-y-1.5'
                    >

                    <p className='text-left'>Username</p>
                    <input
                      value={username}
                      onChange={({ target }) => setUsername(target.value)}
                      className='border p-1' 
                      type='text'
                      placeholder='johndoe'
                    >
                    </input>

                    <p className='text-left'>Email</p>
                    <input
                      value={email}
                      onChange={({ target }) => setEmail(target.value)}
                      className='border p-1' 
                      type='text'
                      placeholder='johndoe@hotmail.com'
                    >
                    </input>
    
                    <p className='text-left'>Password</p>
                    <input
                      value={password}
                      onChange={({ target }) => setPassword(target.value)}
                      className='border p-1'
                      type='password'
                      placeholder='password'
                    >
                    </input>

                    <p className='text-left'>Confirm Password</p>
                    <input
                      value={confirmPassword}
                      onChange={({ target }) => setConfirmPassword(target.value)}
                      className='border p-1'
                      type='password'
                      placeholder='password'
                    >
                    </input>
    
                    <p className='flex flex-col'>
                      Already have an account?
                      <Link className='hover:underline' to='/login'>
                        Login
                      </Link>
                    </p>

                    {error && <p className='text-red-500'>{error}</p>}
    
                    <button 
                      className='mt-2.5 border rounded-3xl transition hover:scale-90'
                      type='submit'  
                    >
                      Submit
                    </button>
                  </form>
               </div>
            </div>
        </div>
  )
}

export default Signup