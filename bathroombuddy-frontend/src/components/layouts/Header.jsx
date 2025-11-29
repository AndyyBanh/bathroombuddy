import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate();
  return (
    <header className='fixed z-50 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32'>
        <h1 className='font-bold text-2xl tracking-wider'>
            Bathroom Buddy
        </h1>

        <button 
            className='flex items-center bg-blue-600 rounded-lg text-white hover:bg-blue-700 px-2.5 py-2  transition-colors'
            onClick={() => navigate('/login')}
            >
            Admin Login/Signup
        </button>

    </header>
  )
}

export default Header