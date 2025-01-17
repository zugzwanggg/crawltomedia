import {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppSelector } from "../app/hooks";

// icons
import { FaCircleUser } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { LuLoaderCircle } from "react-icons/lu";

// types
import { IUser } from "../types";
import { useTranslation } from "react-i18next";


const Profile = () => {
  const {t} = useTranslation();

  const {user} = useAppSelector(state=>state.user);
  const userId = user?.id;

  const nav = useNavigate();

  const [userData, setUserData] = useState<IUser|null>(null);

  const [isSubmitActive, setIsSubmitActive] = useState(false);
  const [username, setUsername] = useState('');
  const [userPic, setUserPic] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isPicLoading, setIsPicLoading] = useState(false);;
  // const [error,setError] = useState('');

  const fetchUserData = async () => {
    setIsPicLoading(true)
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/getUser/${userId}`);
      setUserData(res.data);
      setUsername(res.data.username);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);;
      setIsPicLoading(false);
    }
  }

  useEffect(()=> {
    fetchUserData();
  }, []);

  const handleUserPicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUserPic(e.target.files[0]);
    }
  };

  useEffect(()=> {
    if (userPic !== null) {
      updateUserPicture()
    }
  }, [userPic])

  const updateUserPicture = async () => {
    setIsPicLoading(true)
    const formData = new FormData();
    if (userPic) {
      formData.append('user_pic', userPic);
    }
    formData.append('user_id', userId + '');
    try {

      await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/updateUserPicture`, formData, {headers: {"Content-Type": "multipart/form-data"}});
    } catch (error) {
      console.log(error);
    } finally {
      setIsPicLoading(false);
    }
  }
  
  const handleUsernameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
    setIsSubmitActive(true)
  }


  const handleUserUpdate = async () => {
    setIsLoading(true)
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/updateProfile`, {user_id: userId, username});
      fetchUserData();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-10">
        <IoIosArrowBack onClick={()=>nav(-1)} className="text-3xl hover:opacity-55 md:hidden"/>
        <h2 className="font-bold text-lg">
          {t('settings.edit.title')}
        </h2>
      </div>
      <div className="md:hidden grid place-content-center">
        {
          userData?.user_pic === null
          ?
          <FaCircleUser className="text-8xl dark:text-white text-grayColor"/>
          :
          <img src={userData?.user_pic} className="w-20 h-20 bg-black rounded-full" alt="User img" />
        }
      </div>
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            {
              isPicLoading || isLoading
              ?
              <div className="flex items-center justify-center min-w-16 w-16 h-16 rounded-full bg-black">
                <LuLoaderCircle className="text-3xl animate-spin"/>
              </div>
              :
              userData?.user_pic === null
              ?
              <FaCircleUser className="text-6xl dark:text-white text-grayColor"/>
              :
              <img src={userData?.user_pic} className="min-w-16 w-16 h-16 bg-black rounded-full" alt="User img" />
            }
            {
              
            }
          </div>
          <div>
            <h3 className="text-xl md:text-2xl">
              {userData?.username}
            </h3>
            <p className="text-sm md:text-base opacity-80">
              {userData?.email}
            </p>
          </div>
        </div>
        <button onClick={()=>document.getElementById('user-pic')?.click()} className="btn-primary text-sm ">
          {t('settings.edit.change_btn')}
        </button>
        <input accept="image/png, image/jpeg" className="hidden" onChange={(e)=>handleUserPicChange(e)} type="file" id="user-pic" name="user_pic" />
      </div>

      <div className="py-10 flex flex-col gap-10">
        <label className="flex flex-col gap-2">
          {t('settings.edit.username')}
          <input value={username} onChange={(e)=>handleUsernameChange(e)} className="w-full bg-transparent py-2 rounded-lg px-4 border-2 border-darkPrimaryColor dark:border-white" type="Change user name" />
        </label>
      </div>

      <div className="flex justify-end">
        <button onClick={handleUserUpdate} className={`${isSubmitActive ? 'opacity-100 hover:opacity-55' : 'opacity-35'} py-3 px-10 rounded-lg text-white bg-sky-500`}>
          {
            isLoading
            ?
            <LuLoaderCircle className="text-2xl animate-spin"/>
            :
            t('submit_btn')
          }
        </button>
      </div>
    </div>
  )
}

export default Profile