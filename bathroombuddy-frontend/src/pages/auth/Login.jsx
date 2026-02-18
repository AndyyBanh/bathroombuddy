import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Package, LogIn } from 'lucide-react'
import { validateEmail } from '../../utils/helper'
import { login } from '../../service/authService'
import { UserContext } from '../../context/userContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError('Please enter a valid email')
      toast.error('Invalid email')
      return
    }
    if (!password) {
      setError('Please enter the password')
      toast.error('Invalid password')
      return
    }
    setError('')

    try {
      const response = await login(email, password)
      const { token, user } = response.data
      if (token) {
        toast.success('Login success')
        localStorage.setItem('token', token)
        updateUser(user)
        navigate('/dashboard')
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
        toast.error(error.response.data.message)
      } else {
        setError('Something went wrong. Please try again.')
        toast.error('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <div className='min-h-screen w-full bg-[#FAFBFF] flex flex-col overflow-hidden font-sans'>
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
        <div className='absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl opacity-60 animate-pulse' />
        <div className='absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-60' />
      </div>

      <div className='relative z-10 px-6 py-6 md:px-12'>
        <button
          onClick={() => navigate('/home')}
          className='flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors'
        >
          <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow shadow-blue-600/20'>
            <Package className='h-4 w-4 text-white' />
          </div>
          <span className='text-sm font-semibold text-slate-800'>Bathroom Buddy</span>
        </button>
      </div>

      <div className='relative z-10 flex-1 flex items-center justify-center px-4'>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='w-full max-w-md'
        >
          <div className='bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl p-8'>
            <div className='mb-6 text-center'>
              <div className='inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-2xl mb-3'>
                <LogIn className='h-6 w-6 text-blue-600' />
              </div>
              <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Welcome back</h1>
              <p className='text-sm text-slate-500 mt-1'>Sign in to your admin account</p>
            </div>

            <form onSubmit={handleLogin} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-1.5'>Email</label>
                <input
                  value={email}
                  onChange={({ target }) => setEmail(target.value)}
                  type='text'
                  placeholder='johndoe@hotmail.com'
                  className='w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-1.5'>Password</label>
                <input
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                  type='password'
                  placeholder='••••••••'
                  className='w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition'
                />
              </div>

              {error && <p className='text-red-500 text-xs font-medium'>{error}</p>}

              <button
                type='submit'
                className='w-full bg-slate-900 text-white text-sm font-semibold rounded-xl py-2.5 hover:bg-slate-800 active:scale-95 transition-all duration-150 mt-2'
              >
                Sign In
              </button>
            </form>

            <p className='text-center text-sm text-slate-500 mt-5'>
              Don't have an account?{' '}
              <Link to='/signup' className='text-blue-600 font-medium hover:underline'>
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
