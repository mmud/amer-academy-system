import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import  Axios  from 'axios'
import { BACKEND_DOMAIN } from '../tools'
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';

export default function Url () {

    let { id } = useParams();
    let navigate = useNavigate();

    
  const [qs, setqs] = useState([])
  const [num, setnum] = useState(1)
  const [refresh, setrefresh] = useState(1)
    useEffect(() => {
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
         };
        Axios.get( 
          BACKEND_DOMAIN+`/api/url/${id}`,
          config
        ).then((response)=>{
          setqs(response.data);
          window.location.href = response.data.Url;
        }).catch(e=>{

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
      
  return (
    <>
        <LoadingSpinner/>
    </>
  )
}
