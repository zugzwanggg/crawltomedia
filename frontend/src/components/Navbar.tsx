import { Link, NavLink } from "react-router-dom";

// icons
import logoIcon from "../assets/logo.png";
import logoLightIcon from "../assets/logoLight.png";
import { RiHome5Line } from "react-icons/ri";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FaChevronRight } from "react-icons/fa";
import { MdLightMode } from "react-icons/md";
import { MdNightlight } from "react-icons/md";
import { LuSettings } from "react-icons/lu";

// state
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { handleTheme } from "../features/user/userSlice";

// translation
import { useTranslation } from "react-i18next";

type Props = {
  isShort: boolean,
  setIsShort: (value: boolean|((prev:boolean) => boolean)) => void
}

const Navbar = ({isShort, setIsShort}:Props) => {
  const {t} = useTranslation();

  const {lightMode} = useAppSelector(state=>state.user);
  const dispatch = useAppDispatch();


  const handleLightClick = () => {
    if (isShort) {
      return dispatch(handleTheme(false))
    }
    return dispatch(handleTheme(true))
  }

  const handleDarkClick = () => {
    if (isShort) {
      return dispatch(handleTheme(true))
    }
    return dispatch(handleTheme(false))
  }

  return (
    <div className={`${isShort ? 'w-full lg:w-fit' : 'w-full lg:w-72'} lg:border-r-4 border-solid border-r-whiteGray dark:border-r-black flex justify-center lg:flex-col lg:justify-between fixed z-50 lg:py-9 px-6 bottom-0 lg:h-full lg:top-0 left-0 bg-primaryColor dark:bg-darkPrimaryColor`}>
      <nav className="flex flex-col gap-14">
        <Link to='/' className="hidden lg:flex items-center gap-4">
          <img className="w-16 h-16 rounded-2xl dark:hidden" src={logoLightIcon} alt="logo" />
          <img className="w-16 h-16 rounded-2xl hidden dark:block" src={logoIcon} alt="logo" />
          <h3 className={`${isShort ? 'hidden' : ''} dark:text-white text-xl font-semibold`}>
            crawltomedia
          </h3>
        </Link>
        <ul className="flex lg:flex-col gap-3">
          <li>
            <NavLink to='/' className={({isActive}) => `${isActive ? 'bg-darkPrimaryColor dark:bg-grayColor text-white shadow-2xl' : 'dark:text-white dark:opacity-55 dark:hover:opacity-100'} py-2 px-4 rounded-lg flex items-center gap-2 `}>
              <RiHome5Line className="text-3xl"/>
              <p className={`${isShort ? 'hidden' : 'hidden md:block'} `}>
                {t('home.title')}
              </p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/posts' className={({isActive}) => `${isActive ? 'bg-darkPrimaryColor dark:bg-grayColor text-white shadow-2xl' : 'dark:text-white dark:opacity-55 dark:hover:opacity-100'} py-2 px-4 rounded-lg flex items-center gap-2 `}>
              <HiOutlineDocumentReport className="text-3xl"/>
              <p  className={`${isShort ? 'hidden' : 'hidden md:block'} `}>
              {t('posts.title')}
              </p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/settings/' className={({isActive}) => `${isActive ? 'bg-darkPrimaryColor dark:bg-grayColor text-white shadow-2xl' : 'dark:text-white dark:opacity-55 dark:hover:opacity-100'} py-2 px-4 rounded-lg flex items-center gap-2`}>
              <LuSettings className="text-3xl"/>
              <p  className={`${isShort ? 'hidden' : 'hidden md:block'} `}>
                {t('settings.title')}
              </p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/posts/add' className={`bg-black text-center text-white dark:bg-white py-2 px-4 rounded-lg flex items-center gap-2`}>
              <p  className={`${isShort ? 'hidden' : 'hidden md:block'} `}>
                {t('posts.add_btn')}
              </p>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div onClick={()=>setIsShort(prev=>!prev)} className={`${isShort ? '-right-6' : '-right-5'} hidden absolute top-16 w-10 h-10 bg-zinc-900 text-white lg:grid place-content-center rounded-full hover:bg-zinc-600`}>
        {
          isShort
          ?
          <FaChevronRight className="text-lg font-bold"/>
          :
          <FaChevronRight className="text-lg font-bold rotate-180"/>
        }
      </div>


      <div className={`${isShort ? 'w-12 h-12 rounded-full' : 'py-2 px-4 rounded-xl flex items-center gap-4'} hidden lg:flex relative overflow-hidden shadow-lg bg-white dark:border-none dark:bg-grayColor dark:bg-opacity-55`}>
        <button onClick={()=>handleLightClick()} className={`${isShort ? 'dark:hidden grid place-content-center' : 'flex items-center gap-2' } relative ${lightMode ? 'text-white' : 'dark:text-white dark:opacity-55'} z-10 w-full h-full`}>
          <MdLightMode className="text-2xl"/>
          <p className={`${isShort ? 'hidden' : ''}`}>
            {t('theme.light')}
          </p>
        </button>
        <button onClick={()=>handleDarkClick()} className={`${isShort ? 'hidden dark:grid place-content-center' : 'flex items-center gap-2' } relative ${lightMode ? 'dark:text-white dark:opacity-55' : 'text-white'} z-10 w-full h-full`}>
          <MdNightlight className="text-2xl"/>
          <p className={`${isShort ? 'hidden' : ''}`}>
          {t('theme.dark')}
          </p>
        </button>

        <div className={`${isShort ? 'w-full h-full left-0 top-0 rounded-full' : `w-1/2 ${lightMode ? '' : 'translate-x-28'}  h-8 rounded-xl left-1`} duration-500 absolute  bg-black dark:bg-grayColor`}>
          {/* Indicator */}
        </div>
      </div>
    </div>
  )
}

export default Navbar