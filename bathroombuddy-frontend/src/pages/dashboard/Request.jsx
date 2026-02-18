import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import SideBar from '../../components/SideBar'
import { createRequest, deleteRequest, getAllRequests, getAllSupplies, getAllWashrooms, updateRequest } from '../../service/dashboardService'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

const statusStyles = {
  PENDING:     'bg-yellow-50 text-yellow-700 border border-yellow-200',
  IN_PROGRESS: 'bg-purple-50 text-purple-700 border border-purple-200',
  COMPLETED:   'bg-green-50 text-green-700 border border-green-200',
}

const Request = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [requests, setRequests] = useState([])
  const [formData, setFormData] = useState({ status: '', suppliesId: '', washroomId: '' })
  const [error, setError] = useState(null)
  const [editingRequest, setEditingRequest] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [supplies, setSupplies] = useState([])
  const [washrooms, setWashrooms] = useState([])

  useEffect(() => {
    fetchRequestData()
    fetchWashroomsData()
    fetchSuppliesData()
  }, [])

  const getSupplyName = (id) => {
    const supply = supplies.find(s => s.id === id)
    return supply ? supply.type : 'Unknown Supply Type.'
  }

  const getWashroomName = (id) => {
    const washroom = washrooms.find(w => w.id === id)
    return washroom ? washroom.name : 'Unknown Washroom Name.'
  }

  const handleOpenAddModal = () => {
    setEditingRequest(null)
    setFormData({ status: '', suppliesId: '', washroomId: '' })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (request) => {
    setEditingRequest(request)
    setFormData({
      status: request.status,
      suppliesId: request.suppliesId.toString(),
      washroomId: request.washroomId.toString(),
    })
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

  const fetchRequestData = async () => {
    try {
      const response = await getAllRequests()
      setRequests(response.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  const handleAddRequest = async () => {
    const { status, suppliesId, washroomId } = formData
    if (!status || !suppliesId || !washroomId) {
      setError('Missing required fields')
      toast.error('Missing fields')
      return
    }
    try {
      await createRequest(status, parseInt(suppliesId), parseInt(washroomId))
      toast.success('Request successfully created')
      fetchRequestData()
      setIsModalOpen(false)
      setFormData({ status: '', suppliesId: '', washroomId: '' })
      setError(null)
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong. Please try again.'
      setError(msg)
      toast.error(msg)
    }
  }

  const handleDeleteRequest = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await deleteRequest(id)
        toast.success('Request successfully deleted')
        fetchRequestData()
      } catch (error) {
        const msg = error.response?.data?.message || 'Something went wrong. Please try again.'
        setError(msg)
        toast.error(msg)
      }
    }
  }

  const handleUpdateRequest = async () => {
    const { status, suppliesId, washroomId } = formData
    if (!status || !suppliesId || !washroomId) {
      setError('Missing required fields')
      toast.error('Missing fields')
      return
    }
    try {
      await updateRequest(status, parseInt(suppliesId), parseInt(washroomId), editingRequest.id)
      toast.success('Request successfully updated')
      fetchRequestData()
      setIsModalOpen(false)
      setFormData({ status: '', suppliesId: '', washroomId: '' })
      setError(null)
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong. Please try again.'
      setError(msg)
      toast.error(msg)
    }
  }

  const handleSubmit = () => {
    if (editingRequest) {
      handleUpdateRequest()
    } else {
      handleAddRequest()
    }
  }

  const formatStatus = (status) => {
    if (status === 'PENDING') return 'Pending'
    if (status === 'IN_PROGRESS') return 'In Progress'
    if (status === 'COMPLETED') return 'Completed'
  }

  const filteredRequest = requests.filter(request =>
    request.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <SideBar>
      <div className='p-8 max-w-6xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Requests</h1>
          <p className='text-sm text-slate-500 mt-1'>Manage and track supply requests</p>
        </div>

        <div className='flex items-center justify-between gap-4 mb-6'>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search by status...'
            className='flex-1 border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition'
          />
          <button
            onClick={handleOpenAddModal}
            className='inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0'
          >
            <Plus className='h-4 w-4 mr-1.5' />
            Add Request
          </button>
        </div>

        {error && <p className='mb-4 text-red-500 text-sm font-medium'>{error}</p>}

        <div className='bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-slate-100 bg-slate-50'>
                <th className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400'>Status</th>
                <th className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400'>Supply</th>
                <th className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400'>Washroom</th>
                <th className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {filteredRequest.length === 0 ? (
                <tr>
                  <td colSpan='4' className='px-5 py-8 text-center text-slate-400 text-sm'>
                    {searchTerm ? `No requests matching "${searchTerm}"` : 'No requests available.'}
                  </td>
                </tr>
              ) : (
                filteredRequest.map((request) => (
                  <tr key={request.id} className='hover:bg-slate-50'>
                    <td className='px-5 py-3.5'>
                      <span className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusStyles[request.status]}`}>
                        {formatStatus(request.status)}
                      </span>
                    </td>
                    <td className='px-5 py-3.5 text-slate-700'>{getSupplyName(request.suppliesId)}</td>
                    <td className='px-5 py-3.5 text-slate-700'>{getWashroomName(request.washroomId)}</td>
                    <td className='px-5 py-3.5'>
                      <div className='flex items-center gap-3'>
                        <button
                          onClick={() => handleOpenEditModal(request)}
                          className='text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(request.id)}
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
        title={editingRequest ? 'Edit Request' : 'Add Request'}
      >
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1.5'>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className='w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition'
            >
              <option value=''>Select Status</option>
              <option value='PENDING'>Pending</option>
              <option value='IN_PROGRESS'>In Progress</option>
              <option value='COMPLETED'>Completed</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1.5'>Supply</label>
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
            <label className='block text-sm font-medium text-slate-700 mb-1.5'>Washroom</label>
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
              onClick={handleSubmit}
              className='flex-1 bg-slate-900 text-white text-sm font-semibold rounded-xl py-2.5 hover:bg-slate-800 transition-colors'
            >
              {editingRequest ? 'Update' : 'Add'}
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

export default Request
