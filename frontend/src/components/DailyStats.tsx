import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";

// icons
import { FaRegEye } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { BiLike } from "react-icons/bi";

type Params = {
  currentApp: string,
  userId: number | string
}

const DailyStats = ({currentApp, userId}:Params) => {
  const {t} = useTranslation();
  const [data,setData] = useState([]);
  console.log(data);

  const getInstaStats = async () => {
    try {

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/getInstaStatistics/${userId}/1`);

      setData(response.data)
      
    } catch (error) {
      console.log(error);
    }
  }

  const getYoutubeStatistics = async () => {
    try {

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/getYoutubeStatistics/${userId}/2`)
      console.log(res);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (currentApp === 'Instagram') {
      getInstaStats();
    } else if (currentApp === 'YouTube') {
      getYoutubeStatistics();
    }
  }, [currentApp])

  return (
    <div className="bg-primaryColor shadow-lg dark:bg-darkPrimaryColor grid gap-4 p-6 rounded w-full h-fit">
      <h3 className="text-lg lg:text-2xl font-semibold mb-2">
        {t('daily_stats.title')}
      </h3>
      <ul className="flex flex-col gap-2">
        <li className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <FaRegEye className="text-2xl"/>
            <p className="">
              {t('daily_stats.views')}
            </p>
          </div>
          <span className="text-2xl">
            0
          </span>
        </li>
        <li className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <FiUserPlus className="text-2xl"/>
            <p className="">
            {t('daily_stats.followers')}

            </p>
          </div>
          <span className="text-2xl">
            0
          </span>
        </li>
        <li className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <BiLike className="text-2xl"/>
            <p className="">
            {t('daily_stats.likes')}

            </p>
          </div>
          <span className="text-2xl">
            0
          </span>
        </li>
      </ul>
    </div>
  )
}

export default DailyStats