import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import SideBar from '../../components/SideBar'
import { createWashroom, deleteWashroom, getAllWashrooms, updateWashroom } from '../../service/dashboardService'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

const Washroom = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [washrooms, setWashrooms] = useState([])
  const [formData, setFormData] = useState({ name: '', floor: '' })
  const [error, setError] = useState(null)
  const [editingWashroom, setEditingWashroom] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchWashroomsData()
  }, [])

  const handleOpenAddModal = () => {
    setEditingWashroom(null)
    setFormData({ name: '', floor: '' })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (washroom) => {
    setEditingWashroom(washroom)
    setFormData({ name: washroom.name, floor: washroom.floor })
    setIsModalOpen(true)
  }

  const fetchWashroomsData = async () => {
    try {
      const response = await getAllWashrooms()
      setWashrooms(response.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  const handleAddWashroom = async () => {
    const { name, floor } = formData
    if (!name || !floor) {
      setError('Missing required fields.')
      toast.error('Missing fields')
      return
    }
    try {
      await createWashroom(name, floor)
      toast.success('Washroom successfully created')
      fetchWashroomsData()
      setIsModalOpen(false)
      setFormData({ name: '', floor: '' })
      setError(null)
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong. Please try again.'
      setError(msg)
      toast.error(msg)
    }
  }

  const handleUpdateWashroom = async () => {
    const { name, floor } = formData
    if (!name || !floor) {
      setError('Missing required fields.')
      toast.error('Missing fields')
      return
    }
    try {
      await updateWashroom(name, floor, editingWashroom.id)
      toast.success('Washroom successfully updated')
      fetchWashroomsData()
      setIsModalOpen(false)
      setFormData({ name: '', floor: '' })
      setError(null)
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong. Please try again.'
      setError(msg)
      toast.error(msg)
    }
  }

  const handleDeleteWashroom = async (id) => {
    if (window.confirm('Are you sure you want to delete this washroom?')) {
      try {
        await deleteWashroom(id)
        toast.success('Washroom successfully deleted')
        fetchWashroomsData()
      } catch (error) {
        const msg = error.response?.data?.message || 'Something went wrong. Please try again.'
        setError(msg)
        toast.error(msg)
      }
    }
  }

  const handleSubmit = () => {
    if (editingWashroom) {
      handleUpdateWashroom()
    } else {
      handleAddWashroom()
    }
  }

  const filteredWashroom = washrooms.filter(washroom =>
    washroom.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <SideBar>
      <div className='p-8 max-w-6xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Washrooms</h1>
          <p className='text-sm text-slate-500 mt-1'>Manage washroom locations and floors</p>
        </div>

        <div className='flex items-center justify-between gap-4 mb-6'>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search by name...'
            className='flex-1 border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition'
          />
          <button
            onClick={handleOpenAddModal}
            className='inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0'
          >
            <Plus className='h-4 w-4 mr-1.5' />
            Add Washroom
          </button>
        </div>

        {error && <p className='mb-4 text-red-500 text-sm font-medium'>{error}</p>}

        <div className='bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-slate-100 bg-slate-50'>
                <th className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400'>Name</th>
                <th className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400'>Floor</th>
                <th className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {filteredWashroom.length === 0 ? (
                <tr>
                  <td colSpan='3' className='px-5 py-8 text-center text-slate-400 text-sm'>
                    {searchTerm ? `No washrooms matching "${searchTerm}"` : 'No washrooms available.'}
                  </td>
                </tr>
              ) : (
                filteredWashroom.map((washroom) => (
                  <tr key={washroom.id} className='hover:bg-slate-50'>
                    <td className='px-5 py-3.5 text-slate-700 font-medium'>{washroom.name}</td>
                    <td className='px-5 py-3.5 text-slate-700'>{washroom.floor}</td>
                    <td className='px-5 py-3.5'>
                      <div className='flex items-center gap-3'>
                        <button
                          onClick={() => handleOpenEditModal(washroom)}
                          className='text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteWashroom(washroom.id)}
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
        title={editingWashroom ? 'Edit Washroom' : 'Add Washroom'}
      >
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1.5'>Name</label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className='w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition'
              placeholder='Floor 1 Washroom A'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1.5'>Floor</label>
            <input
              type='text'
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              className='w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition'
              placeholder='Floor 1'
            />
          </div>

          {error && <p className='text-red-500 text-xs font-medium'>{error}</p>}

          <div className='flex gap-3 pt-1'>
            <button
              onClick={handleSubmit}
              className='flex-1 bg-slate-900 text-white text-sm font-semibold rounded-xl py-2.5 hover:bg-slate-800 transition-colors'
            >
              {editingWashroom ? 'Update' : 'Add'}
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

export default Washroom
