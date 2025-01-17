import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// icons
import { useState, useRef, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { LuLoaderCircle } from "react-icons/lu";


const ConfirmEmail = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { id, email } = location.state || {};
  

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

  const handleConfrimOTP = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    setError('')
    const otp = firstNum + secondNum + thirdNum + lastNum;
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/verifyOtp`, {otp, user_id: id})
      console.log(res);
    } catch (error: any) {
      console.log(error.response.data.message);
      setError(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    setError('')
    try {

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/resendOtp`, {user_id: id, email});
      console.log(res);

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleConfrimOTP} className="mx-4 w-full md:w-1/2 lg:w-1/4 lg:mx-0 bg-primaryColor dark:bg-darkPrimaryColor dark:text-white pt-2 pb-10 px-4 rounded-lg shadow-lg">
        <IoIosArrowBack onClick={()=>nav('/register')} className="text-3xl hover:opacity-55 my-4"/>
        <div className="mb-4">
          <h1 className="mx-auto text-3xl">
            Confirm your email
          </h1>
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
        <button className="btn-primary w-full mt-4">
        {
            isLoading
            ?
            <LuLoaderCircle className="text-3xl mx-auto animate-spin"/>
            :
            <>
             Send code
            </>
          }
        </button>
      </form>
    </div>
  )
}

export default ConfirmEmail