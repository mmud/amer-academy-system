import React,{useState} from 'react'
import "./register.css"
import Axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import shimg from "../images/sh.jpg"
import Swal from 'sweetalert2'
import { BACKEND_DOMAIN } from '../tools';
import sh3d from "../images/sh 3.png"
import LoadingSpinnerunvis from "../components/LoadingSpinnerunvis"

export default function Register() {
  const Navigate = useNavigate();

  const [inputs,setInputs] = useState({
    UserName:"",
    Email:"",
    Password1:"",
    Password2:"",
    Year:0
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
      BACKEND_DOMAIN+'/api/auth/register',
      inputs
    ).then((response)=>{
      console.log(response)
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
        title: "تم انشاء الحساب الرجاء التواصل مع الدعم الفني للتفعيل"
      })
      Navigate("/login", {replace: true})
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
        <h1>تسجيل مستخدم جديد</h1>
        <label>
          <div>
          الأسم:
          </div>
          <input type="text" placeholder="الأسم" name='UserName' onChange={handleChange}/>
        </label>
        <label>
          <div>
          البريد الألكتروني:
          </div>
          <input type="text" placeholder="البريد الألكتروني" name='Email' onChange={handleChange}/>
        </label>
        <label>
          <div>
          رقم الهاتف:
          </div>
          <input type="text" placeholder="رقم الهاتف" name='Phone' onChange={handleChange}/>
        </label>
        <label>
          <div>
          كلمة المرور:
          </div>
          <input type="password" placeholder="كلمة المرور" name='Password1' onChange={handleChange}/>
        </label>
        <label>
          <div>
          تأكيد كلمة المرور:
          </div>
          <input type="password" placeholder="تأكيد كلمة المرور" name='Password2' onChange={handleChange}/>
        </label>
        <label>
          <div>
            السنة الدراسية:
          </div>
        </label>

      <div className="radio-with-Icon" style={{"marginBottom":"30px"}}>
        <p className="radioOption-Item">
          <input type="radio" name="Year" id="BannerType1" value="1" className="ng-valid ng-dirty ng-touched ng-empty" onChange={handleChange} />
          <label htmlFor="BannerType1">
            <i className="fa-solid fa-graduation-cap" />
            الصف الأول الثانوي
          </label>
        </p>
        <p className="radioOption-Item">
          <input type="radio" name="Year" id="BannerType2" value="2" className="ng-valid ng-dirty ng-touched ng-empty" onChange={handleChange}/>
          <label htmlFor="BannerType2">
            <i className="fa-solid fa-graduation-cap" />
            الصف الثاني الثانوي
          </label>
        </p>
        <p className="radioOption-Item">
          <input type="radio" name="Year" id="BannerType3" value="3" className="ng-valid ng-dirty ng-touched ng-empty" onChange={handleChange}/>
          <label htmlFor="BannerType3">
            <i className="fa-solid fa-graduation-cap" />
            الصف الثالث الثانوي
          </label>
        </p>
      </div>




        <button onClick={submithandler}>تسجيل</button>
        <Link to="/login"  style={{"color":"#3f51b5","marginTop":"10px","display":"inline-block"}}>
        تسجيل الدخول
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
