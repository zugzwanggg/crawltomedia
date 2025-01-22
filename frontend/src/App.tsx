import { Routes, Route, Navigate } from "react-router-dom";


// components
import Layout from "./components/Layout";

// pages
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import SocialApps from "./pages/SocialApps";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Language from "./pages/Language";
import Help from "./pages/Help";
import AddPost from "./pages/AddPost";
import ConfirmEmail from "./pages/ConfirmEmail";
import ResetPassword from "./pages/ResetPassword";
import PageNotFound from "./pages/PageNotFound";


// state
import { useAppSelector,useAppDispatch } from "./app/hooks";
import {useEffect} from "react";
import { fetchUserIsAuth } from "./features/user/userSlice";

// axios
import axios from "axios";

axios.defaults.withCredentials = true;

// multilang
import './utils/i18n';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import AppLoading from "./components/AppLoading";

function App() {
  const dispatch = useAppDispatch();
  const {lightMode, isAuth, isLoading} = useAppSelector((state)=>state.user);
  

  useEffect(() => {
    dispatch(fetchUserIsAuth());
  }, [])

  if (isLoading) {
    return <AppLoading/>
  }
  

  if (lightMode) {
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
  }

  return (
    <Routes>
      <Route element={isAuth ? <Layout/> : <Navigate to='/login'/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/posts" element={<Posts/>}/>
        <Route path="/posts/add" element={<AddPost/>}/> 
        <Route path="/settings" element={<Settings/>}>
          <Route path="profile" element={<Profile/>}/>
          <Route path="apps" element={<SocialApps/>}/>
          <Route path="language" element={<Language/>}/>
          <Route path="help" element={<Help/>}/>
        </Route>
      </Route>
      <Route path="/login" element={isAuth ? <Navigate to='/'/> : <Login/>}/>
      <Route path="/register" element={isAuth ? <Navigate to='/'/> : <Register/>}/>
      <Route path="/register/confirm" element={ isAuth ? <Navigate to='/'/> :<ConfirmEmail/>}/>
      <Route path="/login/reset" element={isAuth ? <Navigate to='/'/> : <ResetPassword/>}/>
    
      <Route path="/privacy" element={<PrivacyPolicy/>} />
      <Route path="/terms" element={<TermsAndConditions/>} />
      <Route path="*" element={<PageNotFound/>}/>
    </Routes>
  )
}

export default App
