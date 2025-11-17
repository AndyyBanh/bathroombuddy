import React from 'react'
import SideBar from '../../components/SideBar'

const Dashboard = () => {
  return (
    <div>
      <SideBar>
        <div className='p-8 max-w-6xl mx-auto'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-3xl font-bold text-gray-800'>Dashboard</h1>
          </div>

        </div>

      </SideBar>
    
    </div>
  )
}

export default Dashboard