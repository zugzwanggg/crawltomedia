import { Link, useNavigate } from "react-router-dom"

// icons
import { IoIosArrowBack } from "react-icons/io";
import { PiPlugsConnectedBold } from "react-icons/pi";
import { TbPlugConnected } from "react-icons/tb";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import { useAppSelector } from "../app/hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { TypeApp } from "../types";

const SocialApps = () => {
  const {t} = useTranslation();
  
  const {user} = useAppSelector(state => state.user);
  const userId = user?.id;

  const [userData, setUserData] = useState<TypeApp[]>([]);
  const [apps, setApps] = useState<TypeApp[]>([]);
  const [search,setSearch] = useState('');

  const nav = useNavigate();

  const fetchUserApps = async () => {
    try {

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/apps/${userId}`);

      setUserData(res.data)
      
    } catch (error) {
      console.log(error);
    }
  }

  const fetchAvailableApps =async () => {
    try {

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/availableApps/${userId}`);

      setApps(res.data);
      
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearchApp = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/searchApp?q=${search}`);

      setApps(res.data)
    } catch (error) {
      console.log(error);
    }
  }

  const handleDisconnect = async () => {
    try {
      
      await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/disconnectApp/${userId}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    fetchUserApps();
    fetchAvailableApps();
  }, [])

  useEffect(()=>{
    handleSearchApp();
  }, [search])

  return (
    <div>
      <div className="flex items-center gap-2 mb-10">
        <IoIosArrowBack onClick={()=>nav(-1)} className="text-3xl hover:opacity-55"/>
        <h2 className="font-bold text-lg">
          {t('settings.medias.title')}
        </h2>
      </div>
      {
        userData.length > 0
        ?
        <>
        <div>
          <b>
            {t('settings.medias.connected')}
          </b>
          <p className="font-light opacity-55">
            {t('settings.medias.connected_description')}
          </p>
        </div>
        <ul className=" grid gap-4 py-6 rounded w-full h-fit">
          {
            userData.map(userApp => {
              return <li className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                
                <img className="w-10 h-10 rounded object-cover" src={userApp?.logo_path} alt="Tiktok logo" />
                
                
    
                <p className="text-sm font-semibold">{userApp?.name}</p>
              </div>

              <button onClick={handleDisconnect} className="flex text-sm items-center gap-2 bg-grayColor text-white py-1 px-2 rounded duration-500 hover:opacity-85">
                {t('disconnect_btn')}
                <TbPlugConnected className="text-lg lg:text-2xl"/>
              </button>
            </li>
            })
          }
          
        </ul>
        </>
        :
        ''
      }
      
      <div>
        <b>
        {t('settings.medias.available')}
        </b>
        <p className="font-light opacity-55">
        {t('settings.medias.available_description')}
        </p>
      </div>
      <form className="relative overflow-hidden mt-4 mb-2">
        <input value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full py-2 px-4 rounded-xl border-2 border-whiteGray outline-none dark:border-grayColor dark:bg-darkPrimaryColor" type="text" placeholder={t('search_placeholder')}/>
        <FiSearch className="text-xl absolute z-0 right-2 top-1/2 -translate-y-1/2 text-gray-600 dark:text-white"/>
      </form>

      <ul className=" grid gap-4 pt-2 pb-6 rounded w-full h-fit">
        {
          apps.length > 0
          ?
            apps.map(app => {
              return <li className="flex items-center justify-between lg:gap-6">
                      <div className="flex items-center gap-2">
  
                      <img className="w-10 h-10 object-cover" src={app?.logo_path} alt="Instagram logo" />
                        
                        
          
                        <p className="text-sm font-semibold">{app?.name}</p>
                      </div>
                      <Link to={`${app.oauth_link}${app.oauth_link.includes('?') ? '&' : '?'}state=${userId}`} className="flex items-center text-sm py-1 gap-2 shadow-lg bg-white text-darkPrimaryColor p-2 rounded duration-500 hover:opacity-85">
                        {t('connect_btn')}
                        <PiPlugsConnectedBold className="text-lg lg:text-2xl"/>
                      </Link>
                        
                    </li>
            })
          :
          t('settings.medias.apps_null')
        }
        
        
      </ul>
    </div>
  )
}

export default SocialApps