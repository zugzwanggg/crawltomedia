import { useState, useEffect } from "react"
import axios from "axios"

import SocMedias from "../components/SocMedias"
import LineGraph from "../components/LineGraph"
import DailyStats from "../components/DailyStats"

import { useTranslation } from "react-i18next"

import { TypeApp } from '../types';
import { useAppSelector } from '../app/hooks';

// types
import { IMediaStats } from "../types";

const Home = () => {
  const {t} = useTranslation();
  const [currentStats, setCurrentStats] = useState('');

  const [userData, setUserData] = useState<TypeApp[]>([]);
  const {user} = useAppSelector(state=>state.user);
  const userId = user?.id!;

  const [data, setData] = useState<IMediaStats[]>([]);
  
  const [isLineChartLoading, setIsLineChartLoading] = useState(false);

  const fetchUserApps = async () => {
    try {

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/apps/${userId}`);
      setUserData(res.data)
      
    } catch (error) {
      console.log(error);
    }
  }

  const getStats = async () => {
    try {
      
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/getStatistics/${userId}`);

      console.log(response);

    } catch (error) {
      console.log(error);
    }
  }

  const getInstaStats = async () => {
    setIsLineChartLoading(true)
    try {

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/getInstaStatistics/${userId}/1`);

      setData(response.data.data)
      
    } catch (error) {
      console.log(error);
    } finally {
      setIsLineChartLoading(false)
    }
  }

  const getYoutubeStatistics = async () => {
    setIsLineChartLoading(true)
    try {

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/getYoutubeStatistics/${userId}/2`)
      setData(res.data.data)
      
    } catch (error) {
      console.log(error)
    } finally {
      setIsLineChartLoading(false)
    }
  }

  useEffect(() => {
    if (currentStats === 'overall') {
      getStats();
    }
    else if (currentStats === 'Instagram') {
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
            {/* <li onClick={()=> handleStatsChange('overall')} className={`
            ${
              currentStats == 'overall' 
              ? 
              'bg-darkPrimaryColor text-white dark:bg-whiteGray dark:text-darkPrimaryColor border-darkPrimaryColor' 
              : 
              ' bg-white dark:bg-grayColor'
              } px-4 py-2 rounded cursor-pointer shadow`}>
              {t('all')}
            </li> */}
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
          <LineGraph currentApp={currentStats} stats={data} isLoading={isLineChartLoading}/>
        </div>
        <div className="flex flex-wrap w-full md:flex-row md:flex-nowrap lg:flex-col lg:w-1/3 gap-4">
          <SocMedias/>
          <DailyStats data={data[data.length-1]}/>
        </div>
      </div>
    </div>
  )
}

export default Home