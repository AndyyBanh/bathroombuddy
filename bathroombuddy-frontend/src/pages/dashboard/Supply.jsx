import React, { useEffect, useState } from 'react'
import SideBar from '../../components/SideBar'
import Modal from '../../components/Modal'
import { createSupply, deleteSupply, getAllSupplies, updateSupply } from '../../service/dashboardService';

const Supply = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplies, setSupplies] = useState([]);
  const [formData, setFormData] = useState({ type: '', quantity: '' });
  const [error, setError] = useState(null);
  const [editingSupply, setEditingSupply] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSuppliesData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingSupply(null);
    setFormData({ type: '', quantity: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (supply) => {
    setEditingSupply(supply);
    setFormData({ type: supply.type, quantity: supply.quantity.toString() });
    setIsModalOpen(true);
  };

  // functions to make api calls for supplies
  const fetchSuppliesData = async () => {
    try {
      const response = await getAllSupplies();
      setSupplies(response.data);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  const handleAddSupply = async () => {
    const { type, quantity } = formData;

    if (!type || !quantity) {
      setError('Missing required fields');
      return;
    }

    try {
      const response = await createSupply(type, parseInt(quantity));
      fetchSuppliesData(); // refresh dashboard data
      setIsModalOpen(false);
      setFormData({ type: '', quantity: '' });
      setError(null);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong please try again.');
      }
    }
  };

  const handleDeleteSupply = async (id) => {
    if (window.confirm('Are you sure you want to delete this supply?')) {
      try {
        await deleteSupply(id);
        fetchSuppliesData();
      } catch (error) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Something went wrong please try again.');
        }
      }
    }
   
  };

  const handleUpdateSupply = async () => {
    const { type, quantity } = formData;

     if (!type || !quantity) {
      setError('Missing required fields');
      return;
    }

    try {
      await updateSupply(type, parseInt(quantity), editingSupply.id);
      fetchSuppliesData();
      setIsModalOpen(false);
      setFormData({ type: '', quantity: '' });
      setError(null);
    } catch (error) {
     if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong please try again.');
      }
    } 
  };

  const handleSubmit = () => {
    if (editingSupply) {
      handleUpdateSupply();
    } else {
      handleAddSupply();
    }
  };

  const filteredSupplies = supplies.filter(supply => 
    supply.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  return (
    <div>
      <SideBar>
         <div className='p-8 max-w-6xl mx-auto'>
            <div className='flex justify-between items-center mb-6'>
              <h1 className='text-3xl font-bold text-gray-800'>Supplies Management</h1> 
              <button
                onClick={handleOpenAddModal}
                className='flex items-center bg-blue-600 px-4 py-2 rounded-xl text-white hover:bg-blue-700 transition'>
                Add Supply
              </button>
            </div>

            <div className='mb-4'>
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search by type...'
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
                    <th className='px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wide'>Type</th>
                    <th className='px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wide'>Quantity</th>
                    <th className='px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wide'>Last replenished</th>
                    <th className='px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wide'>Actions</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredSupplies.length === 0 ? (
                    <tr>
                      <td colSpan='4' className='px-6 py-4 text-center'>{searchTerm ? `No supplies found matching "${searchTerm}"` : 'No supplies available...' }</td>
                    </tr>
                    ) : (
                      filteredSupplies.map((supply) => (
                        <tr key={supply.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 text-center'>{supply.type}</td>
                          <td className='px-6 py-4 text-center'>{supply.quantity}</td>
                          <td className='px-6 py-4 text-center'>{supply.lastReplenished}</td>
                          <td className='px-6 py-4 text-center'>
                            <div className='flex justify-between'>
                              <button
                                onClick={() => handleOpenEditModal(supply)}
                                className='text-blue-500'
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteSupply(supply.id)}
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
          title={editingSupply ? 'Edit Supply' : 'Add new supply'}
        >
          <div className='space-y-4'>
            <div>
              <label className='block font-medium mb-1'>Type</label>
              <input
                type='text'
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1'
                placeholder='Enter Supply Type'
              />
            </div>

            <div>
              <label className='block font-medium mb-1'>Quantity</label>
              <input
                type='number'
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1'
                placeholder='Enter quantity'
              />
            </div>

            <div className='flex justify-between'>
              <button 
                onClick={handleSubmit}
                className='bg-blue-500 text-white py-2 px-3 w-fit hover:bg-blue-600 rounded-lg transition-colors'
              >
                {editingSupply ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className='bg-red-500 text-white py-2 px-3 w-fit hover:bg-red-600 rounded-lg'
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

export default Supply