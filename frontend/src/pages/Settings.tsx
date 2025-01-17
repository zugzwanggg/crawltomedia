import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

// icons
import { RiApps2AddFill } from "react-icons/ri";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaLanguage } from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { useTranslation } from "react-i18next";



const Settings = () => {
  const {t} = useTranslation();
  
  const nav = useNavigate();
  
  useEffect(() => {


    if (window.innerWidth >= 768) {
      nav('/settings/profile')
    }
  }, [])
  
  const handleLogout = async () => {
    await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/logout`);
    window.location.reload();
  }

  return (
    <div className="overflow-hidden relative h-full lg:h-mdhv bg-primaryColor dark:bg-darkPrimaryColor dark:text-white m-6 pb-20 lg:pb-0 lg:px-6 rounded-lg shadow-lg md:ml-8">

      <div className="rounded-lg flex h-full gap-9 xl:gap-24">
        <nav className="w-full md:w-fit border-none md:border-solid border-r-2 dark:border-grayColor">
          <h1 className="text-2xl lg:text-4xl font-bold my-8 pl-2 text-center md:text-left">
            {t('settings.title')}
          </h1>
          <ul className="w-full md:w-72 flex flex-col gap-2 px-5 overflow-y-auto">
            <h3 className="font-semibold my-2">
              {t('settings.properties')}
            </h3>
            <li>
              <NavLink to='profile' className={({isActive})=> `${isActive ? 'bg-grayColor bg-opacity-10 opacity-100 dark:bg-opacity-100' : 'opacity-70 '} flex items-center gap-4 py-3 px-4 rounded-md`}>
                <FaRegCircleUser className="text-2xl"/> {t('settings.edit.title')}
              </NavLink>
            </li>
            <h3 className="font-semibold my-2">
              {t('settings.app')}
            </h3>
            <li>
              <NavLink to='apps' className={({isActive})=> `${isActive ? 'bg-grayColor bg-opacity-10 opacity-100 dark:bg-opacity-100' : 'opacity-70 '} flex items-center gap-4 py-3 px-4 rounded-md`}>
                <RiApps2AddFill className="text-2xl"/> {t('settings.medias.title')}
              </NavLink>
            </li>
            <li>
              <NavLink to='language' className={({isActive})=> `${isActive ? 'bg-grayColor bg-opacity-10 opacity-100 dark:bg-opacity-100' : 'opacity-70 '} flex items-center gap-4 py-3 px-4 rounded-md`}>
                <FaLanguage className="text-2xl"/> {t('settings.lang.title')}
              </NavLink>
            </li>

            <h3 className="font-semibold my-2">
              {t('settings.service')}
            </h3>
            <li>
              <NavLink to='help' className={({isActive})=> `${isActive ? 'bg-grayColor bg-opacity-10 opacity-100 dark:bg-opacity-100' : 'opacity-70 '} flex items-center gap-4 py-3 px-4 rounded-md`}>
                <IoIosHelpCircleOutline className="text-2xl"/> {t('settings.help.title')}
              </NavLink>
            </li>

            <li>
              <button onClick={handleLogout} className="text-red-500 flex items-center gap-4 py-3 hover:opacity-55">
                <TbLogout2 className="text-xl"/> {t('logout')}
              </button>
            </li>
          </ul>
        </nav>

        <div className={`${window.location.pathname  !== '/settings/' ? 'z-10' : ' -z-10'} px-4 lg:px-0 bg-primaryColor dark:bg-darkPrimaryColor absolute top-0 left-0 md:static w-full h-full md:pr-4 py-10 overflow-y-auto`}>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Settings