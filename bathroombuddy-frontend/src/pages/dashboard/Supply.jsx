import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import SideBar from '../../components/SideBar'
import Modal from '../../components/Modal'
import { createSupply, deleteSupply, getAllSupplies, updateSupply } from '../../service/dashboardService'
import toast from 'react-hot-toast'

const Supply = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [supplies, setSupplies] = useState([])
  const [formData, setFormData] = useState({ type: '', quantity: '' })
  const [error, setError] = useState(null)
  const [editingSupply, setEditingSupply] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSuppliesData()
  }, [])

  const handleOpenAddModal = () => {
    setEditingSupply(null)
    setFormData({ type: '', quantity: '' })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (supply) => {
    setEditingSupply(supply)
    setFormData({ type: supply.type, quantity: supply.quantity.toString() })
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

  const handleAddSupply = async () => {
    const { type, quantity } = formData
    if (!type || !quantity) {
      setError('Missing required fields')
      toast.error('Missing fields')
      return
    }
    try {
      await createSupply(type, parseInt(quantity))
      toast.success('Supply successfully created')
      fetchSuppliesData()
      setIsModalOpen(false)
      setFormData({ type: '', quantity: '' })
      setError(null)
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong. Please try again.'
      setError(msg)
      toast.error(msg)
    }
  }

  const handleDeleteSupply = async (id) => {
    if (window.confirm('Are you sure you want to delete this supply?')) {
      try {
        await deleteSupply(id)
        toast.success('Supply successfully deleted')
        fetchSuppliesData()
      } catch (error) {
        const msg = error.response?.data?.message || 'Something went wrong. Please try again.'
        setError(msg)
        toast.error(msg)
      }
    }
  }

  const handleUpdateSupply = async () => {
    const { type, quantity } = formData
    if (!type || !quantity) {
      setError('Missing required fields')
      toast.error('Missing fields')
      return
    }
    try {
      await updateSupply(type, parseInt(quantity), editingSupply.id)
      toast.success('Supply successfully updated')
      fetchSuppliesData()
      setIsModalOpen(false)
      setFormData({ type: '', quantity: '' })
      setError(null)
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong. Please try again.'
      setError(msg)
      toast.error(msg)
    }
  }

  const handleSubmit = () => {
    if (editingSupply) {
      handleUpdateSupply()
    } else {
      handleAddSupply()
    }
  }

  const filteredSupplies = supplies.filter(supply =>
    supply.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <SideBar>
      <div className='p-8 max-w-6xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Supplies</h1>
          <p className='text-sm text-slate-500 mt-1'>Manage inventory and supply stock</p>
        </div>

        <div className='flex items-center justify-between gap-4 mb-6'>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search by type...'
            className='flex-1 border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition'
          />
          <button
            onClick={handleOpenAddModal}
            className='inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0'
          >
            <Plus className='h-4 w-4 mr-1.5' />
            Add Supply
          </button>
        </div>

        {error && <p className='mb-4 text-red-500 text-sm font-medium'>{error}</p>}

        <div className='bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-slate-100 bg-slate-50'>
                <th className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400'>Type</th>
                <th className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400'>Quantity</th>
                <th className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400'>Last Replenished</th>
                <th className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {filteredSupplies.length === 0 ? (
                <tr>
                  <td colSpan='4' className='px-5 py-8 text-center text-slate-400 text-sm'>
                    {searchTerm ? `No supplies matching "${searchTerm}"` : 'No supplies available.'}
                  </td>
                </tr>
              ) : (
                filteredSupplies.map((supply) => (
                  <tr key={supply.id} className='hover:bg-slate-50'>
                    <td className='px-5 py-3.5 text-slate-700 font-medium'>{supply.type}</td>
                    <td className='px-5 py-3.5 text-slate-700'>{supply.quantity}</td>
                    <td className='px-5 py-3.5 text-slate-500'>{supply.lastReplenished ?? '—'}</td>
                    <td className='px-5 py-3.5'>
                      <div className='flex items-center gap-3'>
                        <button
                          onClick={() => handleOpenEditModal(supply)}
                          className='text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSupply(supply.id)}
                          className='text-xs font-medium text-red-500 hover:text-red-700 transition-colors'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSupply ? 'Edit Supply' : 'Add Supply'}
      >
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1.5'>Type</label>
            <input
              type='text'
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className='w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition'
              placeholder='e.g. Toilet Paper'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1.5'>Quantity</label>
            <input
              type='number'
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className='w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition'
              placeholder='0'
            />
          </div>

          {error && <p className='text-red-500 text-xs font-medium'>{error}</p>}

          <div className='flex gap-3 pt-1'>
            <button
              onClick={handleSubmit}
              className='flex-1 bg-slate-900 text-white text-sm font-semibold rounded-xl py-2.5 hover:bg-slate-800 transition-colors'
            >
              {editingSupply ? 'Update' : 'Add'}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className='flex-1 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl py-2.5 hover:bg-slate-200 transition-colors'
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </SideBar>
  )
}

export default Supply
