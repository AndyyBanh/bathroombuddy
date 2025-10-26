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

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Root />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path ='/dashboard' element={<Dashboard />} />
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