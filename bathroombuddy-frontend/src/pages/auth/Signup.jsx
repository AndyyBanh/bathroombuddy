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
      <div className='h-screen max-w-full flex items-center justify-center'>
            <div className='text-center space-y-2'>
               <h1 className='text-3xl font-bold'>Bathroom Buddy</h1>
               <p className='text-sm text-gray-500'>Join us!</p>
               <div className='w-sm h-auto border rounded-lg shadow-2xl p-5'>
                  <form 
                    onSubmit={handleSignup}
                    className='flex flex-col space-y-1.5'
                    >

                    <p className='text-left'>Username</p>
                    <input
                      value={username}
                      onChange={({ target }) => setUsername(target.value)}
                      className='border rounded-lg  p-2 focus:outline-none focus:ring-1' 
                      type='text'
                      placeholder='johndoe'
                    >
                    </input>

                    <p className='text-left'>Email</p>
                    <input
                      value={email}
                      onChange={({ target }) => setEmail(target.value)}
                      className='border rounded-lg  p-2 focus:outline-none focus:ring-1' 
                      type='text'
                      placeholder='johndoe@hotmail.com'
                    >
                    </input>
    
                    <p className='text-left'>Password</p>
                    <input
                      value={password}
                      onChange={({ target }) => setPassword(target.value)}
                      className='border rounded-lg  p-2 focus:outline-none focus:ring-1'
                      type='password'
                      placeholder='password'
                    >
                    </input>

                    <p className='text-left'>Confirm Password</p>
                    <input
                      value={confirmPassword}
                      onChange={({ target }) => setConfirmPassword(target.value)}
                      className='border rounded-lg  p-2 focus:outline-none focus:ring-1'
                      type='password'
                      placeholder='password'
                    >
                    </input>
    
                    <p className='flex flex-col text-sm mt-2'>
                      Already have an account?
                      <Link className='hover:underline hover:text-blue-500' to='/login'>
                        Login
                      </Link>
                    </p>

                    {error && <p className='text-red-500'>{error}</p>}
    
                    <button 
                      className='mt-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition border shadow-2xl hover:scale-90'
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