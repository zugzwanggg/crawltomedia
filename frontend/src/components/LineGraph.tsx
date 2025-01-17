import {useState, useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  Title,
  Tooltip,
  Legend
)


// types
import { TypeApp } from '../types';
import { useAppSelector } from '../app/hooks';

const LineGraph = () => {
  const {t} = useTranslation();
  const {user} = useAppSelector(state=>state.user);
  const userId = user?.id;

  const [currentStats, setCurrentStats] = useState('overall');
  const [userData, setUserData] = useState<TypeApp[]>([]);

  const fetchUserApps = async () => {
    try {

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/apps/${userId}`);
      setUserData(res.data)
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    fetchUserApps();
  }, [])

  const handleStatsChange = (name:string) => {
    setCurrentStats(name);
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const data = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    datasets: [
      {
        label: "Views",
        data: [2000, 4000, 5000, 7000, 5000, 6000],
        borderColor: "rgb(75, 192, 192)"
      }
    ]
  };

  return (
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
      <h2 className='font-semibold text-2xl mt-10'>Views</h2>
      <Line options={options} data={data} className='max-w-full shadow-lg bg-gray-800 p-6 rounded mt-3'/>
    </div>
  )
}

export default LineGraph