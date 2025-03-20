import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Navigate, useParams } from 'react-router-dom'
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

export default function SkillPage() {
  let { skilltype } = useParams();

  const [loading, setloading] = useState(true);
  const [exmas, setexams] = useState([])
  const [refresh, setrefresh] = useState(1)
  
  //get codes
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };
    setloading(false);
    Axios.get( 
      BACKEND_DOMAIN+`/api/course/courses?year=${skilltype}`,
      config
    ).then((response)=>{
      setloading(true);
      setexams(response.data);
      console.log(response.data);

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
  
   
    //search
    const searchinput = useRef(null)

    const searchclick=(e)=>{
    e.preventDefault();
    setrefresh(refresh+1);

    }

      
  return (
    <>  
    {!loading?<LoadingSpinner/>:""}
    <div className="admincont admin container">
    <div className='commands container'>
        <div className="heading">
            <h2>{skilltype=="programing"?"كورسات البرمجة":
                skilltype=="graphic"?"كورسات الجرافيك":
                skilltype=="art"?"كورسات الرسم":
                skilltype=="montage"?"كورسات المونتاج":""
                
                }</h2>
        </div>
        {(exmas === undefined || exmas.length == 0)?<div className="main" style={{"position":"fixed"}}>قريبا</div>:""}
          <div className='examescont container'>
            {
            exmas.map((e,i)=>{
              return(
                <Link to={"/courses/"+e._id}>
                <div className="boxs" key={i}>
                <img src={BACKEND_DOMAIN+e.Img} alt=""/>
                  <div className="content">
                      <h2>{e.Name}</h2>
                      <p style={{"display":"flex"}}>
                        <div>عدد الدروس:</div> <span>{e.Sections.length}</span>
                      </p>
                  </div>
              </div>
              </Link>
              )
            })
          }
          </div>
    </div>
    </div>
    </>
  )
}
