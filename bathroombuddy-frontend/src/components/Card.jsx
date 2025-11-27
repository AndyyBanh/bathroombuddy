import React from 'react'
import { BiStats } from "react-icons/bi";
const Card = ({ title, data, text }) => {
  return (
    <div className='bg-white rounded-lg p-6 shadow-xl flex flex-col'>
        <h3 className='text-lg uppercase font-medium tracking-wide mb-4 text-center'>{title}</h3>
        <div className='flex flex-col items-center justify-center flex-1 py-8'>
            <span className='text-3xl font-bold'>{data}</span>
            <span className='text-sm text-gray-600'>Total</span>
        </div>

        <div className='flex items-center justify-center text-center mt-auto pt-4'>
            <p className='flex gap-2 text-sm text-gray-600 items-center'>
                {text} 
                <BiStats />
            </p>
        </div>
    </div>
  )
}

export default Card