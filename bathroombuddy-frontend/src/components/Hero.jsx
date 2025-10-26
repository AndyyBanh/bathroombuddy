import React from 'react'

const Hero = () => {
  return (
    <div className='relative  h-screen w-screen pt-16'>
         <div className='relative z-10 flex items-center justify-center h-full w-full'>
            <div className='space-y-2 text-center'>
                <h1 className='text-3xl font-bold'>Bathroom Buddy</h1>
                <p className=''>Running out of tolietries?</p>
                <button className='border rounded-3xl px-2.5 py-1 transition hover:scale-90'>
                    Request
                </button>
            </div>
            
         </div>
         

    </div>
  )
}

export default Hero