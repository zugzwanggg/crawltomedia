import { useNavigate } from "react-router-dom";


// icons
import { IoIosArrowBack } from "react-icons/io";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { handleLangChange } from "../features/user/userSlice";




const Language = () => {
  const {t} = useTranslation();

  const {lang} = useAppSelector(state=>state.user);
  const dispatch = useAppDispatch();

  const nav = useNavigate()

  const handleChange = (lng:string) => {
    if (lng === lang) {
      return;
    }
    dispatch(handleLangChange(lng))
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-10">
        <IoIosArrowBack onClick={()=>nav(-1)} className="text-3xl hover:opacity-55"/>
        <h2 className="font-bold text-lg">
          {t('settings.lang.title')}
        </h2>
      </div>

      <div>
        <div>
          <b>
            {t('settings.lang.app')}
          </b>
          <p className="font-light opacity-55">
          {t('settings.lang.app_description')}
          </p>
        </div>

        <ul className="pt-4">
          <li onClick={()=>handleChange('en')} className="cursor-default p-4 flex items-center justify-between rounded-md hover:bg-darkPrimaryColor dark:hover:bg-grayColor dark:hover:bg-opacity-100  hover:bg-opacity-5">
            <span>English</span>
            {
              lang === "en"
              ?
              <RiCheckboxCircleFill className="text-2xl" />
              :
              <RiCheckboxBlankCircleLine className="text-2xl" />
            }
          </li>
          <li onClick={()=>handleChange('ru')} className="cursor-default p-4 flex items-center justify-between rounded-md hover:bg-darkPrimaryColor dark:hover:bg-grayColor dark:hover:bg-opacity-100 hover:bg-opacity-5">
            <span>Русский</span>
            {
              lang === "ru"
              ?
              <RiCheckboxCircleFill className="text-2xl" />
              :
              <RiCheckboxBlankCircleLine className="text-2xl" />
            }
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Language