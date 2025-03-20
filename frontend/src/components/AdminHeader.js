import React, { useRef } from 'react'
import { NavLink } from 'react-router-dom'

export default function AdminHeader() {
  const nav = useRef(null)

  const barclick=()=>{
    if(nav.current.style.width =="300px")
      nav.current.style.width="70px"
    else
      nav.current.style.width="300px"

  }

  return (
    <div className='nav' ref={nav}>
      <ul>
        <li>
            <span className='bar'><i className="fa-solid fa-bars" onClick={barclick}></i></span>
        </li>
        <li>
          <NavLink to="/Kqw86u/home">
            <span className='aicon'><i className="fa-solid fa-house"></i></span>
            <span className='title'>الصفحة الرئيسية</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Kqw86u/users">
            <span className='aicon'><i className="fa-solid fa-user"></i></span>
            <span className='title'>الطلاب</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Kqw86u/code">
            <span className='aicon'><i className="fa-solid fa-barcode"></i></span>
            <span className='title'>عمل كود</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Kqw86u/addteacher">
            <span className='aicon'><i className="fa-solid fa-person-chalkboard"></i></span>
            <span className='title'>اضافة مدرس</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Kqw86u/block">
            <span className='aicon'><i className="fa-regular fa-square"></i></span>
            <span className='title'>عمل قطعة</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Kqw86u/section">
            <span className='aicon'><i className="fa-solid fa-table-cells-large"></i></span>
            <span className='title'>عمل سيكشن</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Kqw86u/course">
            <span className='aicon'><i className="fa-solid fa-table-columns"></i></span>
            <span className='title'>عمل كورس</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Kqw86u/questions">
            <span className='aicon'><i className="fa-solid fa-question"></i></span>
            <span className='title'>اضافة سؤال</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Kqw86u/exams">
            <span className='aicon'><i className="fa-solid fa-sheet-plastic"></i></span>
            <span className='title'>اضافة امتحان</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Kqw86u/url">
            <span className='aicon'><i className="fa-solid fa-sitemap"></i></span>
            <span className='title'>الروابط</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Kqw86u/upload">
            <span className='aicon'><i className="fa-solid fa-upload"></i></span>
            <span className='title'>رفع ملف</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Kqw86u/product">
            <span className='aicon'><i className="fa-solid fa-cart-shopping"></i></span>
            <span className='title'>اضافة منتج</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Kqw86u/order">
            <span className='aicon'><i className="fa-solid fa-truck"></i></span>
            <span className='title'>طلبات المتجر</span>
          </NavLink>
        </li>
      </ul>
    </div>
  )
}
