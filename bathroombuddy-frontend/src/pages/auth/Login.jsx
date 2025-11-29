import React, { useState,useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper';
import { login } from '../../service/authService';
import { UserContext } from '../../context/userContext';
import toast from 'react-hot-toast';

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
      toast.error('Invalid email');
      return;
    }

    if (!password) {
      setError('Please enter the password');
      toast.error('Invalid password');
      return;
    }
    setError('');

    try {
      const response = await login(email, password);

      const { token, user } = response.data;

      if (token) {
        toast.success('Login success');
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
    <div>
      <button 
        className='fixed font-bold text-2xl tracking-wide py-3 px-4 sm:px-20 xl:px-32'
        onClick={() => navigate('/home')}
      >
        Bathroom Buddy
      </button>
    
      <div className='h-screen max-w-full flex items-center justify-center'>
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold tracking-wide'>Bathroom Buddy</h1>
            <p className='text-sm text-gray-600'>Weclome back!</p>
            <div className='w-sm h-auto border rounded-lg shadow-2xl p-5'>
                <form 
                  className='flex flex-col space-y-1.5'
                  onSubmit={handleLogin}
                  >
                
                  <p className='text-left'>Email</p>
                  <input
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                    className='border rounded-lg p-2 focus:outline-none focus:ring-1' 
                    type='text'
                    placeholder='johndoe@hotmail.com'
                  >
                  </input>

                  <p className='text-left'>Password</p>
                  <input
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    className='border p-2 rounded-lg focus:outline-none focus:ring-1'
                    type='password'
                    placeholder='password'
                  >
                  </input>

                  <p className='flex flex-col text-sm mt-2'>
                    Don't have an account?
                    <Link className='hover:underline hover:text-blue-500' to='/signup'>
                      Signup
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
    </div>
  )
}

export default Login

