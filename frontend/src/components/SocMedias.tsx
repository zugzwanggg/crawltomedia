import axios from "axios";
import { useEffect, useState } from "react";

// icons
import { TbPlugConnected } from "react-icons/tb";
import { useAppSelector } from "../app/hooks";

// types
import { TypeApp } from "../types";
import { useTranslation } from "react-i18next";



const SocMedias = () => {
  const {t} = useTranslation();
  const {user} = useAppSelector(state=>state.user);
  const userId = user?.id;

  const [userData, setUserData] = useState<TypeApp[]>([]);

  const fetchUserApps = async () => {
    try {

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/apps/${userId}`);

      setUserData(res.data)
      
    } catch (error) {
      console.log(error);
    }
  }

  const handleDisconnect = async (app_id: number | string) => {
    try {
      
      await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/disconnectApp/${userId}/${app_id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    fetchUserApps();
  },[])
  return (
    <ul className={`${userData.length > 0 ? "grid " : "hidden"} bg-primaryColor shadow-lg dark:bg-darkPrimaryColor gap-4 p-6 rounded w-full h-fit`}>
      <h3 className="text-lg lg:text-2xl font-semibold mb-2">
        {t('user_medias.title')}
      </h3>
      {
        userData.map(userApp => {
          return <li className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            
            <img className=" w-10 h-10 rounded object-cover" src={userApp?.logo_path} alt="Tiktok logo" />
            
            

            <p className="text-sm font-semibold">{userApp?.name}</p>
          </div>
          <button onClick={()=>handleDisconnect(userApp.id)} className="flex text-sm items-center gap-2 bg-grayColor text-white py-1 px-2 rounded duration-500 hover:opacity-85">
            {t('disconnect_btn')}
            <TbPlugConnected className="text-lg lg:text-2xl"/>
          </button>

        </li>
        })
      }
      
    </ul>
  )
}

export default SocMedias