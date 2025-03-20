import React,{useEffect, useRef, useState} from 'react'
import "./header.css"
import { NavLink,useNavigate,Link } from "react-router-dom";
import shlogo from "../images/sh.jpg"
import avatardefault from "../images/avatar.png"
import Axios from "axios"
import { parseJwt,BACKEND_DOMAIN } from '../tools';
import LoadingSpinner from './LoadingSpinner';
export default function PageHeader() {
  const Navigate = useNavigate();

  
  return (
    <>
      <header>
        <div className='container appheader'>
          <div className="head_container">
          <NavLink to="/" className="logo">
            <img src={shlogo} alt="logo"/>
          </NavLink>
        </div>
        </div>
      </header>
    </>
  )
}
