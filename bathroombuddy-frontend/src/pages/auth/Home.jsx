import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../../components/layouts/Header'
import { createRequest, getAllSupplies, getAllWashrooms } from '../../service/dashboardService'
import Modal from '../../components/Modal'

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ suppliesId: '', washroomId: '' })
  const [error, setError] = useState(null)
  const [supplies, setSupplies] = useState([])
  const [washrooms, setWashrooms] = useState([])
  const [hasRecentRequest, setHasRecentRequest] = useState(false)

  useEffect(() => {
    if (isModalOpen) {
      fetchSuppliesData()
      fetchWashroomsData()
    }
  }, [isModalOpen])

  const handleOpenAddModal = () => {
    setFormData({ suppliesId: '', washroomId: '' })
    setIsModalOpen(true)
  }

  const fetchSuppliesData = async () => {
    try {
      const response = await getAllSupplies()
      setSupplies(response.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  const fetchWashroomsData = async () => {
    try {
      const response = await getAllWashrooms()
      setWashrooms(response.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  const handleAddRequest = async () => {
    const { suppliesId, washroomId } = formData
    if (!suppliesId || !washroomId) {
      setError('Missing required fields')
      toast.error('Missing required fields')
      return
    }
    try {
      await createRequest('PENDING', parseInt(suppliesId), parseInt(washroomId))
      const supplyName = supplies.find(s => s.id === parseInt(suppliesId))?.type || 'supply'
      const washroomName = washrooms.find(w => w.id === parseInt(washroomId))?.name || 'washroom'
      setIsModalOpen(false)
      setFormData({ suppliesId: '', washroomId: '' })
      setError(null)
      toast.success(`Request submitted! Delivering ${supplyName} to ${washroomName} shortly.`)
      setHasRecentRequest(true)
      setTimeout(() => setHasRecentRequest(false), 5000)
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error('Too many requests. Please try again in a few minutes.')
        setError('Too many requests. Please try again in a few minutes.')
      } else {
        const msg = error.response?.data?.message || 'Something went wrong. Please try again.'
        toast.error(msg)
        setError(msg)
      }
    }
  }

  return (
    <div className='min-h-screen h-screen w-full bg-[#FAFBFF] flex flex-col overflow-hidden font-sans text-slate-900'>
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
        <div className='absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl opacity-60 animate-pulse' />
        <div className='absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-60' />
      </div>

      <Header />

      <main className='relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='max-w-2xl space-y-8'
        >
          <div className='space-y-4'>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className='inline-flex items-center px-4 py-1.5 bg-blue-50 rounded-full text-blue-600 text-xs font-semibold uppercase tracking-wider mb-2'
            >
              Express Supply Requests
            </motion.div>

            <h1 className='text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-tight'>
              Running low? <br />
              <span className='text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600'>
                Let us help.
              </span>
            </h1>

            <p className='text-lg md:text-xl text-slate-500 max-w-lg mx-auto leading-relaxed'>
              Quickly request washroom supplies with just a few clicks. Minimal fuss, maximum hygiene.
            </p>
          </div>

          <div className='flex flex-col items-center gap-6'>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={handleOpenAddModal}
                className='inline-flex items-center h-16 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-lg shadow-xl shadow-slate-200 transition-colors group'
              >
                <Plus className='h-6 w-6 mr-2 transition-transform group-hover:rotate-90' />
                Make a Request
              </button>
            </motion.div>
          </div>
        </motion.div>

      
      </main>

      <footer className='relative z-10 w-full px-6 py-8 md:px-12 flex justify-center opacity-30'>
        <span className='text-xs uppercase tracking-[0.2em] font-medium text-slate-400'>
          Powered by Bathroom Buddy
        </span>
      </footer>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='Submit a Request'>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1.5'>Supply Needed</label>
            <select
              value={formData.suppliesId}
              onChange={(e) => setFormData({ ...formData, suppliesId: e.target.value })}
              className='w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition'
            >
              <option value=''>Select Supply</option>
              {supplies.map(supply => (
                <option key={supply.id} value={supply.id}>{supply.type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1.5'>Washroom Location</label>
            <select
              value={formData.washroomId}
              onChange={(e) => setFormData({ ...formData, washroomId: e.target.value })}
              className='w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition'
            >
              <option value=''>Select Washroom</option>
              {washrooms.map(washroom => (
                <option key={washroom.id} value={washroom.id}>{washroom.name}</option>
              ))}
            </select>
          </div>

          {error && <p className='text-red-500 text-xs font-medium'>{error}</p>}

          <div className='flex gap-3 pt-1'>
            <button
              onClick={handleAddRequest}
              className='flex-1 bg-slate-900 text-white text-sm font-semibold rounded-xl py-2.5 hover:bg-slate-800 active:scale-95 transition-all duration-150'
            >
              Submit Request
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className='flex-1 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl py-2.5 hover:bg-slate-200 active:scale-95 transition-all duration-150'
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Home
