import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Package, User } from 'lucide-react'

const Header = () => {
  const navigate = useNavigate()
  return (
    <header className='relative z-10 w-full px-6 py-8 md:px-12 flex items-center justify-between'>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className='flex items-center gap-2'
      >
        <div className='w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20'>
          <Package className='h-6 w-6 text-white' />
        </div>
        <span className='text-xl font-bold tracking-tight text-slate-800'>Bathroom Buddy</span>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <button
          onClick={() => navigate('/login')}
          className='flex items-center gap-2 rounded-full px-4 py-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium'
        >
          <User className='h-4 w-4' />
          <span className='hidden sm:inline'>Admin Login</span>
        </button>
      </motion.div>
    </header>
  )
}

export default Header
