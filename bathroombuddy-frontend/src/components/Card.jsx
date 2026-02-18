const Card = ({ title, data, text }) => {
  return (
    <div className='bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col'>
      <p className='text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3'>{title}</p>
      <div className='flex-1 flex flex-col justify-center'>
        <span className='text-4xl font-bold text-slate-900'>{data}</span>
        <span className='text-sm text-slate-400 mt-1'>Total</span>
      </div>
      <div className='mt-4 pt-4 border-t border-slate-100'>
        <p className='text-xs text-slate-400'>{text}</p>
      </div>
    </div>
  )
}

export default Card
