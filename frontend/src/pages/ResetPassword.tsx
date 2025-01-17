import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// icons
import { useState, useRef, useEffect } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";


const ResetPassword = () => {
  const nav = useNavigate();

  const location = useLocation();
  const { email } = location.state || {};

  const [userEmail, setUserEmail] = useState(email);
  const [userId, setUserId] = useState('');
  
  
  const [pageIndex, setPageIndex] = useState(0);
  

  const [firstNum, setFirstNum] = useState('');
  const [secondNum, setSecondNum] = useState('');
  const [thirdNum, setThirdNum] = useState('');
  const [lastNum, setLastNum] = useState('');

  const firstCodeRef = useRef<HTMLInputElement>(null);
  const secondCodeRef = useRef<HTMLInputElement>(null);
  const thirdCodeRef = useRef<HTMLInputElement>(null);
  const lastCodeRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')

  const [isChangeSuccesfull, setIsChangeSuccesfull] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [repNewPassword, setRepNewPassword] = useState('');

  useEffect(()=> {

    if (firstNum !== "" && secondNum === "") {
      secondCodeRef.current?.focus();
    } else if (secondNum !== "" && thirdNum === "") {
      thirdCodeRef.current?.focus()
    } else if (thirdNum !== "" && firstNum !== "") {
      lastCodeRef.current?.focus()
    } else {
      firstCodeRef.current?.focus()
    }

  }, [firstNum, secondNum, thirdNum, lastNum, secondCodeRef])

  const handleConfrimOTP = async () => {
    setIsLoading(true)
    setError('')
    const otp = firstNum + secondNum + thirdNum + lastNum;
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/verifyOtp`, {otp, user_id: userId})
      setPageIndex(prev=> prev+1)
    } catch (error: any) {
      setError(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    setError('')
    try {

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/resendOtp`, {user_id: userId, email});
      console.log(res);

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailEnter = async () => {
    setIsLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/resetPassword`, {email});
      
      setUserId(res.data.user.id)
      setPageIndex(prev=> prev + 1)
    } catch (error: any) {
      setError(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword =async () => {
    setIsLoading(true)
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/changePassword`, {user_id: userId, newPassword, repNewPassword});
      setIsChangeSuccesfull(true)
      setTimeout(()=> {
        nav('/login');
      }, 2000)
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setIsLoading(false)
      clearTimeout(this);
    }
  }

  function handleResetPage () {
    if (pageIndex === 0) {
      return <>
              <div className="mb-4 text-center">
                <h1 className="mx-auto text-3xl">
                  Enter your email
                </h1>
              </div>
              {
                error.length > 0
                ?
                <div className="bg-red-600 text-white py-1 text-center rounded mb-2">
                  {error}
                </div>
                :
                ''
              }
              <input onChange={(e)=>setUserEmail(e.target.value)} value={userEmail} className="w-full py-2 px-4 rounded-lg border dark:bg-grayColor dark:border-black outline-none" type="email" placeholder="Email" />
              <button type="button" onClick={handleEmailEnter} className="btn-primary w-full mt-4">
              {
                isLoading
                ?
                <LuLoaderCircle className="text-3xl mx-auto animate-spin"/>
                :
                <>
                 Send me code
                </>
              }
              </button>
            </>
    } else if (pageIndex === 1) {
      return <>
        <div className="mb-4 text-center">
          <h1 className="mx-auto text-3xl">
            Verify your email
          </h1>
          <p className="opacity-80 mt-2">
            We have sent a code to your email
          </p>
        </div>
        {
          error.length > 0
          ?
          <div className="bg-red-600 text-white py-1 text-center rounded">
            {error}
          </div>
          :
          ''
        }
        <div className="flex justify-end">
          <button onClick={handleResendOTP} type="button" className="flex items-center gap-2 py-4">
            Resend
          </button>
        </div>

        <div className="flex items-center justify-between">
          <input onClick={()=>firstCodeRef.current?.setSelectionRange(1, 1)} value={firstNum} onChange={(e)=>setFirstNum(e.target.value)} ref={firstCodeRef} maxLength={1} className="w-20 h-20 outline-none shadow-iner shadow-md rounded-lg text-center text-2xl dark:bg-grayColor" type="text" />
          <input onClick={()=>secondCodeRef.current?.setSelectionRange(1, 1)} value={secondNum} onChange={(e)=>setSecondNum(e.target.value)} ref={secondCodeRef} maxLength={1} className="w-20 h-20 outline-none shadow-iner shadow-md rounded-lg text-center text-2xl dark:bg-grayColor" type="text" />
          <input onClick={()=>thirdCodeRef.current?.setSelectionRange(1, 1)} value={thirdNum} onChange={(e)=>setThirdNum(e.target.value)} ref={thirdCodeRef} maxLength={1} className="w-20 h-20 outline-none shadow-iner shadow-md rounded-lg text-center text-2xl dark:bg-grayColor" type="text" />
          <input onClick={()=>lastCodeRef.current?.setSelectionRange(1, 1)} value={lastNum} onChange={(e)=>setLastNum(e.target.value)} ref={lastCodeRef} maxLength={1} className="w-20 h-20 outline-none shadow-iner shadow-md rounded-lg text-center text-2xl dark:bg-grayColor" type="text" />
        </div>
        <button onClick={handleConfrimOTP} type="button" className="btn-primary w-full mt-4">
        {
            isLoading
            ?
            <LuLoaderCircle className="text-3xl mx-auto animate-spin"/>
            :
            <>
             Verify
            </>
          }
        </button>
      </>
    } else if (pageIndex === 2) {
      return <>
        <h1 className="mx-auto text-3xl text-center">
          Make a new password
        
        </h1>
        {
          error.length > 0
          ?
          <div className="bg-red-600 text-white py-1 text-center rounded mt-2 mb-4">
            {error}
          </div>
          :
          ''
        }
        <input onChange={(e)=>setNewPassword(e.target.value)} value={newPassword} className="w-full mb-2 py-2 px-4 rounded-lg border dark:bg-grayColor dark:border-black outline-none" type="password" placeholder="New password" />
        <input onChange={(e)=>setRepNewPassword(e.target.value)} value={repNewPassword} className="w-full py-2 px-4 rounded-lg border dark:bg-grayColor dark:border-black outline-none" type="password" placeholder="Repeat new password" />

        <button className="btn-primary w-full mt-4" type="button" onClick={handleChangePassword}>
        {
            isLoading
            ?
            <LuLoaderCircle className="text-3xl mx-auto animate-spin"/>
            :
            <>
             Change password
            </>
          }
        </button>
      </>
    }
  }

  const handlePageIndex = () => {
    if (pageIndex === 0) {
      setError('');
      nav(-1)
    }

    setPageIndex(prev=> prev - 1)
  }



  return (
    <div className="flex justify-center items-center h-screen">
      <form className="mx-4 w-full md:w-1/2 lg:w-1/4 lg:mx-0 bg-primaryColor dark:bg-darkPrimaryColor dark:text-white pt-10 pb-10 px-4 rounded-lg shadow-lg">
        <div className={`${isChangeSuccesfull ? 'translate-y-20' : '-translate-y-52'} duration-500 bg-green-600 px-4 py-6 text-center rounded-md absolute top-0 left-1/2 -translate-x-1/2`}>
          Succesfully changed password
        </div>
        <IoIosArrowBack onClick={handlePageIndex} className="text-3xl hover:opacity-55 my-4"/>
        {handleResetPage()}
      </form>
    </div>
  )
}

export default ResetPassword;