import React,{useState} from 'react'
import "./register.css"
import Axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import shimg from "../images/sh.jpg"
import Swal from 'sweetalert2'
import { BACKEND_DOMAIN } from '../tools';
import sh3d from "../images/sh 3.png"
import LoadingSpinnerunvis from "../components/LoadingSpinnerunvis"
export default function Login() {
  const Navigate = useNavigate();

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
      BACKEND_DOMAIN+'/api/auth/login',
      inputs
    ).then((response)=>{
      console.log(response)
      localStorage.setItem("token",response.data.token);
      Navigate("/", {replace: true})
      window.location.reload();
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
        <h1>تسجيل الدخول</h1>
        <label>
          <div>
          البريد الألكتروني:
          </div>
          <input type="text" placeholder="البريد الألكتروني" name='Email' onChange={handleChange}/>
        </label>
        <label>
          <div>
          كلمة المرور:
          </div>
          <input type="password" style={{"marginBottom":"10px"}} placeholder="كلمة المرور" name='Password' onChange={handleChange}/>
        </label>
        <button onClick={submithandler}>تسجيل</button>
        <Link to="/register"  style={{"color":"#3f51b5","marginTop":"10px","display":"inline-block"}}>
          تسجيل مستخدم جديد
        </Link>
       
      </div>
      <div className='left'>
        <Link to="/" className='backtohome'>رجوع</Link>
        <img src={sh3d} alt="logo3d"/>
      </div>
    </form>
    </>
  )
}
