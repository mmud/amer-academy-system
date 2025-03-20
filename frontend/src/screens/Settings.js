import  Axios  from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import "./settings.css"
import { BACKEND_DOMAIN } from '../tools'
import Swal from 'sweetalert2'
import defaultavatar from "../images/avatar.png"
import LoadingSpinnerunvis from '../components/LoadingSpinnerunvis'

export default function Settings() {
    const [loading, setloading] = useState(false)
    const [userdata, setuserdata] = useState(null)
    const username = useRef(null)
    const phone = useRef(null)
    const s1 = useRef(null)
    const s2 = useRef(null)
    const s3 = useRef(null)

    const [inputs,setInputs] = useState({
        UserName:"",
        Phone:"",
        Year:0
      })

    const handleChange=(e)=>{
        setInputs((prev)=>({
    
            ...prev,
            [e.target.name]: e.target.value
        }))
      }
  
    useEffect(() => {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    };
    
    Axios.get( 
      BACKEND_DOMAIN+'/api/auth/getme',
      config
    ).then((response)=>{
      setuserdata(response.data);
      setloading(true);
      username.current.value =response.data.UserName;
      phone.current.value =response.data.Phone;
      if(response.data.Year == 1)
        s1.current.checked=true;
      else if(response.data.Year == 2)
        s2.current.checked=true;
      else if(response.data.Year == 3)
        s3.current.checked=true;

        setInputs({
        UserName:response.data.UserName,
        Phone:response.data.Phone,
        Year:Number(response.data.Year)
      })
    }).catch((e)=>{
      if(e.response.data === "not authorized")
        {
          localStorage.setItem("token",null);
        }
    });  
    }, [])

//checked={`${inputs.Year==3?true:false}`}
    

      const [sedingloading, setsedingloading] = useState(true)
      const submithandler=()=>{
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
    
        const bodyParameters = {
        ...inputs
        };
        setsedingloading(false)
        Axios.post( 
            BACKEND_DOMAIN+'/api/auth/updateuser',
            bodyParameters,
            config,
          ).then((response)=>{
            window.location.reload();
          }).catch(e=>{
            setsedingloading(true)

            
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
      console.log(inputs)

    return (
    <>
    {!loading?<LoadingSpinner/>:""}
    {!sedingloading?<LoadingSpinnerunvis/>:""}
        <h1  style={{"textAlign":"center"}}>الأعدادات</h1>
        <div className="container settings">
        <div className='settingsright'>
                <label>
                    <div>
                    الأسم
                    </div>
                    <input type="text" ref={username} placeholder="الأسم" name='UserName' onChange={handleChange}/>
                </label>
                <label>
                    <div>
                    رقم الهاتف
                    </div>
                    <input type="text" ref={phone} placeholder="رقم الهاتف" name='Phone' onChange={handleChange}/>
                </label>

                <label>
                    <div>
                      السنة الدراسية
                    </div>
                </label>

                <div className="radio-with-Icon" style={{"marginBottom":"30px"}}>
                  <p className="radioOption-Item">
                    <input type="radio" name="Year" id="BannerType1" value="1" ref={s1}  className="ng-valid ng-dirty ng-touched ng-empty" onChange={handleChange} />
                    <label htmlFor="BannerType1">
                      <i className="fa-solid fa-graduation-cap" />
                      الصف الأول الثانوي
                    </label>
                  </p>
                  <p className="radioOption-Item">
                    <input type="radio" name="Year" id="BannerType2" value="2" ref={s2}  className="ng-valid ng-dirty ng-touched ng-empty" onChange={handleChange}/>
                    <label htmlFor="BannerType2">
                      <i className="fa-solid fa-graduation-cap" />
                      الصف الثاني الثانوي
                    </label>
                  </p>
                  <p className="radioOption-Item">
                    <input type="radio" name="Year" id="BannerType3" value="3" ref={s3}  className="ng-valid ng-dirty ng-touched ng-empty" onChange={handleChange}/>
                    <label htmlFor="BannerType3">
                      <i className="fa-solid fa-graduation-cap" />
                      الصف الثالث الثانوي
                    </label>
                  </p>
                </div>



            <button style={{"width":"200px"}} onClick={submithandler}>حفظ</button>
        </div>
        </div>
    </>
    )
}

