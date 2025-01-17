import { useTranslation } from "react-i18next";

// icons
import { FaRegEye } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { BiLike } from "react-icons/bi";

const DailyStats = () => {
  const {t} = useTranslation();

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