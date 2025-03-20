import React,{useState} from 'react'
import "./register.css"
import Axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import shimg from "../images/sh.jpg"
import Swal from 'sweetalert2'
import { BACKEND_DOMAIN } from '../tools';
import sh3d from "../images/sh 3.png"
import LoadingSpinnerunvis from "../components/LoadingSpinnerunvis"
import { useParams } from 'react-router';

export default function ResetPassword() {
  const Navigate = useNavigate();
  const params = useParams();

  const [inputs,setInputs] = useState({
    Email:"",
    Password:""
  })

  const [loading, setloading] = useState(true);


  const handleChange=(e)=>{
    setInputs((prev)=>({

        ...prev,
        [e.target.name]: e.target.value
    }))
  }

  const submithandler=(e)=>{
    e.preventDefault();
    setloading(false);

    Axios.post( 
      BACKEND_DOMAIN+'/api/auth/resetpassword/'+params.token,
      inputs
    ).then((response)=>{
      console.log(response)
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
        icon: 'success',
        title: response.data.msg
      })
      Navigate("/login", {replace: true});
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
  


  return (
    <>
          {!loading?<LoadingSpinnerunvis/>:""}
    <form className="register-form">
      <div className='right'>
        <Link to="/">
        <img src={shimg} alt="logo" className='logo'/>
        </Link>
        <h1> تغير كلمة المرور</h1>
        <label>
          <div>
          كلمة المرور
          </div>
          <input type="password" placeholder="كلمة المرور" name='Password' onChange={handleChange}/>
        </label>
        <label>
          <div>
          تأكيد كلمة المرور
          </div>
          <input type="password" placeholder="تأكيد كلمة المرور" name='Password2' onChange={handleChange}/>
        </label>
        <button onClick={submithandler}>ارسال</button>
       
      </div>
      <div className='left'>
        <Link to="/" className='backtohome'>رجوع</Link>
        <img src={sh3d} alt="logo3d"/>
      </div>
    </form>
    </>
  )
}
