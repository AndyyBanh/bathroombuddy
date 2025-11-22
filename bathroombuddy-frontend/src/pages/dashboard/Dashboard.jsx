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


          <div className='flex flex-col-2 gap-4'>
              {/* build 4 cards for 2x2 row and col */}
              
              {/* card for number of request col-span-2 will take up top first 2 rows */}
              {/* card for number of supplies */}
              {/* card for number of washrooms */}
          
          </div>

        </div>
      </SideBar>
    
    </div>
  )
}

export default Dashboard