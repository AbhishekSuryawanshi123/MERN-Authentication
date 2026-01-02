import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import auth from '../assets/auth.jpg'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const ResetPassword = () => {

  const {backendUrl} = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const naviGate = useNavigate();

  const [isEmailSent, setIsEmailSent] = useState('');
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = React.useRef([]);
  
    const handleInput = (e, index) => {
      if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
        inputRefs.current[index + 1].focus();
      }
    }
  
    const handleKeydown = (e, index) => {
      if(e.key === 'Backspace' && e.target.value === '' && index > 0){
        inputRefs.current[index - 1].focus();
      }
    }
    
    const handlePaste = (e) => {
      const paste = e.clipboardData.getData('text');
      const pasteArray = paste.split('');
      pasteArray.forEach((char, index) => {
        if(inputRefs.current[index]){
          inputRefs.current[index].value = char;
        }
      })
    }

    const onSubmitEmail = async (e)=> {
      e.preventDefault();
      try {
        const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email});
        data.success ? toast.success(data.message) : toast.error(data.message);
        data.success && setIsEmailSent(true);
      } catch (error) {
        toast.error(error.message)
      }
    }

    const onSubmitOtp = async (e) => {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value);
      setOtp(otpArray.join(''));
      setIsOtpSubmitted(true);
    }

    const onSubmitNewPassword = async (e) => {
      e.preventDefault();
      try {
        const {data} = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword: password });
        data.success ? toast.success(data.message) : toast.error(data.message);
        data.success && naviGate('/login');
      } catch (error) {
        toast.error(error.message)
      }
    }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={()=> naviGate('/')} src={auth} alt="Auth" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />

      {!isEmailSent && 
      <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter your email ID</p>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]'>
          <input type="email" placeholder='Enter Your Email' className='bg-transparent outline-none text-white' value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <button className='w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-full cursor-pointer'>Submit</button>
      </form>
}

      {!isOtpSubmitted && isEmailSent &&
      <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Password Reset OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Please Enter 6 digit OTP sent on your email</p>

        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index)=>(
          <input type="text" maxLength='1' key={index} required className='w-12 h-12 mb-10 bg-[#333A5C] text-white text-center text-xl rounded-md'
          ref={e => inputRefs.current[index] = e}
          onInput={(e) => handleInput(e, index)} 
          onKeyDown={(e) => handleKeydown(e, index)} />
        ))}
        </div>
        <button className='w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-full cursor-pointer'>Verify Email</button>
      </form>
}

      {isOtpSubmitted && isEmailSent && 
      <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>New password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter your new password</p>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]'>
          <input type="text" placeholder='Enter new password' className='bg-transparent outline-none text-white' value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className='w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-full cursor-pointer'>Submit</button>
      </form>
}

    </div>
  )
}

export default ResetPassword
