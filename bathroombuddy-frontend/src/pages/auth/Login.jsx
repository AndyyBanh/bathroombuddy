import React, { useState,useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper';
import { login } from '../../service/authService';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    if (!password) {
      setError('Please enter the password');
      return;
    }
    setError('');

    try {
      const response = await login(email, password);

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }

  }
  return (
    <div className='h-screen flex items-center justify-center'>
        <div className='text-center space-y-2'>
           <h1 className='text-3xl font-bold'>Bathroom Buddy</h1>
           <p>Weclome back!</p>
           <div className='border p-5'>
              <form 
                className='flex flex-col space-y-1.5'
                onSubmit={handleLogin}
                >
              
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

                <p className='flex flex-col'>
                  Don't have an account?
                  <Link className='hover:underline' to='/signup'>
                    Signup
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

export default Login

