import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-60 px-4'
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl p-6 w-full max-w-md shadow-2xl'
          >
            <div className='flex justify-between items-center mb-5'>
              <h2 className='text-xl font-bold text-slate-900 tracking-tight'>{title}</h2>
              <button
                onClick={onClose}
                className='text-slate-400 hover:text-slate-700 rounded-lg p-1 hover:bg-slate-100 transition-colors duration-150'
              >
                <X size={20} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
