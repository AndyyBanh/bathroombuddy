import { useEffect, useState } from 'react'
import SideBar from '../../components/SideBar'
import { getAllRequests, getAllSupplies, getAllWashrooms } from '../../service/dashboardService'
import RadialChart from '../../components/RadialChart'
import Card from '../../components/Card'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [supplies, setSupplies] = useState([])
  const [washrooms, setWashrooms] = useState([])
  const [requests, setRequests] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const suppliesResponse = await getAllSupplies()
      const washroomsResponse = await getAllWashrooms()
      const requestsResponse = await getAllRequests()
      setRequests(requestsResponse.data)
      setSupplies(suppliesResponse.data)
      setWashrooms(washroomsResponse.data)
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    }
  }

  const suppliesCount = supplies.length
  const requestCount = requests.length
  const washroomsCount = washrooms.length
  const pendingRequests = requests.filter(r => r.status === 'PENDING').length
  const completedRequests = requests.filter(r => r.status === 'COMPLETED').length
  const inprogressRequests = requests.filter(r => r.status === 'IN_PROGRESS').length

  return (
    <SideBar>
      <div className='p-8 max-w-6xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Dashboard</h1>
          <p className='text-sm text-slate-500 mt-1'>Overview of all requests, supplies, and washrooms</p>
        </div>

        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
          <Card title='Total Requests' data={requestCount} text='All Time Statistics' />
          <RadialChart title='Pending' data={pendingRequests} color='#FFB500' maxLimit={requestCount} />
          <RadialChart title='In Progress' data={inprogressRequests} color='#6230D9' maxLimit={requestCount} />
          <RadialChart title='Completed' data={completedRequests} color='#29E31E' maxLimit={requestCount} />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Card title='Total Supplies' data={suppliesCount} text='All Time Statistics' />
          <Card title='Total Washrooms' data={washroomsCount} text='All Time Statistics' />
        </div>
      </div>
    </SideBar>
  )
}

export default Dashboard
