import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  Title,
  Tooltip,
  Legend
)

// icons
import { LuLoaderCircle } from "react-icons/lu";

// types
import { IMediaStats } from '../types';

type Params = {
  stats: IMediaStats[],
  isLoading: boolean
}

const LineGraph = ({stats, isLoading}:Params) => {
  

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const data = {
    labels: [
      daysOfWeek[(new Date(stats[0]?.date)).getDay()],
      daysOfWeek[(new Date(stats[1]?.date)).getDay()],
      daysOfWeek[(new Date(stats[2]?.date)).getDay()],
      daysOfWeek[(new Date(stats[3]?.date)).getDay()],
      daysOfWeek[(new Date(stats[4]?.date)).getDay()],
      daysOfWeek[(new Date(stats[5]?.date)).getDay()],
      daysOfWeek[(new Date(stats[6]?.date)).getDay()],
    ],
    datasets: [
      {
        label: "Views",
        data: [stats[0]?.views || 0, 
        stats[1]?.views || 0, 
        stats[2]?.views || 0, stats[3]?.views || 0, stats[4]?.views || 0, stats[5]?.views || 0, stats[6]?.views || 0],
        borderColor: "rgb(75, 192, 192)"
      }
    ]
  };

  return (
    <>
      <h2 className='font-semibold text-2xl mt-10'>Views</h2>
      <div className='relative'>
        {
          isLoading
          ?
          <div className='absolute left-0 top-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center'>
            <LuLoaderCircle className='text-3xl text-white animate-spin'/>
          </div>
          :
          ''
        }
        <Line options={options} data={data} className='max-w-full shadow-lg bg-gray-800 text-sm md:text-base md:p-6 rounded mt-3'/>
      </div>
    </>
  )
}

export default LineGraph