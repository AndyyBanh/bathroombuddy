import React, { useState } from 'react'
import SideBar from '../../components/SideBar'
import { createWashroom, deleteWashroom, getAllWashrooms, updateWashroom } from '../../service/dashboardService';
import Modal from '../../components/Modal';

const Washroom = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [washrooms, setWashrooms] = useState([]);
  const [formData, setFormData] = useState({ name: '', floor: '' });
  const [error, setError] = useState(null);
  const [editingWashroom, setEditingWashroom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  
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
        return;
    }

    try {
      const response  = await createWashroom(name, floor);
      fetchWashroomsData();
      setIsModalOpen(false);
      setFormData({ name: '', floor: '' });
      setError(null); 
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong please try again.');
      }
    }
  };

  const handleUpdateWashroom = async () => {
    const { name, floor } = formData;

    if (!name || !floor) {
        setError('Missing required fields.');
        return;
    }

    try {
      const response = await updateWashroom(name, floor, editingWashroom.id);
      fetchWashroomsData();
      setIsModalOpen(false);
      setFormData({ name: '', floor: '' });
      setError(null);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong please try again.');
      }
    }
  };

  const handleDeleteWashroom = async (id) => {
    try {
      await deleteWashroom(id);
      fetchWashroomsData();
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong please try again');
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
    washroom.type.toLowerCase().includes(searchTerm.toLowerCase)
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
              placeholder='Search washroom'
              className='border rounded-lg px-2 py-1.5'
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
                          <button>
                            Edit
                          </button>
                          <button>
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
          title={editingWashroom ? 'Edit washroom' : 'add Washroom'}
        >
          <div className='space-y-4'>
            <div>
              <label className='block font-medium mb-1'>Name</label>
              <input
              
              />
            </div>
          </div>

        </Modal>
      </SideBar>
    </div>
  )
}

export default Washroom