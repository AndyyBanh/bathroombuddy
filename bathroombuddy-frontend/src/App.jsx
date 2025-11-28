import React from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Home from './pages/auth/Home'
import Signup from './pages/auth/Signup'
import UserProvider from './context/userContext'
import Washroom from './pages/dashboard/Washroom'
import Supply from './pages/dashboard/Supply'
import Request from './pages/dashboard/Request'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Toaster />
        <Routes>
          <Route path='/' element={<Root />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path ='/dashboard' element={<Dashboard />} />
          <Route path='/request' element={<Request />} />
          <Route path='/supply' element={<Supply />} />
          <Route path='/washroom' element={<Washroom />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (isAuthenticated) {
    return <Navigate to='/dashboard' />
  } else {
    return <Navigate to='/home' />
  }
}