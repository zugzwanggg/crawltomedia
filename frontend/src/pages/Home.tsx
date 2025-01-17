import SocMedias from "../components/SocMedias"
import LineGraph from "../components/LineGraph"
import DailyStats from "../components/DailyStats"

import { useTranslation } from "react-i18next"

const Home = () => {
  const {t} = useTranslation();

  return (
    <div className="lg:p-4 dark:text-white">
      <h1 className="text-2xl lg:text-5xl font-bold my-8 pl-2">
        {t('home.title')}
      </h1>

      <div className="flex flex-wrap lg:flex-nowrap px-4 gap-4">
        <LineGraph/>
        <div className="flex flex-wrap w-full md:flex-row md:flex-nowrap lg:flex-col lg:w-1/3 gap-4">
          <SocMedias/>
          <DailyStats/>
        </div>
      </div>
    </div>
  )
}

export default Home