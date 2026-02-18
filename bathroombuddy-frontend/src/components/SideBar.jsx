import React, { useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Package, Droplets, LogOut, Menu } from 'lucide-react'
import { UserContext } from '../context/userContext'
import toast from 'react-hot-toast'

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true)
  const { clearUser } = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
    clearUser()
    navigate('/')
  }

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Requests',  path: '/request',   icon: ClipboardList },
    { label: 'Supplies',  path: '/supply',     icon: Package },
    { label: 'Washrooms', path: '/washroom',   icon: Droplets },
  ]

  return (
    <div className='h-screen bg-slate-50 flex'>
      <div className={`${isOpen ? 'w-56' : 'w-16'} bg-slate-900 text-white flex flex-col shadow-xl overflow-hidden transition-all duration-200 ease-in-out shrink-0`}>

        <div className={`flex items-center p-4 border-b border-slate-700 ${isOpen ? 'justify-between' : 'justify-center'}`}>
          {isOpen && (
            <div className='flex items-center gap-2'>
              <div className='w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0'>
                <Package className='h-4 w-4 text-white' />
              </div>
              <span className='font-bold text-sm tracking-tight'>Bathroom Buddy</span>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='p-1.5 rounded-lg hover:bg-slate-700 transition-colors shrink-0'
          >
            <Menu size={18} />
          </button>
        </div>

        <nav className='flex-1 p-3 space-y-1'>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium
                  ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                  ${!isOpen ? 'justify-center' : ''}
                `}
              >
                <Icon size={18} className='shrink-0' />
                {isOpen && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className='p-3 border-t border-slate-700'>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium ${!isOpen ? 'justify-center' : ''}`}
          >
            <LogOut size={18} className='shrink-0' />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className='flex-1 overflow-y-auto bg-slate-50'>{children}</div>
    </div>
  )
}

export default SideBar
