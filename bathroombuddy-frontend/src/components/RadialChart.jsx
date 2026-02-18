const RadialChart = ({ title, data, color, maxLimit }) => {
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const percentage = maxLimit > 0 ? (data / maxLimit) * 100 : 0
  const strokeDashoffset = circumference - (circumference * percentage) / 100

  return (
    <div className='bg-white border border-slate-100 rounded-2xl p-6 shadow-sm'>
      <p className='text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4 text-center'>
        {title}
      </p>
      <div className='flex items-center justify-center'>
        <div className='relative'>
          <svg className='w-32 h-32 -rotate-90'>
            <circle cx='64' cy='64' r={radius} stroke='#f1f5f9' strokeWidth='8' fill='none' />
            <circle
              cx='64' cy='64' r={radius}
              stroke={color}
              strokeWidth='8'
              fill='none'
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap='round'
            />
          </svg>
          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <span className='text-3xl font-bold text-slate-900'>{data}</span>
            <span className='text-xs text-slate-400'>Total</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RadialChart
