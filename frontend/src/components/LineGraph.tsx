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

// types
import { IMediaStats } from '../types';

type Params = {
  stats: IMediaStats[]
}

const LineGraph = ({stats}:Params) => {
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
        data: [stats[0]?.views || 0, 
        stats[1]?.views || 0, 
        stats[2]?.views || 0, stats[4]?.views || 0, stats[5]?.views || 0, stats[6]?.views || 0],
        borderColor: "rgb(75, 192, 192)"
      }
    ]
  };

  return (
    <>
      <h2 className='font-semibold text-2xl mt-10'>Views</h2>
      <Line options={options} data={data} className='max-w-full shadow-lg bg-gray-800 p-6 rounded mt-3'/>
    </>
  )
}

export default LineGraph