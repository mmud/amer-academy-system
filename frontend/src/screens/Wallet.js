import React, { useContext, useEffect, useRef, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import  Axios  from 'axios';
import { BACKEND_DOMAIN, MyContext } from '../tools';
import { Navigate } from 'react-router';
import "./wallet.css"
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';

export default function Wallet() {
    const [loading, setloading] = useState(true)
    const { Money, setMoney } = useContext(MyContext);

    const logout=()=>{
        localStorage.setItem("token",null);
        Navigate("/", {replace: true})
        window.location.reload();
      }

      const [refresh, setrefresh] = useState(0)

    const codeinput = useRef(null)

    const addcode=()=>{


        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
           };
      
          setloading(false);
          Axios.post( 
            BACKEND_DOMAIN+`/api/code/add`,
            {Token:codeinput.current.value},
            config
          ).then((response)=>{
            setloading(true);
            setrefresh(refresh+1);
            setMoney(Money+response.data.Money)
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
              icon: 'success',
              title: "تمت العمليه بنجاح"
            })
        
          }).catch(e=>{
            setloading(true);
            if(e.response.data === "not authorized")
            {
              logout();
            }
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

  return (
    <>
      <Helmet>
        <title>المحفظة</title>
        <meta name='description' content='المحفظة الأن علي منصة عامر اكاديمي'/>
        <link rel='canonical' href='/exams'/>
      </Helmet>
        {!loading?<LoadingSpinner/>:""}
        <h1 className='hwallet'>المحفظة</h1>
        <div className='wallet'>
            <i className="fa-solid fa-wallet"></i>
            <div className='money'>{Money} جنية </div>
        </div>
        <div style={{"width":"max-content","margin":"auto"}} className="addmoney">
            <input ref={codeinput}  type="text" placeholder="الكود" name='Token'/>
            <button className='random' onClick={addcode} >اضافة</button>
        </div>
    </>
  )
}
