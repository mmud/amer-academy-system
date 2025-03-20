import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Navigate } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import "./admin.css"
import "./exams.css"
import  * as Axios  from 'axios'
import { BACKEND_DOMAIN } from '../tools'
import Swal from 'sweetalert2'
import LoadingSpinnerunvis from '../components/LoadingSpinnerunvis'
import LoadingSpinner from '../components/LoadingSpinner'
import defaultavatar from "../images/avatar.png"
import PageHeader from '../components/PageHeader'
import { Helmet } from 'react-helmet-async'

export default function Skill() {
  
      
  return (
    <>  
      <Helmet>
        <title>المهارات</title>
        <meta name='description' content='افضا كورسات المهارات مثل البرمجة و الجرافيك الأن علي منصة عامر اكاديمي'/>
        <link rel='canonical' href='/exams'/>
      </Helmet>
    <div className="admincont admin container">
    <div className='commands container'>
     
          <div className='commands container'>
              <div className="heading">
                  <h2>المهارات</h2>
              </div>
          </div>

          <div className='examescont container'>
          
                <Link to="programing">
                  <div className="boxs" style={{"height":"300px","display":"flex","justifyContent":"center","alignItems":"center"}}>
                    <img src={require("../images/programing.png")} alt=""/>
                  </div>
                </Link>
                <Link to="graphic">
                  <div className="boxs" style={{"height":"300px","display":"flex","justifyContent":"center","alignItems":"center"}}>
                    <img src={require("../images/graphic.png")} alt=""/>
                  </div>
                </Link>
                <Link to="montage">
                  <div className="boxs" style={{"height":"300px","display":"flex","justifyContent":"center","alignItems":"center"}}>
                    <img src={require("../images/montage.png")} alt=""/>
                  </div>
                </Link>
                <Link to="art">
                  <div className="boxs" style={{"height":"300px","display":"flex","justifyContent":"center","alignItems":"center"}}>
                    <img src={require("../images/art.png")} alt=""/>
                  </div>
                </Link>
          </div>
    </div>
    </div>
    </>
  )
}
