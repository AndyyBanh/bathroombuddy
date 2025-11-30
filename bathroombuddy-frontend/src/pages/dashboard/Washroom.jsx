import React, { useEffect, useState } from 'react'
import SideBar from '../../components/SideBar'
import { createWashroom, deleteWashroom, getAllWashrooms, updateWashroom } from '../../service/dashboardService';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';

const Washroom = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [washrooms, setWashrooms] = useState([]);
  const [formData, setFormData] = useState({ name: '', floor: '' });
  const [error, setError] = useState(null);
  const [editingWashroom, setEditingWashroom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWashroomsData();
  }, []);
  
  const handleOpenAddModal = () => {
    setEditingWashroom(null);
    setFormData({ name: '', floor: '' });
    setIsModalOpen(true);
  }

  const handleOpenEditModal = (washroom) => {
    setEditingWashroom(washroom);
    setFormData({ name: '', floor: '' });
    setIsModalOpen(true);
  }

  // Api functions
  const fetchWashroomsData = async () => {
    try {
      const response = await getAllWashrooms();
      setWashrooms(response.data);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong please try again.')
      }
    }
  };

  const handleAddWashroom = async () => {
    const { name, floor } = formData;

    if (!name || !floor) {
        setError('Missing required fields.');
        toast.error('Missing fields');
        return;
    }

    try {
      const response  = await createWashroom(name, floor);
      toast.success('Washroom successfully created');
      fetchWashroomsData();
      setIsModalOpen(false);
      setFormData({ name: '', floor: '' });
      setError(null); 
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setError('Something went wrong please try again.');
        toast.error('Something went wrong plese try again');
      }
    }
  };

  const handleUpdateWashroom = async () => {
    const { name, floor } = formData;

    if (!name || !floor) {
        setError('Missing required fields.');
        toast.error('Missing fields');
        return;
    }

    try {
      const response = await updateWashroom(name, floor, editingWashroom.id);
      toast.success('Washroom successfully updated');
      fetchWashroomsData();
      setIsModalOpen(false);
      setFormData({ name: '', floor: '' });
      setError(null);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setError('Something went wrong please try again.');
        toast.error('Something went wrong plese try again');
      }
    }
  };

  const handleDeleteWashroom = async (id) => {

    if (window.confirm('Are you sure you want to delete this washroom?')) {
      try {
        await deleteWashroom(id);
        toast.success('Washroom successfully deleted');
        fetchWashroomsData();
      } catch (error) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
          toast.error(error.response.data.message);
        } else {
          setError('Something went wrong please try again');
          toast.error('Something went wrong plese try again');
        }
      }
    }
    
  };

  const handleSubmit = () => {
    if (editingWashroom) {
      handleUpdateWashroom();
    } else {
      handleAddWashroom();
    }
  };

  const filteredWashroom = washrooms.filter(washroom =>
    washroom.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <SideBar>
        <div className='p-8 max-w-6xl mx-auto'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-3xl font-bold text-gray-800'>Washrooms Management</h1>
            <button
              onClick={handleOpenAddModal}
              className='flex items-center bg-blue-600 px-4 py-2 rounded-xl text-white hover:bg-blue-700 transition-colors'
            >
              Add Washroom
            </button>
          </div>

          <div className='mb-4'>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search washroom by name...'
              className='border rounded-lg px-2 py-1.5 w-full'
            />  
          </div>

          {error && (
            <div className='mb-4 text-red-600 font-bold'>
              {error}
            </div>
          )}

          <div className='bg-white rounded-lg shadow-2xl overflow-hidden'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  <th className='px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wide'>Name</th>
                  <th className='px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wide'>Floor</th>
                  <th className='px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wide'>Actions</th>
                </tr>
              </thead>

              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredWashroom.length === 0 ? (
                  <tr>
                    <td colSpan='3' className='px=6 py-4 text-center'>{searchTerm ? `No Washroom found matching "${searchTerm}"` : 'No Washrooms available...'}</td>
                  </tr>
                ) : (
                  filteredWashroom.map((washroom) => (
                    <tr key={washroom.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 text-center'>{washroom.name}</td>
                      <td className='px-6 py-4 text-center'>{washroom.floor}</td>
                      <td className='px-6 py-4 text-center'>
                        <div className='flex justify-between'>
                          <button
                            onClick={() => handleOpenEditModal(washroom)}
                            className='text-blue-600'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteWashroom(washroom.id)}
                            className='text-red-500'
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
          title={editingWashroom ? 'Edit washroom' : 'Add Washroom'}
        >
          <div className='space-y-4'>
            <div>
              <label className='block font-medium mb-1'>Name</label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1'
                placeholder='Floor 1 Washroom 1'
              />
            </div>
            <div>
              <label className='block font-medium mb-1'>Floor</label>
              <input
                type='text'
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className='border rounded-lg w-full px-3 py-2 focus:outline-none focus:ring-1'
                placeholder='floor 1'
              />
            </div>

            <div className='flex justify-between'>
              <button
                onClick={handleSubmit}
                className='bg-blue-500 rounded-lg py-2 px-3 w-fit text-white hover:bg-blue-600 transition-colors'
              >
                {editingWashroom ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className='bg-red-500 rounded-lg py-2 px-3 w-fit text-white hover:bg-red-600 transition-colors'
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      </SideBar>
    </div>
  )
}

export default Washroom