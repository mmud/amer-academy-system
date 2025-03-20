import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Link, NavLink, Navigate } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import "./admin.css"
import  Axios  from 'axios'
import { BACKEND_DOMAIN } from '../tools'
import Swal from 'sweetalert2'
import LoadingSpinnerunvis from '../components/LoadingSpinnerunvis'
import LoadingSpinner from '../components/LoadingSpinner'
import defaultavatar from "../images/avatar.png"

export default function Users(props) {
  

  const addpanel = useRef(null)
  const overlay = useRef(null)

  const [inputs,setInputs] = useState({
    Name:"",
    Phone:"",
    Year:0,
    Money:0,
    Email:""
  })

  const [loading, setloading] = useState(true);
  const [loadingcode, setloadingcode] = useState(true);

  const handleChange=(e)=>{
    setInputs((prev)=>({
        ...prev,
        [e.target.name]: e.target.value
    }))
    console.log(inputs);
  }

  const errormsg=(errormsg)=>{
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
        title: errormsg
      })
  }

  const logout=()=>{
    localStorage.setItem("token",null);
    Navigate("/", {replace: true})
    window.location.reload();
  }

  const submithandler=(e)=>{
    e.preventDefault();
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };

    setloadingcode(false);
    Axios.post( 
      BACKEND_DOMAIN+'/api/auth',
      {...inputs},
      config
    ).then((response)=>{
      setloadingcode(true);
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
      setrefresh(refresh+1);

    }).catch(e=>{
      setloadingcode(true);
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

  const [students, setgstudents] = useState([])
  const [num, setnum] = useState(1)
  const [refresh, setrefresh] = useState(1)

  //get codes
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };
    setloading(false);
    Axios.get( 
      BACKEND_DOMAIN+`/api/auth?num=${num}&type=${selectinput.current.value}&s=${searchinput.current.value}`,
      config
    ).then((response)=>{
      setloading(true);
      setgstudents(response.data);
      console.log(response.data);

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
  
    
  }, [num,refresh])
  

  //delete code
  const deletecode=async(_id)=>{

    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };

    const inputs={_id:_id};
    setloading(false);
    Axios.post( 
      BACKEND_DOMAIN+`/api/auth/delete`,
      inputs,
      config
    ).then((response)=>{
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
        title: "تمت العمليه بنجاح"
      })

      setrefresh(refresh+1);

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



  const verifycode=async(_id)=>{

    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };

    const inputs={_id:_id};
    setloading(false);
    Axios.post( 
      BACKEND_DOMAIN+`/api/auth/verifyacc`,
      inputs,
      config
    ).then((response)=>{
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
        title: "تمت العمليه بنجاح"
      })

      setrefresh(refresh+1);

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
  /* Name:"",
    Code:"",
    Phone:"",
    ParentPhone:"",
    AcademicYear:"",
    Group:"",
    */

  //edit code
  const editpanel = useRef(null);
  const nameedit = useRef(null);
  const phoneedit = useRef(null);
  const yearedit = useRef(null);
  const moneyedit = useRef(null);
  const pointsedit = useRef(null);
  const emailedit = useRef(null);
  const editcode=async(_id,Name,Phone,Year,Money,Email,Points)=>{
      setInputs2((prev)=>({
        _id:_id,
        Name:Name,
        Phone:Phone,
        Year:Year,
        Money:Money,
        Email:Email,
        Points:Points
      }))
      nameedit.current.value=Name;
      phoneedit.current.value=Phone;
      yearedit.current.value=Year==0?0:Year;
      moneyedit.current.value=Money;
      pointsedit.current.value=Points;
      emailedit.current.value=Email;
      overlay.current.style.display="block";
      editpanel.current.style.display="block";
    }

    const [inputs2,setInputs2] = useState({
        Name:"",
        Phone:"",
        Year:0,
        Money:0,
        Email:""
    })

     const handleChange2=(e)=>{
      setInputs2((prev)=>({
          ...prev,
          [e.target.name]: e.target.value
      }))
      console.log(inputs2)

    }


    const submithandler2=(e)=>{
      e.preventDefault();
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
       };
       console.log(inputs2);
      setloadingcode(false);
      Axios.post( 
        BACKEND_DOMAIN+'/api/auth/editacc',
        {...inputs2},
        config
      ).then((response)=>{
        setloadingcode(true);
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
        setrefresh(refresh+1);
      }).catch(e=>{
        setloadingcode(true);
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

    //search
    const searchinput = useRef(null)
    const selectinput = useRef(null)

    const searchclick=(e)=>{
      e.preventDefault();
      setrefresh(refresh+1);

    }
  return (
    <>
    {!loading?<LoadingSpinner/>:""}
    <div className="admincont admin">
      <AdminHeader/>
      <div className='commands'>
        

        <div className='search'>
          <form onSubmit={searchclick}> 
          <input type="text" placeholder="ابحث" ref={searchinput} name='search'/>
          <select  name="type" ref={selectinput} >
              <option value="Email">الايميل</option>
              <option value="Phone">رقم الموبايل</option>
              <option value="Name">الأسم</option>
          </select>
          <button  type="submit" ><i className="fa-solid fa-magnifying-glass"></i></button>
          </form>
        </div>

        <table>
            <thead>
                <tr>
                  <th>الأسم</th>
                  <th>رقم الموبايل</th>
                  <th>الايميل</th>
                  <th>السنة الدراسية</th>
                  <th>المحفظة</th>
                  <th>النقاط</th>
                  <th style={{"width":"100px"}}></th>
                </tr>
            </thead>
            <tbody>
                
                {students.map((student,i)=>{
                  return(<tr>
                          <td>{student.UserName}</td>
                          <td>{student.Phone}</td>
                          <td>{student.Email}</td>
                          <td>{student.Year==1?"الاول الثانوي":student.Year==2?"الثاني الثانوي":"الثالث الثانوي"}</td>
                          <td>{student.Money}</td>
                          <td>{student.Points}</td>
                          <td>{//_id,Name,Phone,Year,Money,Email
                            }
                            <i className="fa-solid fa-check" onClick={()=>verifycode(student._id)}></i>
                            <i className="fa-solid fa-pen" onClick={()=>editcode(student._id,student.UserName,student.Phone,student.Year,student.Money,student.Email,student.Points)}></i>
                            <i className="fa-solid fa-trash" onClick={()=>deletecode(student._id)}></i>
                          </td>
                        </tr>)
                })}
            </tbody>
        </table>


        <div className='spacebtween'>
          <button onClick={()=>{
            if(students.length>=10)
            setnum(num+1);
            }}>التالي</button>
          <button onClick={()=>{            
            if(num>1)
              setnum(num-1);
              }}>السابق</button>
        </div>


        <div className='overlay unvis' ref={overlay}></div>
        {!loadingcode?<LoadingSpinnerunvis/>:""}
        <div className='add' ref={addpanel}>
          <div className='toright'>
            <span className='xicon' onClick={()=>{addpanel.current.style.display="none";overlay.current.style.display="none"}}>
              ×
            </span>
          </div>


          <label>
            <div>
            الأسم
            </div>
            <input type="text" placeholder="الأسم" name='Name' onChange={handleChange}/>
          </label>

          <label>
            <div>
            رقم الهاتف
            </div>
            <input type="text" placeholder="رقم الهاتف" name='Phone' onChange={handleChange}/>
          </label>

          <label>
            <div>
            الايميل
            </div>
            <input type="text" placeholder="الايميل" name='Email' onChange={handleChange}/>
          </label>
            
          <label>
            <div>
              المحفظة
            </div>
            <input type="text" placeholder="المحفظة" name='Money' onChange={handleChange}/>
          </label>

          <label>
            <div>
              النقاط
            </div>
            <input type="text" placeholder="النقاط" name='Points' onChange={handleChange}/>
          </label>


          <label>
            <div>
            السنة الدراسية
            </div>
            
            <select  name="Year" onChange={handleChange}>
              <option value="no Academic Year">اختار السنة</option>
              <option value="1">أولي ثانوي</option>
              <option value="2">ثانية ثانوي </option>
              <option value="3">ثالثة ثانوي</option>

                
            </select>
          </label>
          <button onClick={submithandler}>اضافة</button>
        </div>


        <div className='add' ref={editpanel}>
          <div className='toright'>
            <span className='xicon' onClick={()=>{editpanel.current.style.display="none";overlay.current.style.display="none"}}>
              ×
            </span>
          </div>

          {/* <label>
            <div>
            الأسم
            </div>
            <input type="text" placeholder="الأسم" name='Name' ref={nameedit} onChange={handleChange2}/>
          </label> */}
          

          <label>
            <div>
            الأسم
            </div>
            <input type="text" placeholder="الأسم" name='Name' ref={nameedit} onChange={handleChange2}/>
          </label>

          <label>
            <div>
            رقم الهاتف
            </div>
            <input type="text" placeholder="رقم الهاتف" name='Phone' ref={phoneedit} onChange={handleChange2}/>
          </label>

          <label>
            <div>
            الايميل
            </div>
            <input type="text" placeholder="الايميل" name='Email' ref={emailedit} onChange={handleChange2}/>
          </label>
            
          <label>
            <div>
              المحفظة
            </div>
            <input type="text" placeholder="المحفظة" name='Money' ref={moneyedit} onChange={handleChange2}/>
          </label>

          <label>
            <div>
              النقاط
            </div>
            <input type="text" placeholder="النقاط" name='Points' ref={pointsedit} onChange={handleChange2}/>
          </label>

          <label>
            <div>
              New Password
            </div>
            <input type="password" placeholder="كلمة سر جديدة" name='Password' onChange={handleChange2}/>
          </label>

           
          <label>
            <div>
            السنة الدراسية
            </div>
            
            <select  name="Year" ref={yearedit} onChange={handleChange2}>
              <option value="no Academic Year">اختار السنة</option>
              <option value="1">أولي ثانوي</option>
              <option value="2">ثانية ثانوي </option>
              <option value="3">ثالثة ثانوي</option>

                
            </select>
          </label>

          <button onClick={submithandler2}>تعديل</button>
        </div>

      </div>
    </div>
    </>
  )
}
