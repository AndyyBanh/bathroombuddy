import React, { useEffect, useState } from 'react'
import SideBar from '../../components/SideBar'
import { getAllRequests, getAllSupplies, getAllWashrooms } from '../../service/dashboardService';
import RadialChart from '../../components/RadialChart';
import Card from '../../components/Card';

const Dashboard = () => {
  const [supplies, setSupplies] = useState([]);
  const [washrooms, setWashrooms] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try{
      const suppliesResponse = await getAllSupplies();
      const washroomsResponse = await getAllWashrooms();
      const requestsResponse = await getAllRequests();

      setRequests(requestsResponse.data);
      setSupplies(suppliesResponse.data);
      setWashrooms(washroomsResponse.data);
    } catch (error) {
       if (error.response && error.response.data.message) {
         setError(error.response.data.message);
       } else {
         setError('Something went wrong. Please try again.');
       }
    }
  }

  const suppliesCount = supplies.length;
  const requestCount = requests.length;
  const washroomsCount = washrooms.length;
  const pendingRequests = requests.filter(r => r.status === 'PENDING').length;
  const completedRequests = requests.filter(r => r.status === 'COMPLETED').length;
  const inprogressRequests = requests.filter(r => r.status === 'IN_PROGRESS').length;
  
  return (
    <div>
      <SideBar>
        <div className='p-8 max-w-6xl mx-auto'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-3xl font-bold text-gray-800'>Dashboard</h1>
          </div>


          <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4'>
            
              <Card
                title='Total Requests'
                data={requestCount}
                text='All Time Statistics'
              />

              <RadialChart
                title='Pending Requests'
                data={pendingRequests}
                color="#FFB500"
                maxLimit={requestCount}
              />


              
              <RadialChart
                title='In Progess Requests'
                data={inprogressRequests}
                color="#6230D9"
                maxLimit={requestCount}
              />


              <RadialChart
                title='Completed Requests'
                data={completedRequests}
                color='#29E31E'
                maxLimit={requestCount}
            
              />

              <div className='col-span-2'>
                <Card
                  title='Total Supplies'
                  data={suppliesCount}
                  text='All Time Statistics'
                />
              </div>

              
              <div className='col-span-2'>
                <Card
                  title='Total Washrooms'
                  data={washroomsCount}
                  text='All Time Statistics'
                />
              </div>
            

          </div>

        </div>
      </SideBar>
    
    </div>
  )
}

export default Dashboard