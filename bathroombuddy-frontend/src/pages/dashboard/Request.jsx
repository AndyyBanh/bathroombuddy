import React, { useEffect, useState } from 'react'
import SideBar from '../../components/SideBar'
import { createRequest, deleteRequest, getAllRequests, getAllSupplies, getAllWashrooms, updateRequest } from '../../service/dashboardService';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';

const Request = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({ status: '', suppliesId: '', washroomId: ''});
  const [error, setError] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [supplies, setSupplies] = useState([]);
  const [washrooms, setWashrooms] = useState([]);

  useEffect(() => {
    fetchRequestData();
    fetchWashroomsData();
    fetchSuppliesData();
  }, [])

  const getSupplyName = (id) => {
    const supply = supplies.find(s => s.id === id);
    if (supply) {
      return supply.type;
    } else {
      return 'Unknown Supply Type.';
    }
  };

  const getWashroomName = (id) => {
    const washroom = washrooms.find(w => w.id === id);
    if (washroom) {
      return washroom.name;
    } else {
      return 'Unknown Washroom Name.';
    }
  };

  const handleOpenAddModal = () => {
    setEditingRequest(null);
    setFormData({ status: '', suppliesId: '', washroomId: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (request) => {
    setEditingRequest(request);
    setFormData({ 
      status: request.status, 
      suppliesId: request.suppliesId.toString(), 
      washroomId: request.washroomId.toString() 
    });
    setIsModalOpen(true);
  };

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

  
  const fetchRequestData = async () => {
      try {
        const response = await getAllRequests();
        console.log('Response: ', response.data);
        setRequests(response.data);
      } catch (error) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Something went wrong. Please try again.');
        }
      }
    };

  const handleAddRequest = async () => {
      const { status, suppliesId, washroomId } = formData;
  
      if (!status || !suppliesId || !washroomId) {
        setError('Missing required fields');
        toast.error('Missing fields');
        return;
      }
  
      try {
        const response = await createRequest(status, parseInt(suppliesId), parseInt(washroomId));
        toast.success('Request succesfully created');
        fetchRequestData();
        setIsModalOpen(false);
        setFormData({ status: '', suppliesId: '', washroomId: '' });
        setError(null);
      } catch (error) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Something went wrong please try again.');
        }
      }
    };


  const handleDeleteRequest = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
          await deleteRequest(id);
          toast.success('Request successfully deleted');
          fetchRequestData();
      } catch (error) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Something went wrong please try again.');
        }
      }
    }
  };

  const handleUpdateRequest = async () => {
      const { status, suppliesId, washroomId } = formData;
  
      if (!status || !suppliesId || !washroomId) {
        setError('Missing required fields');
        toast.error('Missing fields');
        return;
      }
  
      try {
        await updateRequest(status, parseInt(suppliesId), parseInt(washroomId), editingRequest.id);
        toast.success('Request sucessfully updated');
        fetchRequestData();
        setIsModalOpen(false);
        setFormData({ status: '', suppliesId: '', washroomId: '' });
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
    if (editingRequest) {
      handleUpdateRequest();
    } else {
      handleAddRequest();
    }
  }

  const formatStatus = (status) => {
    if (status === 'PENDING') {
      return 'Pending';
    } else if (status === 'IN_PROGRESS') {
      return 'In Progress';
    } else if (status === 'COMPLETED') {
      return 'Completed';
    }
  }

  const filteredRequest = requests.filter(request =>
    request.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <SideBar>
        <div className='p-8 max-w-6xl mx-auto'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-3xl font-bold text-gray-800'>Requests Management</h1>
            <button
              onClick={handleOpenAddModal}
              className='bg-blue-600 flex items-center px-4 py-2 rounded-xl text-white hover:bg-blue-700 transition-colors'
            >
              Add Request
            </button>
          </div>

      
           <div className='mb-4'>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search request by status...'
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
                  <th className='px-6 py-3 text-left text-gray-500 font-medium uppercase tracking-wide'>Status</th>
                  <th className='px-6 py-3 text-left  text-gray-500 font-medium uppercase tracking-wide'>Supply</th>
                  <th className='px-6 py-3 text-left text-gray-500  font-medium uppercase tracking-wide'>Washroom</th>
                  <th className='px-6 py-3 text-left text-gray-500  font-medium uppercase tracking-wide'>Actions</th>
                </tr>
              </thead>

              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredRequest.length === 0 ? (
                  <tr>
                    <td colSpan='4' className='px-6 py-4 text-center'>{searchTerm ? `No request found matching supply "${searchTerm}"` : 'No requests available...'}</td>
                  </tr>
                ) : (
                  filteredRequest.map((request) => (
                    <tr key={request.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 text-center'>{formatStatus(request.status)}</td>
                      <td className='px-6 py-4 text-center'>{getSupplyName(request.suppliesId)}</td>
                      <td className='px-6 py-4 text-center'>{getWashroomName(request.washroomId)}</td>
                      <td className='px-6 py-4 text-center'>
                        <div className='flex justify-between'>
                          <button
                            onClick={() => handleOpenEditModal(request)}
                            className='text-blue-600'
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteRequest(request.id)}
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
          title={editingRequest ? 'Edit Request' : 'Add Request'}
        >
          <div className='space-y-4'>
            <div>
              <label className='block font-medium mb-1'>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1'
              >
                <option value=''>Select Status</option>
                <option value='PENDING'>Pending</option>
                <option value='IN_PROGRESS'>In Progess</option>
                <option value='COMPLETED'>Completed</option>
              </select>
            </div>

            <div>
              <label className='block font-medium mb-1'>Supply</label>
              <select
                value={formData.suppliesId}
                onChange={(e) => setFormData({ ...formData, suppliesId: e.target.value })}
                className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1'
              >
                <option value=''>Select Supply</option>
                {supplies.map(supply => (
                  <option key={supply.id} value={supply.id}>{supply.type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className='block font-medium mb-1'>Washroom</label>
              <select
                value={formData.washroomId}
                onChange={(e) => setFormData({ ...formData, washroomId: e.target.value })}
                className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1'
              >
                <option value=''>Select Washroom</option>
                {washrooms.map(washroom => (
                  <option key={washroom.id} value={washroom.id}>{washroom.name}</option>
                ))}
              </select>
            </div>
          
            <div className='flex justify-between'>
              <button
                onClick={handleSubmit}
                className='bg-blue-500 rounded-lg py-2 px-3 w-fit text-white hover:bg-blue-600 transition-colors'
              >
                {editingRequest ? 'Update' : 'Add'}
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

export default Request