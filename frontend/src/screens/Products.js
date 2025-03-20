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

export default function Products() {
  const [loading, setloading] = useState(true);
  const [exmas, setexams] = useState([])
  const [refresh, setrefresh] = useState(1)
  const [points, setpoints] = useState(0)
  
  //get codes
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };
    setloading(false);
    Axios.get( 
      BACKEND_DOMAIN+`/api/product/products`,
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
  

  useEffect(() => {
    const config = {
     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    };

    Axios.get( 
    BACKEND_DOMAIN+`/api/auth/getme`,
    config,
    ).then((Response)=>{
      setpoints(Response.data.Points)
      localStorage.setItem("avatar",Response.data.avatar)
      setloading(true);
  }).catch((e)=>{
   
  });

}, [refresh])


const buy=(id)=>{
  let cont=false;
  Swal.fire({
    title: 'هل تريد اكمال عملية الشراء؟',
    input: 'text',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    text:"اسم السنتر و السنة الدراسية و معاد الحصة",
    inputPlaceholder: "اسم السنتر و السنة الدراسية و معاد الحصة"
  }).then((result) => {
    console.log(result)
    if (result.isConfirmed) {
      console.log("confirm")

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
   };
  setloading(false);
  Axios.post( 
    BACKEND_DOMAIN+`/api/product/buy/${id}`,
    {Details:result.value}
    ,
    config
  ).then((response)=>{
    setloading(true);
    console.log(response)
    setrefresh(refresh+1);
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

      <Helmet>
        <title>المتجر</title>
        <meta name='description' content='متجر الهداية الأن علي منصة عامر اكاديمي'/>
        <link rel='canonical' href='/products'/>
      </Helmet>
    {!loading?<LoadingSpinner/>:""}
    <div className="admincont admin container">
    <div className='commands container'>
        <div className="heading">
            <h2>المتجر</h2>
        </div>
        <div className='wallet'>
            <i className="fa-solid fa-coins"></i>
            <div className='money'> {points} نقطة </div>
        </div>

          <div className='examescont container'>
            {
            exmas.map((e,i)=>{
              return(
                <div className="boxs" key={i}>
                <img src={BACKEND_DOMAIN+e.Img} alt=""/>
                  <div className="content">
                      <h2 style={{"textAlign":"right","fontSize":"24px"}}>{e.Name}</h2>
                      <p style={{"display":"flex",
                      "justifyContent":"space-between",
                      "flexDirection":"row-reverse",
                      "alignItems":"center",
                      "color":"#f48021",
                      "fontSize":"20px"
                      }}>
                        <div >{e.Price} نقطة</div>
                        <button style={{"margin":"0"}} onClick={()=>buy(e._id)}>شراء</button>
                      </p>
                  </div>
              </div>
              )
            })
          }
          </div>
    </div>
    </div>
    </>
  )
}
