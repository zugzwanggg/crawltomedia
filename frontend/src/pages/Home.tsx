import { useState, useEffect } from "react"
import axios from "axios"

import SocMedias from "../components/SocMedias"
import LineGraph from "../components/LineGraph"
import DailyStats from "../components/DailyStats"

import { useTranslation } from "react-i18next"

import { TypeApp } from '../types';
import { useAppSelector } from '../app/hooks';

// types
import { IMediaStats, IMediaData } from "../types";

const Home = () => {
  const {t} = useTranslation();
  const [currentStats, setCurrentStats] = useState('overall');

  const [userData, setUserData] = useState<TypeApp[]>([]);
  const {user} = useAppSelector(state=>state.user);
  const userId = user?.id!;

  const [data, setData] = useState<IMediaData|null>(null);
  console.log(data);
  

  const fetchUserApps = async () => {
    try {

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/apps/${userId}`);
      setUserData(res.data)
      
    } catch (error) {
      console.log(error);
    }
  }

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
      setData(res.data)
      
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (currentStats === 'Instagram') {
      getInstaStats();
    } else if (currentStats === 'YouTube') {
      getYoutubeStatistics();
    }
  }, [currentStats])

  useEffect(()=> {
    fetchUserApps();
  }, [])

  const handleStatsChange = (name:string) => {
    setCurrentStats(name);
  }

  return (
    <div className="lg:p-4 dark:text-white">
      <h1 className="text-2xl lg:text-5xl font-bold my-8 pl-2">
        {t('home.title')}
      </h1>

      <div className="flex flex-wrap lg:flex-nowrap px-2 gap-4">
        <div className='bg-primaryColor shadow-lg dark:bg-darkPrimaryColor w-full rounded-lg p-8 h-fit'>
          <ul className="flex items-center gap-2 py-2 overflow-x-auto">
            <li onClick={()=> handleStatsChange('overall')} className={`
            ${
              currentStats == 'overall' 
              ? 
              'bg-darkPrimaryColor text-white dark:bg-whiteGray dark:text-darkPrimaryColor border-darkPrimaryColor' 
              : 
              ' bg-white dark:bg-grayColor'
              } px-4 py-2 rounded cursor-pointer shadow`}>
              {t('all')}
            </li>
            {
              userData.map(app => {
                return <li onClick={()=> handleStatsChange(app.name)} className={`
                ${
                  currentStats == app.name
                  ? 
                  'bg-darkPrimaryColor text-white dark:bg-whiteGray dark:text-darkPrimaryColor border-darkPrimaryColor' 
                  : 
                  ' bg-white dark:bg-grayColor'
                  } px-4 py-2 rounded cursor-pointer shadow`}>
                  {app.name}
                </li>
                
              })
            }
          </ul>
          <LineGraph stats={data?.data!}/>
        </div>
        <div className="flex flex-wrap w-full md:flex-row md:flex-nowrap lg:flex-col lg:w-1/3 gap-4">
          <SocMedias/>
          <DailyStats data={data?.data[6]!}/>
        </div>
      </div>
    </div>
  )
}

export default Home