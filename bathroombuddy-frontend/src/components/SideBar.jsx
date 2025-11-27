import React, { useContext, useState } from 'react'
import { AiOutlineMenu } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import { CiLogout } from "react-icons/ci";

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    clearUser();
    navigate("/");
  };


  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Request', path: '/request' },
    { label: 'Supply', path: '/supply' },
    { label: 'Washroom', path: '/washroom' },
  ];

  return (
    <div className='h-screen bg-gray-100 flex'>
      <div className={`${
        isOpen ? 'w-64' : 'w-20'
        } bg-linear-to-b from-slate-900 to-slate-800 text-white transition-all duration-200 ease-in-out flex flex-col shadow-xl overflow-hidden`}
      >

        {/* Header */}
        <div className={`flex items-center p-4 border-b border-slate-700 ${ isOpen ? 'justify-between' : 'justify-center'} `}>
          <h1
            className={`font-bold text-xl transition-opacity duration-200 ${
              isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}
          >
            Bathroom Buddy
          </h1>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className='p-2 rounded-lg hover:bg-slate-700 transition-colors shrink-0'
          >
              {isOpen? <AiOutlineMenu size={20} /> : <AiOutlineMenu size={30} /> }
          </button>
        </div>

        {/* Menu */}
        <nav className='flex-1 p-4 space-y-2'>
            {menuItems.map((item) =>
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className='w-full flex flex-col items-center p-2 hover:bg-slate-700 rounded-2xl transition-colors'
              >
                {isOpen ? item.label : ''}

              </button>  
          )
            }
        </nav>

        {/* footer + logout */}
        <div className='flex justify-center pb-5'>
          <button
            className='hover:scale-120  transition flex items-center justify-center'
            onClick={handleLogout}
          > 
            <CiLogout size={24} />
          </button>
        </div>
      </div>
      <div className='flex-1 overflow-y-auto'>{children}</div>
    </div>
  )
} 

export default SideBar