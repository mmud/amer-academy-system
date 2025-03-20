import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Navigate,useParams  } from 'react-router-dom'
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
import "./CoursePage.css"

export default function Mysections() {

  const [loading, setloading] = useState(true);
  const [sections, setsections] = useState([])
  const [refresh, setrefresh] = useState(1)


  //get codes
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };
    setloading(false);
    Axios.get( 
      BACKEND_DOMAIN+`/api/section/mysctions`,
      config
    ).then((response)=>{
      setloading(true);
      setsections(response.data);
      console.log(response.data)
    }).catch(e=>{
      setloading(true);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'error',
        title: e.response.data.msg
      })
    });
    
  }, [refresh])
  

  return (
    <>  
    {!loading?<LoadingSpinner/>:""}
    <div className='container'>
    <div className="admincont admin container">
    <div className='commands container'>
    <h1  style={{"textAlign":"center"}}>حصصي</h1>
    {
      sections&&sections.map(s=><div className='section'>
         <div className='title'>
          {s.Name}
          {<Link to={`/section/${s._id}`}><button>ابداء</button></Link>}
        </div>
        {
          s.Blocks.map(b=> <div className='block'>
                          {b.Name} {b.Type=="Video"?<i className="fa-solid fa-play"></i>:
                                    b.Type=="Content"?<i className="fa-solid fa-file-lines"></i>:
                                    b.Type=="Link"?<i className="fa-solid fa-link"></i>:
                                    <i className="fa-solid fa-question"></i>
                          }         
                          </div>)
        }
      </div>)
    }

    </div>
    </div>
    </div>
    </>)
  }

