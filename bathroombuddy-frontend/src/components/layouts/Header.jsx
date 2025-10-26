import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate();
  return (
    <header className='fixed z-50 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32'>
        <h1 className='font-bold text-2xl'>
            Bathroom Buddy
        </h1>

        <button 
            className='flex items-center border rounded-3xl px-2.5 py-2 text-sm transition hover:scale-90'
            onClick={() => navigate('/login')}
            >
            Admin Login/Signup
        </button>

    </header>
  )
}

export default Header