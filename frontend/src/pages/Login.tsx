import axios from "axios";
import {useState} from "react";

// icons
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { LuLoaderCircle } from "react-icons/lu";
import { Trans, useTranslation } from "react-i18next";

const Login = () => {
  const {t} = useTranslation();

  const nav = useNavigate();

  const [userValue, setUserValue] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/login`, {user: userValue, password})
      window.location.reload();
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="flex justify-center items-center h-screen ">
      <form onSubmit={handleLogin} className="mx-4 w-full md:w-1/2 lg:w-1/4 lg:mx-0 bg-primaryColor dark:bg-darkPrimaryColor dark:text-white py-10 px-4 rounded-lg shadow-lg">
        <div className="mb-4">
          <h1 className="mx-auto text-3xl">
            {t('login.title')}
          </h1>
        </div>
        <div>
          <Link to={`${import.meta.env.VITE_BACKEND_BASE_URL.replace('/api', '')}/auth/google`} className="flex items-center justify-center gap-4 bg-white dark:bg-grayColor shadow w-full py-3 rounded-lg">
            <FcGoogle className="text-2xl"/>
            <span>
            {t('login.google')}
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2 my-4">
          <hr className="w-full border border-black dark:border-white"/>
          <p className="font-semibold">{t('or')}</p>
          <hr className="w-full border border-black dark:border-white"/>
        </div>
        {
          error.length > 0
          ?
          <div className="bg-red-700 text-white py-1 text-center rounded my-2">
            {error}
          </div>
          :
          ''
        }

        <div className="flex flex-col gap-2">
          <input onChange={(e)=>setUserValue(e.target.value)} value={userValue} className="w-full py-2 px-4 rounded-lg border dark:bg-grayColor dark:border-black outline-none" type="text" placeholder={t('login.inputs.username_email')} />
          <input onChange={(e)=>setPassword(e.target.value)} value={password} className="w-full py-2 px-4 rounded-lg border dark:bg-grayColor dark:border-black outline-none" type="password" placeholder={t('login.inputs.password')} />
        </div>

        <div className="flex justify-end mt-2">
          <p className="text-sm hover:opacity-50 cursor-pointer" onClick={()=>nav('reset', {state: {email: userValue}})}>
            {t('login.forgot_password')}
          </p>
        </div>

        <button className="btn-primary w-full mt-4">
        {
            isLoading
            ?
            <LuLoaderCircle className="text-3xl mx-auto animate-spin"/>
            :
            <>
             {t('login.btn')}
            </>
          }
        </button>
        
        <div>
          <p className="text-grayColor dark:text-primaryColor text-center mt-10">
            <Trans i18nKey={'login.account'}>
              <Link to='/register' className="text-black dark:text-white underline font-bold inline-block"></Link>
            </Trans>
          </p>
        </div>

      </form>
    </div>
  )
}

export default Login