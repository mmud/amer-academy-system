import React,{useContext, useEffect, useRef, useState} from 'react'
import "./header.css"
import { NavLink,useNavigate,Link } from "react-router-dom";
import shlogo from "../images/sh.jpg"
import avatardefault from "../images/avatar.png"
import Axios from "axios"
import { parseJwt,BACKEND_DOMAIN, MyContext } from '../tools';
import LoadingSpinner from './LoadingSpinner';
export default function Header() {
  const Navigate = useNavigate();
  const sidenav = useRef(null)
  const dropdown = useRef(null)

  const [loading, setloading] = useState(false)

  const logout=()=>{
    localStorage.setItem("token",null);
    Navigate("/", {replace: true})
    window.location.reload();
  }

  const { Money, setMoney } = useContext(MyContext);

    const [avatar, setavatar] = useState(null);
    useEffect(() => {
      const config = {
       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      };

      Axios.get( 
      BACKEND_DOMAIN+`/api/auth/getme`,
      config,
      ).then((Response)=>{
        setavatar(Response.data.avatar);
        setMoney(Response.data.money)
        localStorage.setItem("avatar",Response.data.avatar)
        setloading(true);
    }).catch((e)=>{
      if(e.response.data === "not authorized")
      {
        logout();
      }
    });

  }, [])
  
  
  return (
    <>
      <header>
        <div className='container appheader'>
          <div className="head_container">
          <NavLink to="/" className="logo">
            <img src={shlogo} alt="logo"/>
          </NavLink>
          <div className="menu" id="myTopnav">
            <ul style={{"display":"flex","alignItems":"center","position":"relative"}}>
              <div className='icon' onClick={()=>sidenav.current.style.width="250px"}>&#9776;</div>
              <li><NavLink to="/skill">المهارات</NavLink></li>
              <li><NavLink to="/calc"> الالة الحاسبة</NavLink></li>
              <li><NavLink to="/products"> المتجر</NavLink></li>
              <li><NavLink to="/exams"> الأختبارات</NavLink></li>
              <li><NavLink to="/courses"> الكورسات</NavLink></li>
              <li><NavLink to="/">الصفحة الرئيسية</NavLink></li>
              <NavLink to="/wallet" className="walletdiv">
                <i className="fa-solid fa-wallet"></i>
                <div className='money'>{Money} جنية </div>
              </NavLink>
              <div className='avatardiv' style={{"position":"relative"}}>
                <img src={avatar?avatar:avatardefault} alt="avatar" className='avatar' onClick={()=>dropdown.current.classList.toggle("active")}/>
                <div className='dropdown' ref={dropdown}>
                  {localStorage.getItem("token")!=="null"?<NavLink to="/settings"> الأعدادات </NavLink>:""}
                  {localStorage.getItem("token")!=="null"?<NavLink to="/mysections"> حصصي </NavLink>:""}
                  {parseJwt(localStorage.getItem("token"))?.role==="nd"?<NavLink to="/Kqw86u/home"> admin </NavLink>:""}
                  {localStorage.getItem("token")!=="null"?<span onClick={logout}> تسجيل الخروج </span>:""}
                </div>
              </div>
            </ul>
          </div>
        </div>
        </div>
      </header>
      
      {!loading?<LoadingSpinner/>:""}

      <div id="mySidenav" className="sidenav" ref={sidenav}>
        <div className='icon x' onClick={()=>sidenav.current.style.width="0"}>&times;</div>
          <li><NavLink to="/">الصفحة الرئيسية</NavLink></li>
          <li><NavLink to="/courses"> الكورسات</NavLink></li>
          <li><NavLink to="/exams"> الاختبارات</NavLink></li>
          <li><NavLink to="/products"> المتجر</NavLink></li>
          <li><NavLink to="/calc"> الالة الحاسبة</NavLink></li>
          <li><NavLink to="/skill">المهارات</NavLink></li>
      </div>
    </>
  )
}

/**
 * <div className='container'>
            <NavLink to="/" className="logo"> Auth </NavLink>
            <nav>
                {localStorage.getItem("token")!=="null"?<NavLink to="/profile"> profile </NavLink>:""}
                {parseJwt(localStorage.getItem("token"))?.role==="admin"?<NavLink to="/admin"> admin </NavLink>:""}
                {localStorage.getItem("token")==="null"?<NavLink to="/register"> register </NavLink>:""}
                {localStorage.getItem("token")==="null"?<NavLink to="/login"> login </NavLink>:""}
                {localStorage.getItem("token")!=="null"?<span onClick={logout}> logout </span>:""}
            </nav>
        </div>
 * 
 * 
 * 
 */