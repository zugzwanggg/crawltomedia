import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { useAppSelector } from '../app/hooks';
import { useEffect, useState } from 'react';

// icons
import { IoIosArrowBack } from "react-icons/io";
import { PiEmpty } from "react-icons/pi";


// types
import {INotification} from "../types";
import { useTranslation } from 'react-i18next';

type Props = {
  setNotifications: (state:boolean) => void;
}


const Notifications = ({setNotifications}:Props) => {
  const {t} = useTranslation();

  const {user} = useAppSelector((state)=>state.user);
  const userId = user?.id;

  const [userData, setUserData] = useState<INotification[]>([]);
  
  const fetchNotifications =async () => {
    try {

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/notifications/${userId}`);
      console.log(res);
      
      setUserData(res.data)

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    fetchNotifications();
  }, [])

  return (
    <div className="fixed z-50 overflow-hidden top-0 right-0 lg:top-28 lg:right-20 rounded-lg shadow-lg bg-primaryColor dark:bg-darkPrimaryColor dark:text-white w-full lg:w-1/3 ">
      <div className="relative">
        <IoIosArrowBack onClick={()=>setNotifications(false)} className="absolute lg:hidden left-4 top-1/2 -translate-y-1/2 text-3xl hover:opacity-55"/>
        <h2 className="text-xl font-semibold py-4 border-b border-grayColor text-center ">
         {t('notifications.title')}
        </h2>
      </div>
      <ul className="relative py-6 px-6 h-screen lg:h-80 overflow-y-auto">
        {
          userData.length > 0
          ?
          userData.map(item => {
            const data = formatDistanceToNow(item.created_at);
            return <li className="flex gap-4 mb-10">
            <img className="w-12 h-12 object-cover rounded-full hidden dark:block" src={item.logo_path} alt="Logo" />
            <img className="w-12 h-12 object-cover rounded-full dark:hidden" src={item.logo_path} alt="Logo" />
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-sm">
                {item.title}
              </h3>
              <p className="text-sm">
                {item.content}
              </p>
              <span className="text-xs opacity-80">
                {data}
              </span>
            </div>
          </li>
          })
          :
          
          <div className='left-0 top-0 absolute w-full h-full flex items-center justify-center'>
            <b>{t('empty')}</b>
            <PiEmpty className='text-5xl'/>
          </div>
        }
        
      </ul>
    </div>
  )
}

export default Notifications