import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// icons
import logoIcon from "../assets/logo.png";
import logoLightIcon from "../assets/logoLight.png";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaCircleUser } from "react-icons/fa6";
import { LuSendHorizontal } from "react-icons/lu";


// components
import Notifications from "./Notifications";
import { useAppSelector } from "../app/hooks";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Header = () => {
  const {t} = useTranslation();

  const {isAuth, user, userPic} = useAppSelector(state=> state.user);

  const profileElement = useRef<HTMLDivElement>(null);

  const [profileClicked, setProfileClicked] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(()=> {

    const handleClick = (e: MouseEvent) => {
      if (profileElement.current && !profileElement.current.contains(e.target as Node) && profileClicked) {
        setProfileClicked(false)
      }
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }

  }, [profileElement, profileClicked])


  const handleLogout = async () => {
    await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/logout`);
    window.location.reload();
  }

  return (
    <header className="relative shadow-lg bg-primaryColor dark:bg-darkPrimaryColor py-3 lg:py-5 px-8 flex justify-between lg:justify-end">
      <Link className="lg:hidden" to='/'>
        <img className="w-10 md:w-16 md:h-16 rounded-2xl dark:hidden" src={logoLightIcon} alt="logo" />
        <img className="w-10 md:w-16 md:h-16 rounded-2xl hidden dark:block" src={logoIcon} alt="logo" />
      </Link>
      <div className="flex items-center gap-10">

        {
          isAuth
          ?
          <>
            <div className="relative">
              <IoMdNotificationsOutline onClick={()=>setShowNotifications(prev=>!prev)} className="text-3xl dark:text-white text-grayColor"/>
              {
                false
                ?
                <span className="w-3 h-3 bg-red-600 absolute top-0 right-0 rounded-full">
                  {/* indicator */}
                </span>
                :
                ''
              }
                
            </div>
            {
              user?.user_pic === null
              ?
              <div onClick={()=>setProfileClicked(prev=>!prev)}>
                <FaCircleUser className="text-5xl dark:text-white text-grayColor"/>
              </div>
              :
              <img onClick={()=>setProfileClicked(prev=>!prev)} className="w-12 h-12 rounded" src={userPic ? userPic : user?.user_pic} alt="User logo" />


            }
          </>
          
          :
          <Link to='/login' className="btn-primary px-6">
            Login
          </Link>
        }
      </div>


      {
        profileClicked
        ?
        <div ref={profileElement} className="fixed z-30 top-32 right-4 py-8 px-10 rounded-xl w-64 sm:w-80 bg-primaryColor dark:bg-darkPrimaryColor shadow-lg dark:shadow-black dark:text-white">
          <ul className="w-full flex flex-col gap-4 ">
            <li className="opacity-55 hover:opacity-100">
              <Link onClick={()=>setProfileClicked(false)} to='/settings/profile'>
                {t('settings.edit.title')}
              </Link>
            </li>
            <hr className="my-1 dark:border-white dark:opacity-30" />
            <li className="opacity-55 hover:opacity-100 flex items-center gap-4">
              <LuSendHorizontal className="text-2xl"/>
              <Link to='/invite'>
                Invite creators
              </Link>
            </li>
            <hr className="my-1 dark:border-white dark:opacity-30" />
            <li onClick={handleLogout} className="opacity-55 hover:opacity-100 cursor-pointer">
              {t('logout')}
            </li>
          </ul>
        </div>
        :
        ''
      }


      {
        showNotifications
        ?
        <>
          <Notifications setNotifications={setShowNotifications}/>
          <div onClick={()=>setShowNotifications(false)} className="fixed z-40 left-0 top-0 opacity-15 w-full h-full">
            {/* Dark bg */}
          </div>
        </>
        :
        ''
      }
    </header>
  )
}

export default Header