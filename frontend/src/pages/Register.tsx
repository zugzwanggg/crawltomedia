import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";

// icons
import { Link } from "react-router-dom";
import logoIcon from "../assets/logo.png";
import logoLightIcon from "../assets/logoLight.png";
import { FcGoogle } from "react-icons/fc";
import { LuLoaderCircle } from "react-icons/lu";


const Register = () => {
  const {t} = useTranslation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repPassword, setRepPassword] = useState('');
  const [privacy, setPrivacy] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const nav = useNavigate();

  const handleSignUp = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/register`, {username, email, password, repPassword, privacy});
      nav(`/register/confirm`, {state: {id: res.data.user.id, email: res.data.user.email}})

    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={(e)=>handleSignUp(e)} className="mx-4 w-full md:w-1/2 lg:w-1/4 lg:mx-0 bg-primaryColor dark:bg-darkPrimaryColor dark:text-white pt-4 pb-10 px-4 rounded-lg shadow-lg">
        <div className="mb-4">
          <img className="mx-auto w-20 rounded-lg mb-4 dark:hidden" src={logoLightIcon} alt="Logo" />
          <img className="mx-auto w-20 rounded-lg mb-4 hidden dark:block" src={logoIcon} alt="Logo" />
          <h1 className="text-center text-3xl">
            {t('register.title')}
          </h1>
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
          <input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full py-2 px-4 rounded-lg border dark:bg-grayColor dark:border-black outline-none" type="text" placeholder={t('register.inputs.username')} />
          <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full py-2 px-4 rounded-lg border dark:bg-grayColor dark:border-black outline-none" type="text" placeholder={t('register.inputs.email')} />
          <input value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full py-2 px-4 rounded-lg border dark:bg-grayColor dark:border-black outline-none" type="password" placeholder={t('register.inputs.password')} />
          <input value={repPassword} onChange={(e)=>setRepPassword(e.target.value)} className="w-full py-2 px-4 rounded-lg border dark:bg-grayColor dark:border-black outline-none" type="password" placeholder={t('register.inputs.repPassword')} />
        </div>
        <div className="flex items gap-2 mt-4">
          <input checked={privacy} onChange={()=>setPrivacy(prev=>!prev)} type="checkbox" />
          <small> 
            <Trans i18nKey={'register.privacy'}>
              <Link className="text-sky-500 underline" to='/terms'></Link>
            </Trans>
          </small>
        </div>
        {
          privacy
          ?
          <button className={`btn-primary w-full mt-4 ${isLoading ? 'opacity-55' : ''}`}>
          {
            isLoading
            ?
            <LuLoaderCircle className="text-3xl mx-auto animate-spin"/>
            :
            <>
             {t('register.btn')}
            </>
          }
          </button>
          :
          <button disabled className={`btn-primary w-full mt-4 opacity-55`}>
          {
            isLoading
            ?
            <LuLoaderCircle className="text-3xl mx-auto animate-spin"/>
            :
            <>
             {t('register.btn')}
            </>
          }
          </button>
        }

        <div className="flex items-center gap-2 my-4">
          <hr className="w-full border border-black dark:border-white"/>
          <p className="font-semibold">or</p>
          <hr className="w-full border border-black dark:border-white"/>
        </div>
        <div>
          <Link to={`${import.meta.env.VITE_BACKEND_BASE_URL.replace('/api', '')}/auth/google`} className="flex items-center justify-center gap-4 bg-white dark:bg-grayColor shadow w-full py-3 rounded-lg">
            <FcGoogle className="text-2xl"/>
            <span>
              {t('register.google')}
            </span>
          </Link>
        </div>
        <div>
          <p className="text-grayColor dark:text-primaryColor text-center mt-10">
            {t('register.account')} <Link to='/login' className="text-black dark:text-white underline font-bold inline-block">{t('login.title')}</Link>
          </p>
        </div>

      </form>
    </div>
  )
}

export default Register