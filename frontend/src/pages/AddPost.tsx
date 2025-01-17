import { useEffect, useState } from "react"
import axios from "axios";

// icons
import { RiAiGenerate2 } from "react-icons/ri";
import { FaPhotoVideo } from "react-icons/fa";
import { RiArrowRightSLine } from "react-icons/ri";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";

// types
import { TypeApp } from "../types";
import { useAppSelector } from "../app/hooks";

const AddPost = () => {
  const {t} = useTranslation();
  const {user} = useAppSelector(state=>state.user);
  const userId = user?.id;

  const [app, setApp] = useState('overall');

  const [files, setFiles] = useState<File[]|FileList>([]);
  const [filePaths, setFilePaths] = useState<string[]>([])
  const [text, setText] = useState('');

  const [forKids, setForKids] = useState(false)
  
  const handleAppChange = (app:string) => {
    setApp(app)
  }
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }
  const [fileIndex, setFileIndex] = useState(0)
  const [dragging, setDragging] = useState(false);

  const [userData, setUserData] = useState<TypeApp[]>([]);

  const fetchUserApps = async () => {
    try {

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/apps/${userId}`);
      setUserData(res.data)
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUserApps()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files); 
      setFiles(filesArray);
      Promise.all(
        filesArray.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => {
                if (reader.result && typeof reader.result === "string") {
                  resolve(reader.result);
                }
              };
            })
        )
      ).then((paths) => setFilePaths(paths));
      }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false)
  }
  

  const handleFileDrop = (e:React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
  setFiles(droppedFiles);

  Promise.all(
    droppedFiles.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (reader.result && typeof reader.result === "string") {
              resolve(reader.result); 
            }
          };
        })
    )
  ).then((paths) => setFilePaths(paths));
  }


  const handlePostYtVideo =async () => {
    const formData = new FormData();
    if (files) {
      formData.append('video', files[0])
    }
    formData.append('user_id', user?.id.toString()!);
    formData.append('app_id', 1 + "");
    formData.append('title', 'My video title')
    formData.append('privacy', 'private')


    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/postApp`, formData, {headers: {"Content-Type": "multipart/form-data"}})
      console.log(res.data);
    } catch (error) {
      console.log(error);
      
    }
  }


  return (
    <div className="relative bg-primaryColor dark:bg-darkPrimaryColor dark:text-white m-6 py-6 lg:px-6 rounded-lg shadow-lg md:ml-8">
      
      {
        files.length <= 0 && filePaths.length <= 0
        ?
        <div onDrop={(e) => handleFileDrop(e)} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className={`${dragging ? 'bg-slate-200 dark:bg-zinc-700' : 'bg-primaryColor dark:bg-darkPrimaryColor'} flex flex-col gap-2 items-center justify-center z-20 w-full h-full top-0 left-0`}>
          <FaPhotoVideo className="text-9xl"/>
          <p>
            {t('add.drag')}
          </p>
          <button onClick={()=>document.getElementById('file')?.click()} className="rounded-md py-2 px-4 hover:opacity-70 bg-sky-500 text-white mt-4">
            {t('add.select_btn')}
          </button>
          <input id="file" className="hidden" onChange={(e)=>handleFileChange(e)} type="file" multiple={true}/>
        </div>
        :
        <div className="flex px-4 gap-10 justify-between items-center sm:items-start flex-col sm:flex-row">
          <div className="aspect-post h-fit w-full xs:w-80 sm:min-w-36 lg:w-96 bg-black flex items-center justify-center">
            {
              files.length > 1 && fileIndex !== 0
              ?
              <button onClick={()=>setFileIndex(prev => prev -= 1)} className="absolute text-white z-20 left-2 w-10 h-10 bg-black bg-opacity-55 hover:bg-opacity-100 rounded-full grid place-content-center">
                <RiArrowRightSLine className="text-xl rotate-180"/>
              </button>
              : 
              ''
            }
            {
              files.length > 0 && filePaths.length > 0
              ?
                files[fileIndex].type === "image/jpeg" || files[fileIndex].type === "image/jpg" || files[fileIndex].type === "image/png"
                ? 
                  <img className="w-full" src={filePaths[fileIndex]} alt={files[fileIndex].name} />
                :
                  <video src={filePaths[fileIndex]} className="aspect-post bg-black" controls contentEditable width="1080" height="1920">
                    {/* video */}
                  </video>
              :
              ''
            }
            {
              files.length > 1 && fileIndex !== files.length - 1
              ?
              <button onClick={()=>setFileIndex(prev => prev += 1)} className="absolute text-white right-2 z-20 w-10 h-10 bg-black bg-opacity-55 hover:bg-opacity-100 rounded-full grid place-content-center">
                <RiArrowRightSLine className="text-xl"/>
              </button>
              : 
              ''
            }
          </div>
          
          <div className="flex flex-col gap-6 w-full">
            <h1 className="text-2xl lg:text-4xl font-bold text-center sm:text-left">
              {t('add.title')}
            </h1>
            <ul className="flex items-center gap-2 overflow-x-auto">
              <li onClick={()=> handleAppChange('overall')} className={`
                ${
                  app == 'overall' 
                  ? 
                  'bg-darkPrimaryColor text-white dark:bg-whiteGray dark:text-darkPrimaryColor border-darkPrimaryColor' 
                  : 
                  ' bg-white dark:bg-grayColor'
                  } px-4 py-2 rounded cursor-pointer shadow`}>
                  {t('all')}
                </li>
                {
                  userData.map(item => {
                    return <li onClick={()=> handleAppChange(item.name)} className={`
                    ${
                      app == item.name 
                      ? 
                      'bg-darkPrimaryColor text-white dark:bg-whiteGray dark:text-darkPrimaryColor border-darkPrimaryColor' 
                      : 
                      ' bg-white dark:bg-grayColor'
                      } px-4 py-2 rounded cursor-pointer shadow`}>
                      {item.name}
                    </li>
                  })
                }
              </ul>
              {
                app === "YouTube"
                ?
                <input placeholder={"Your title"} type="text" className="shadow w-full bg-none border dark:border-grayColor rounded-lg resize-none p-4 bg-transparent outline-none"/>
                :
                ""
              }
            <div className="relative w-full">
              <textarea value={text} onChange={handleTextChange} placeholder={t('add.post_text_placeholder')} className="shadow w-full bg-none h-40 border dark:border-grayColor rounded-lg resize-none p-4 bg-transparent outline-none">
              </textarea>
            <div>
          </div>

            <button className="absolute right-0 top-0 btn-primary">
              <RiAiGenerate2 className="text-3xl"/>
            </button>
          </div>
          
          {
            app === "youtube"
            ?
            <div>
              <b>
                {t('add.auditory.title')}
              </b>
              <p className="font-light opacity-55 text-sm">
                {t('add.auditory.description')}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  {
                    forKids
                    ?
                    <RiCheckboxBlankCircleFill onClick={()=>setForKids(false)} className="text-2xl"/>
                    :
                    <RiCheckboxBlankCircleLine onClick={()=>setForKids(true)} className="text-2xl"/>
                  }
                  <p>
                    {t('add.auditory.for_kids')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {
                    forKids
                    ?
                    <RiCheckboxBlankCircleLine onClick={()=>setForKids(false)} className="text-2xl"/>
                    :
                    <RiCheckboxBlankCircleFill onClick={()=>setForKids(true)} className="text-2xl"/>
                  }
                  <p>
                    {t('add.auditory.not_for_kids')}
                  </p>
                </div>
              </div>
            </div>
            :
            ''
          }

          <div>
            <b>
              {t('add.who_can_see_it.title')}
            </b>
            <p className="font-light opacity-55 text-sm">
              {t('add.who_can_see_it.description')}
            </p>
            <select className="w-full mt-4 p-2 shadow rounded-lg outline-none dark:bg-grayColor">
              <option value="all">
                {t('add.who_can_see_it.everyone')}
              </option>
              <option value="adults">
              {t('add.who_can_see_it.friends')}
              </option>
              <option value="adults">
              {t('add.who_can_see_it.only_me')}
              </option>
            </select>
          </div>

          <button onClick={handlePostYtVideo} className="py-2 px-4 rounded-lg bg-sky-500 text-white hover:opacity-50">
            {t('add.post_btn')}
          </button>
        </div>
        </div>
        }
    </div>
  )
}

export default AddPost