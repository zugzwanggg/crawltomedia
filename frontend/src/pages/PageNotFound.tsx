import { Link } from "react-router-dom";

import { TbError404 } from "react-icons/tb";

const PageNotFound = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold dark:text-white">
        Page doesn't exist
      </h1>
      <TbError404 className="text-9xl text-sky-500"/>
      <p className="dark:text-white">Return to home page. <Link className="text-sky-500 underline" to='/'>Return</Link></p>
    </div>
  )
}

export default PageNotFound