import React from 'react'

const Modal = ({isOpen, onClose, title, children}) => {
    if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-gray-900/50 flex justify-center items-center'>
        <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-2xl font-bold text-gray-800'>{title}</h2>
                <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
                    Close
                </button>
            </div>
            {children}
        </div>
    </div>
  )
}

export default Modal