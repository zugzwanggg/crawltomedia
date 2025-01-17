import Navbar from "./Navbar"
import { Outlet } from "react-router-dom"
import { useState } from "react";
import Header from "./Header";

const Layout = () => {
  const [isShort, setIsShort] = useState(false);

  return (
    <>
      <Navbar isShort={isShort} setIsShort={setIsShort}/>


      <div className={`${isShort ? 'lg:pl-24' : 'lg:pl-72'}`}>
        <Header/>
        <Outlet/>
      </div>

    </>
  )
}

export default Layout