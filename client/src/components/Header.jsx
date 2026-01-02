import React, { useContext } from 'react'
import header from '../assets/hello.jpg'
import hello from '../assets/shake.jpg'
import { AppContext } from '../context/AppContext'

const Header = () => {

  const {userData} = useContext(AppContext)

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      <img src={header} alt="Header" className='w-36 h-36 rounded-full mb-6'/>

      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name : 'Programmer'}! <img src={hello} alt="Hello" className='size-16 rounded-full'/></h1>

      <h2 className='text-2xl sm:text-3xl font-semibold mb-4'>Welcome to our app</h2>
      <p className='mb-8 max-w-md'>Hello everyone welcome to our MERN-AUTH application where you can register, login and update your details.</p>
      <button className='border border-gray-500 rounded-full px-8 py-2 hover:bg-gray-500 transition-all'>Get Started</button>
    </div>
  )
}

export default Header
