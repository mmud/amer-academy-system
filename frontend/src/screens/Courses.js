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

export default function Courses() {
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
      BACKEND_DOMAIN+`/api/course/courses?&s=${searchinput.current.value}&year=${year}&term=${term}`,
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

      <Helmet>
        <title>الكورسات التعليمية</title>
        <meta name='description' content='افضل الكورسات التعليمية للصفوف الثانوية الأن علي منصة عامر اكاديمي'/>
        <link rel='canonical' href='/courses'/>
      </Helmet>

    {!loading?<LoadingSpinner/>:""}
    <div className="admincont admin container">
    <div className='commands container'>
        <div className="heading">
            <h2>الكورسات</h2>
        </div>
        <div className='search container'>
            <form onSubmit={searchclick}> 
            <input type="text" placeholder="ابحث" ref={searchinput} name='search'/>
            <button  type="submit" ><i className="fa-solid fa-magnifying-glass"></i></button>
            </form>
        </div>
        <div className='filters container'>
        <label>         
            <select  name="Year" onChange={(e)=>setyear(e.target.value)}>
              <option value="0">اختار السنة</option>
              <option value="1">أولي ثانوي</option>
              <option value="2">ثانية ثانوي </option>
              <option value="3">ثالثة ثانوي</option>           
            </select>
          </label>
          <label>
            <select  name="Term" onChange={(e)=>setterm(e.target.value)}>
              <option value="">اختار الترم</option>
              <option value="1">الأول</option>
              <option value="2">الثاني</option>
            </select>
          </label>
          </div>

          <div className='examescont container'>
            {
            exmas&&exmas.map((e,i)=>{
              return(
                <Link to={e._id}>
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
