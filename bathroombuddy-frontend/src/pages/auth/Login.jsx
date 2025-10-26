import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
        <div className='text-center space-y-2'>
           <h1 className='text-3xl font-bold'>Bathroom Buddy</h1>
           <p>Weclome back!</p>
           <div className='border p-5'>
              <form className='flex flex-col space-y-1.5'>
              
                <p className='text-left'>Email</p>
                <input
                  className='border p-1' 
                  type='text'
                  placeholder='johndoe@hotmail.com'
                >
                </input>

                <p className='text-left'>Password</p>
                <input
                  className='border p-1'
                  type='text'
                  placeholder='password'
                >
                </input>

                <p className='flex flex-col'>
                  Don't have an account?
                  <Link className='hover:underline' to='/signup'>
                    Signup
                  </Link>
                </p>

                <button className='mt-2.5 border rounded-3xl transition hover:scale-90'>
                  Submit
                </button>
              </form>
           </div>
        </div>
    </div>
  )
}

export default Login

