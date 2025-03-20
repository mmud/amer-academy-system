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

export default function Home() {
  const [loading, setloading] = useState(true);
  const [exmas, setexams] = useState([])
  const [num, setnum] = useState(1)
  const [refresh, setrefresh] = useState(1)

  const [year, setyear] = useState(0)
  const [term, setterm] = useState(0)
  
  //get codes
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };
    setloading(false);
    Axios.get( 
      BACKEND_DOMAIN+`/api/course/courses`,
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
  
    
  }, [num,refresh])
  
   
    //search
    const searchinput = useRef(null)

    const searchclick=(e)=>{
    e.preventDefault();
    setrefresh(refresh+1);

    }

      
  return (
    <>  
    {!loading?<LoadingSpinner/>:""}
     {//landing
      }
     
    <div className="admincont admin container">
    <div className='commands container'>

      <div className='container'>

      <div className="landing" style={{"backgroundColor":"transparent"}}>
          <img src={require("../images/loginlanding.png")} style={{"backgroundColor":"transparent","height":"unset","margin":"50px auto","display":"block"}} alt="" className="landimg"/>
          <div className="text">
              <h1 style={{"color":"#f48021"}}>أكاديمية عامر</h1>
              <p style={{  "textShadow": "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"}}>للرياضيات</p>
          </div>
      </div>


        <p style={{"margin":"25px","textAlign":"right","fontSize":"30px"}}>احدث الكورسات</p>
      </div>
          <div className='examescont container' style={{"justifyContent":"right"}}>
            {
            exmas&&exmas.slice(0,5).map((e,i)=>{
              return(
                <Link to={"/courses/"+e._id}>
                <div className="boxs" key={i}>
                <img src={BACKEND_DOMAIN+e.Img} alt=""/>
                  <div className="content">
                      <h2>{e.Name}</h2>
                      <p>
                        <span>{
                          e.Year==1?"الأول الثانوي":e.Year==2?"الثاني الثانوي":"الثالث الثانوي"
                          }</span>:السنة الدراسية
                      </p>
                      <p>
                        <span>{e.Term==1?"الأول":"الثاني"}</span>:الترم
                      </p>
                      <p style={{"display":"flex"}}>
                        <div>عدد الدروس:</div> <span>{e.Sections.length}</span>
                      </p>
                      <hr/>
                      <p style={{"textAlign":"end"}}>
                      إعداد: شعبان عامر
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
