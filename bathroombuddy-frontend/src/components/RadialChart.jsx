import React from 'react'

const RadialChart = ({ title, data, color, maxLimit }) => {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;

  const percentage = (data / maxLimit) * 100;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;


  return (
    <div className='bg-white rounded-lg p-6 shadow-xl'>
      <h3 className='text-lg uppercase font-medium tracking-wide text-center mb-4'>
        {title}
      </h3>

      <div className='flex items-center justify-center mb-4'>
        <div className='relative'>
        
          <svg className='w-32 h-32 transform -rotate-90'>
            <circle
              cx='64'
              cy='64'
              r={radius}
              stroke='#e5e7eb'
              strokeWidth='8'
              fill='none'
            />
          
            <circle
              cx='64'
              cy='64'
              r={radius}
              stroke={color}
              strokeWidth='8'
              fill='none'
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap='round'
              className='transition-all duration-1000 ease-out'
            />
          </svg>

          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <span className='text-3xl font-bold'>{data}</span>
            <span className='text-sm text-gray-600'>Total</span>
          </div>
        </div>
         
      </div>
      
    </div>
  )
}

export default RadialChart;