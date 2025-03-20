import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Navigate,useParams  } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import "./admin.css"
import "./exams.css"
import  * as Axios  from 'axios'
import { BACKEND_DOMAIN, MyContext } from '../tools'
import Swal from 'sweetalert2'
import LoadingSpinnerunvis from '../components/LoadingSpinnerunvis'
import LoadingSpinner from '../components/LoadingSpinner'
import defaultavatar from "../images/avatar.png"
import PageHeader from '../components/PageHeader'
import "./CoursePage.css"

export default function CoursePage() {
  let { id } = useParams();

  const [loading, setloading] = useState(true);
  const [course, setcourse] = useState([])
  const [refresh, setrefresh] = useState(1)
  const { Money, setMoney } = useContext(MyContext);


  //get codes
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };
    setloading(false);
    Axios.get( 
      BACKEND_DOMAIN+`/api/course/courses/${id}`,
      config
    ).then((response)=>{
      setloading(true);
      setcourse(response.data);
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
  

  const buysection=(id)=>{
    let cont=false;
    Swal.fire({
      title: 'هل تريد اكمال عملية الشراء؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("confirm")

    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };
    setloading(false);
    Axios.get( 
      BACKEND_DOMAIN+`/api/course/buysection/${id}`,
      config
    ).then((response)=>{
      setloading(true);
      console.log(response)
      setrefresh(refresh+1);
      setMoney(Money-response.data.Money)
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

    }
  })

  }

  return (
    <>  
    {!loading?<LoadingSpinner/>:""}
    <div className='container'>
    <div className="admincont admin container">
    <div className='commands container'>
      
    <h1 style={{"textAlign":"right"}}>{course&&course.Name}</h1>
    <p style={{"textAlign":"right","margin":"0 0 20px 0"}}>إعداد شعبان عامر</p>
    <img src={course&&BACKEND_DOMAIN+course.Img} alt='course img' style={{"width":"100%"}}/>


    {
      course.Sections&&course.Sections.map(s=><div className='section'>
         <div className='title'>
          {s.Name}
          {s.Isfree?<Link to={`/section/${s._id}`}><button>حصة مجانية</button></Link>:s.Have?<Link to={`/section/${s._id}`}><button>ابداء</button></Link>:<button onClick={()=>buysection(s._id)}>جنية {s.Price}</button>}
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

