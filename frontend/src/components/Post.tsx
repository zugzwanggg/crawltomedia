import { useState } from "react";

// icons
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { BiLike } from "react-icons/bi";
import ytLogo from "../assets/youtube-logo.svg";

type Props = {
  id: number|string,
  title: string,
  logo_path: string
}

const Post = ({id, title, logo_path}:Props) => {
  const [isActive, setIsActive] = useState(false);

  const handlePostClick = () => {
    if (isActive) {
      setIsActive(false)
    }
  }

  return (
    <li onClick={handlePostClick} className="relative mx-2 w-full bg-black aspect-post rounded overflow-hidden p-4 text-primaryColor">
      <div className="flex justify-between items-center">
        <BsThreeDotsVertical onClick={()=>setIsActive(prev=>!prev)} className="text-xl opacity-80 hover:opacity-100"/>
        <img src={logo_path} className="w-8 h-8 object-cover" />
      </div>

      {
        isActive
        ?
        <div className="absolute z-5 left-4 top-4 flex flex-col w-24 border bg-black rounded-md overflow-hidden">
          <button className="px-4 py-1 text-sm hover:opacity-80">
            Edit
          </button>
          <button className="px-4 py-1 text-sm">
            Delete
          </button>
        </div>
        :
        ''
      }
      <small className="w-fit absolute bottom-4">
        {
          title.length >= 20
          ?
          <>
            {title.slice(0, 20)}
            <span className="text-xl">...</span>
          </>
          :
          title
        } 
      </small>
      <ul className="flex flex-col justify-center h-full items-end gap-2">
        <li className="flex items-center text-sm gap-1">
          <FaRegEye className="text-lg"/>
          <span>
            0
          </span>
        </li>
        <li className="flex items-center text-sm gap-1">
          <BiLike className="text-lg"/>
          <span>
            0
          </span>
        </li>
      </ul>

    </li>
  )
}

export default Post