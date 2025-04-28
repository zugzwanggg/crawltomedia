import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";
import axios from "axios";
import Post from "../components/Post";

// icons
import { LuLoaderCircle } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";



// types
import { IPost, TypeApp } from "../types";
import { useTranslation } from "react-i18next";

type TypePagination = {
  next: {
    page: number
  },
  previous: {
    page: number
  }
}

const Posts = () => {
  const {t} = useTranslation();

  const { user } = useAppSelector(state=>state.user);
  const userId = user?.id;

  const [posts, setPosts] = useState<IPost[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<TypePagination|null>(null);

  const [search, setSearch] = useState('');


  const [isAppBtnActive, setIsAppBtnAcitve] = useState(false);
  const [filterApp, setFilterApp] = useState('');

  const todaysDate = new Date();
  const [date, setDate] = useState<Date>(new Date());

  const [apps, setApps] = useState<TypeApp[]>([])
  
  
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserPosts = async (app:string = '', p:number=1 , d:Date|string=date,s:string='') => {
    setIsLoading(true);
    
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/posts/${userId}?p=${p}&app=${app}&date=${d}&q=${s}`);
      setTotalPage(res.data.totalPage);
      setPosts(res.data.posts);
      setApps(res.data.apps);
      setPagination(res.data.results);
      console.log(res.data);
      
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleAppFilterBtn = () => {
    setIsAppBtnAcitve(prev=>!prev);
  }

  const handleSelectApp = (app:string) => {
    setIsAppBtnAcitve(false);
    setFilterApp(app);
    fetchUserPosts(app);
    setPage(1);
  }

  useEffect(()=> {
    fetchUserPosts();
  }, [])

  const handlePageChange = (page:number) => {
    fetchUserPosts(filterApp, page, date);
    setPage(page);
  }

  const handleDateChange = (date:Date) => {
    fetchUserPosts(filterApp, 1, date, search);
    setDate(date);
    setFilterApp('');
  }
  
  const handleSearch = (search:string) => {
    fetchUserPosts(filterApp, page, date, search);
    setSearch(search);
  }


  return (
    <div className="mx-2 lg:mx-0 lg:p-4 dark:text-white">
      <h1 className="text-2xl lg:text-5xl font-bold my-8 pl-2">
        {t('posts.title')}
      </h1>

      <div className=" lg:ml-4 bg-primaryColor shadow-md dark:bg-darkPrimaryColor py-4 rounded-lg ">
        <div className="px-2 lg:py-6 lg:px-10 mb-6">
          <div className="flex items-center justify-between gap-2 mb-6">
            <form className="relative overflow-hidden lg:w-1/4">
              <input onChange={(e)=>handleSearch(e.target.value)} className="w-full p-2 rounded-xl border-2 border-whiteGray outline-none dark:border-grayColor dark:bg-darkPrimaryColor" type="text" placeholder="Search post"/>
              <FiSearch className="text-xl absolute z-0 right-2 top-1/2 -translate-y-1/2 text-gray-600 dark:text-white"/>
            </form>
            <Link to='add' className="btn-primary min-w-fit">
              {t('posts.add_btn')}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-lg hover:shadow-sm">
              <input onChange={(e)=>handleDateChange(new Date(e.target.value))} defaultValue={todaysDate.toLocaleDateString('en-CA')} max={todaysDate.toLocaleDateString('en-CA')} className="py-1 px-2 border-2 dark:border-grayColor dark:bg-darkPrimaryColor rounded-lg flex items-center gap-1" type="date" />
            </div>
            <div className="relative rounded-lg hover:shadow-sm">
              <button onClick={()=>handleAppFilterBtn()} className="py-1 px-2 border-2 dark:border-grayColor rounded-lg flex items-center gap-1">
                {filterApp === '' ? t('settings.app') : filterApp} <IoIosArrowDown className={`${isAppBtnActive ? 'rotate-180' : ''} text-xl`}/>
              </button>
              {
                isAppBtnActive
                ?
                <ul className="absolute top-full mt-2 rounded-md overflow-hidden z-10 border-2 bg-primaryColor dark:border-grayColor dark:bg-grayColor">
                  <li onClick={()=>handleSelectApp('')} className="p-2 text-sm cursor-pointer hover:opacity-75">
                    {t('all')}
                  </li>
                  {
                    apps.map(item => {
                      return <li onClick={()=>handleSelectApp(item.name)} className="p-2 text-sm cursor-pointer hover:opacity-75">
                      {item.name}
                    </li>
                    })
                  }
                </ul>
                :
                ''
              }
            </div>
          </div>

        </div>

        <ul className="relative left-0 grid grid-cols-1 xs:grid-cols-2 place-content-center md:grid-cols-3 lg:grid-cols-4 gap-2 flex-wrap md:px-10">
          
          {
            isLoading
            ?
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <LuLoaderCircle className="text-4xl animate-spin"/>
            </div>
            :
            ''
          }
          {
            
            posts.length > 0
            ?
            posts.map(post => {
              return <Post link={post.link} key={post.id} id={post.id} title={post.title} logo_path={post.logo_path}/>
            })
            :
            <p className="py-10 w-full text-center">
              {isLoading ? '' : t('empty')}
            </p>
          }

        </ul>
        <div className={`${totalPage >= 1 ? 'flex' : 'hidden'} items-center justify-between mt-4 p-4`}>
          <p className="text-zinc-500 lg:p-4">
            1-4 of {totalPage} elements
          </p>
          <div className="flex items-center gap-1 text-white dark:text-black">
            {
              pagination?.previous
              ?
              <button onClick={()=>handlePageChange(pagination?.previous.page)} className="grid place-content-center border-2 bg-darkPrimaryColor w-10 h-10 rounded-lg dark:bg-grayColor dark:text-white dark:border-none dark:hover:bg-zinc-700">
                <IoIosArrowDown className="rotate-90 text-xl"/>
              </button>
              :
              <button disabled className="disabled:opacity-70 grid place-content-center border-2 bg-darkPrimaryColor w-10 h-10 rounded-lg dark:bg-grayColor dark:text-white dark:border-none dark:hover:bg-zinc-700">
                <IoIosArrowDown className="rotate-90 text-xl"/>
              </button>
            }
            <ul className="flex items-center gap-1">
              {
                pagination?.previous
                ?
                <li onClick={()=>handlePageChange(pagination?.previous.page)} className="cursor-pointer font-semibold grid place-content-center border-2 text-darkPrimaryColor w-10 h-10 rounded-lg dark:bg-grayColor dark:text-white dark:border-none">
                  {pagination?.previous.page}
                </li>
                :
                ''
              }
              <li className={`bg-darkPrimaryColor cursor-pointer font-semibold grid place-content-center border-2 w-10 h-10 rounded-lg dark:bg-white dark:border-none`}>
                { page }
              </li>
              {
                pagination?.next
                ?
                <li onClick={()=>handlePageChange(pagination?.next.page)} className="cursor-pointer font-semibold grid place-content-center border-2 text-darkPrimaryColor w-10 h-10 rounded-lg dark:bg-grayColor dark:text-white dark:border-none">
                  {pagination?.next.page}
                </li>
                :
                ''
              }
              
              {/* <p className="w-10 text-center text-darkPrimaryColor dark:text-white">
                ...
              </p> */}
            </ul>
            {
              pagination?.next
              ?
              <button onClick={()=>handlePageChange(pagination?.next.page)} className="grid place-content-center border-2 bg-darkPrimaryColor w-10 h-10 rounded-lg dark:bg-grayColor dark:text-white dark:border-none dark:hover:bg-zinc-700">
                <IoIosArrowDown className="-rotate-90 text-xl"/>
              </button>
              :
              <button disabled className="disabled:opacity-70 grid place-content-center border-2 bg-darkPrimaryColor w-10 h-10 rounded-lg dark:bg-grayColor dark:text-white dark:border-none dark:hover:bg-zinc-700">
                <IoIosArrowDown className="-rotate-90 text-xl"/>
              </button>
            }
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Posts