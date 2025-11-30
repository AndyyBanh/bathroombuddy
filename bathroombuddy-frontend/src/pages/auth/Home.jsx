import React, { useEffect, useState } from 'react'
import Header from '../../components/layouts/Header'
import { createRequest, getAllSupplies, getAllWashrooms } from '../../service/dashboardService';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';


const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({ status: '', suppliesId: '', washroomId: ''});
  const [error, setError] = useState(null);
  const [supplies, setSupplies] = useState([]);
  const [washrooms, setWashrooms] = useState([]);

  useEffect(() => {
    if (isModalOpen) {
      fetchSuppliesData();
      fetchWashroomsData();
    }
  }, [isModalOpen]);

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
    setFormData({ status: 'PENDING', suppliesId: '', washroomId: '' });
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
  
  const handleAddRequest = async () => {
    const { status, suppliesId, washroomId } = formData;
    
    if (!status || !suppliesId || !washroomId) {
      setError('Missing required fields');
      toast.error('Missing field');
      return;
    }
    
    try {
      const response = await createRequest('PENDING', parseInt(suppliesId), parseInt(washroomId));
      toast.success('Request succesful');
      setIsModalOpen(false);
      setFormData({ status: '', suppliesId: '', washroomId: '' });
      setError(null);
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error('Too many request. Please try again in a few minutes');
        setError('Too many request. Please try again in a few minutes');
      } else if (error.response && error.response.data.message) {
        setError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setError('Something went wrong please try again.');
        toast.error('Something went wrong please try again.');
      }
    }
  };

  const handleSubmit = () => {
    handleAddRequest();
  }

  return (
    <div>
        <Header />

        <div className='relative  h-screen w-screen pt-16'>
         <div className='relative  flex items-center justify-center h-full w-full'>
            <div className='space-y-2 text-center'>
              <h1 className='text-3xl font-bold tracking-wider'>Bathroom Buddy</h1>
              <p className='text-gray-600'>Running out of tolietries?</p>
              <button 
                onClick={handleOpenAddModal}
                className='w-auto bg-blue-600 text-white rounded-lg px-2.5 py-1 transition hover:scale-90 hover:bg-blue-700 shadow-2xl'
              >
                Request
              </button>
            </div> 
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={'Submit a Request'}
        >
          <div className='space-y-4'>
            <div>
              <label className='block font-medium mb-1'>Supply Needed</label>
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
              <label className='block font-medium mb-1'>Washroom Location</label>
              <select
                value={formData.washroomId}
                onChange={(e) => setFormData({ ...formData, washroomId: e.target.value })}
                className='w-full border rounded-lg px-3 py-2 focus:outine-none focus:ring-1'
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
                Add
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className='bg-red-500 rounded-lg py-2 px-3 w-fit text-white hover:bg-red-500 transition-colors'
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