import React, { useEffect, useRef, useState } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import "./admin.css"
import  Axios  from 'axios'
import { BACKEND_DOMAIN } from '../tools'
import Swal from 'sweetalert2'
import LoadingSpinnerunvis from '../components/LoadingSpinnerunvis'
import LoadingSpinner from '../components/LoadingSpinner'
import defaultavatar from "../images/avatar.png"

export default function Adminquestion() {

  const addpanel = useRef(null)
  const overlay = useRef(null)

  const [inputs,setInputs] = useState({
    Name:"",
    Question:"",
    Answer1:"",
    Answer2:"",
    Answer3:"",
    Answer4:"",
    CorrectAnswer:""
  })

  const [loading, setloading] = useState(true);
  const [loadingcode, setloadingcode] = useState(true);

  const handleChange=(e)=>{
    setInputs((prev)=>({
        ...prev,
        [e.target.name]: e.target.value
    }))
  }


  // random string => (Math.random() + 1).toString(36).substring(7)+(Math.random() + 1).toString(36).substring(7)
  const codeinput = useRef(null)
    //avatar
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

    function base64(file, callback){
      var coolFile = {};
      function readerOnload(e){
        var base64 = btoa(e.target.result);
        coolFile.base64 = base64;
        callback(coolFile)
      };
    
      var reader = new FileReader();
      reader.onload = readerOnload;
    
      coolFile.filetype = file.type;
      coolFile.size = file.size;
      coolFile.filename = file.name;
      reader.readAsBinaryString(file);
    }

    const [avatar, setavatar] = useState(null);
    const [avatar2, setavatar2] = useState(null);
      const img = useRef(null);
      const img2 = useRef(null);
      const avatarchange=(e)=>{
        let file = e.target.files[0]
    
        if(!file)
        {
            errormsg("image not exist");
            return;
        }
    
        if(file.type !=="image/jpg" && file.type !=="image/jpeg" && file.type !=="image/png")
        {
            errormsg("image format is oncorrect");
            return;
        }
    
        if(file.size>1024*1024*5)
        {
            errormsg("the largest image size is 5mb");
            return;
        }
      
        base64( file, function(data){
            setavatar("data:image/*;base64,"+data.base64)
          })
            
      }

      const avatar2change=(e)=>{
        let file = e.target.files[0]
    
        if(!file)
        {
            errormsg("image not exist");
            return;
        }
    
        if(file.type !=="image/jpg" && file.type !=="image/jpeg" && file.type !=="image/png")
        {
            errormsg("image format is oncorrect");
            return;
        }
    
        if(file.size>1024*1024*5)
        {
            errormsg("the largest image size is 5mb");
            return;
        }
    
        base64( file, function(data){
            setavatar2("data:image/*;base64,"+data.base64)
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
      BACKEND_DOMAIN+'/api/question',
      {...inputs,Qimg:avatar,Aimg:avatar2},
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
      setrefresh(refresh+1);
      
      Toast.fire({
        icon: 'success',
        title: "تمت العمليه بنجاح"
      })

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

  const [qs, setqs] = useState([])
  const [num, setnum] = useState(1)
  const [refresh, setrefresh] = useState(1)

  //get codes
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };
    setloading(false);
    Axios.get( 
      BACKEND_DOMAIN+`/api/question?num=${num}&type=${selectinput.current.value}&s=${searchinput.current.value}`,
      config
    ).then((response)=>{
      setloading(true);
      setqs(response.data);

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
      BACKEND_DOMAIN+`/api/question/delete`,
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

  //edit code
  const editpanel = useRef(null);
  const nameedit = useRef(null);
  const questionedit = useRef(null);
  const answer1edit = useRef(null);
  const answer2edit = useRef(null);
  const answer3edit = useRef(null);
  const answer4edit = useRef(null);
  const cansweredit = useRef(null);
  const editcode=async(_id,Name,Question,Qimg,Answer1,Answer2,Answer3,Answer4,CAnswer,Aimg)=>{
      setInputs2((prev)=>({
        _id:_id,
        Name:Name,
        Question:Question,
        Answer1:Answer1,
        Answer2:Answer2,
        Answer3:Answer3,
        Answer4:Answer4,
        CorrectAnswer:CAnswer
      }))
      nameedit.current.value=Name;
      questionedit.current.value=Question;
      answer1edit.current.value=Answer1;
      answer2edit.current.value=Answer2;
      answer3edit.current.value=Answer3;
      answer4edit.current.value=Answer4;
      cansweredit.current.value=CAnswer;
      img.current.src=BACKEND_DOMAIN+Qimg;
      img2.current.src=BACKEND_DOMAIN+Aimg;
      setavatar(BACKEND_DOMAIN+Qimg);
      setavatar2(BACKEND_DOMAIN+Aimg);
      overlay.current.style.display="block";
      editpanel.current.style.display="block";
    }

    const [inputs2,setInputs2] = useState({
      Name:"",
      Question:"",
      Answer1:"",
      Answer2:"",
      Answer3:"",
      Answer4:"",
      CorrectAnswer:""
      })

     const handleChange2=(e)=>{
      setInputs2((prev)=>({
          ...prev,
          [e.target.name]: e.target.value
      }))
    }


    // random string => (Math.random() + 1).toString(36).substring(7)+(Math.random() + 1).toString(36).substring(7)
    // const randomstring2=()=>{
    //   var random = (Math.random() + 1).toString(36).substring(7)+(Math.random() + 1).toString(36).substring(7);
    //   nameedit.current.value=random;
    //   setInputs((prev)=>({
    //     ...prev,
    //     Token: random
    // }));
    // }

    const submithandler2=(e)=>{
      e.preventDefault();
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
       };
  
      setloadingcode(false);
      Axios.post( 
        BACKEND_DOMAIN+'/api/question/edit',
        {...inputs2,Qimg:avatar.replace(BACKEND_DOMAIN, ""),Aimg:avatar2.replace(BACKEND_DOMAIN, "")},
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
              <option value="Question">السؤال</option>
              <option value="Name">الأسم</option>
          </select>
          <button  type="submit" ><i className="fa-solid fa-magnifying-glass"></i></button>
          </form>
        </div>


        <div className='toright'>
          <button onClick={()=>{addpanel.current.style.display="block";overlay.current.style.display="block"}}>اضافة سؤال</button>
        </div>
        <table>
            <thead>
                <tr>
                  <th>الأسم</th>
                  <th>السؤال</th>
                  <th>الصورة</th>
                  <th style={{"width":"100px"}}></th>
                </tr>
            </thead>
            <tbody>
                

                {qs.map((code,i)=>{
                  return(<tr >
                          <td>{code.Name}</td>
                          <td>{code.Question}</td>
                          <td><img src={BACKEND_DOMAIN+code.Qimg} className='q' alt="teacherimg" style={{"width":"100px"}}/></td>
                          {
                            //_id,Question,Qimg,Answer1,Answer2,Answer3,Answer4,CAnswer
                          }
                          <td>
                            <i className="fa-solid fa-pen" onClick={()=>editcode(code._id,code.Name,code.Question,code.Qimg,code.Answer1,code.Answer2,code.Answer3,code.Answer4,code.CorrectAnswer,code.Aimg)}></i>
                            <i className="fa-solid fa-trash" onClick={()=>deletecode(code._id)}></i>
                          </td>
                        </tr>)
                })}
            </tbody>
        </table>


        <div className='spacebtween'>
          <button onClick={()=>{
            if(qs.length>=10)
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
            <span className='xicon' style={{"fontSize":"80px"}} onClick={()=>{addpanel.current.style.display="none";overlay.current.style.display="none"}}>
              ×
            </span>
          </div>

          <div className='imguploader'>
            <h3 style={{"textAlign":"center","marginBottom":"20px"}}>الصورة السؤال</h3>
            <div style={{"position":"relative","display":"flex","justifyContent":"center"}}>
                <input type="file" onChange={avatarchange} id="upload1" name='Qimg' accept='image/*' hidden/>
                <label htmlFor="upload1" className='uploadbtn'><i className="fa-solid fa-camera"></i></label>
                <img src={avatar==null?defaultavatar:avatar} className='q' ref={img} alt="avatar"/>
            </div>
          </div>

          <label>
            <div>
            الأسم
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input type="text" placeholder="الأسم" name='Name' onChange={handleChange}/>
            </div>
          </label>

          <label>
            <div>
            السؤال
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input type="text" placeholder="السؤال" name='Question' onChange={handleChange}/>
            </div>
          </label>

          
          <label>
            <div>
            الأجابة الأولي
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input type="text" placeholder="الاجابة الأولي" name='Answer1' onChange={handleChange}/>
            </div>
          </label>
  
          <label>
            <div>
            الأجابة الثانية
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input type="text" placeholder="الاجابة الثانية" name='Answer2' onChange={handleChange}/>
            </div>
          </label>

          <label>
            <div>
            الأجابة الثالثة
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input type="text" placeholder="الاجابة الثالثة" name='Answer3' onChange={handleChange}/>
            </div>
          </label>
          
          <label>
            <div>
            الأجابة الرابعة
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input type="text" placeholder="الاجابة الرابعة" name='Answer4' onChange={handleChange}/>
            </div>
          </label>

          <label>
            <div>
            الأجابة الصحيحة
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input type="text" placeholder="الاجابة الصحيحة" name='CorrectAnswer' onChange={handleChange}/>
            </div>
          </label>

          <div className='imguploader'>
            <h3 style={{"textAlign":"center","marginBottom":"20px"}}>صورة الأجابة</h3>
            <div style={{"position":"relative","display":"flex","justifyContent":"center"}}>
                <input type="file" onChange={avatar2change} id="upload2" name='Qimg' accept='image/*' hidden/>
                <label htmlFor="upload2" className='uploadbtn'><i className="fa-solid fa-camera"></i></label>
                <img src={avatar2==null?defaultavatar:avatar2} className='q' ref={img2} alt="avatar"/>
            </div>
          </div>

          <button onClick={submithandler}>اضافة</button>
        </div>


        <div className='add' ref={editpanel}>
          <div className='toright'>
            <span className='xicon' style={{"fontSize":"80px"}} onClick={()=>{editpanel.current.style.display="none";overlay.current.style.display="none"}}>
              ×
            </span>
          </div>

          <div className='imguploader'>
            <h3 style={{"textAlign":"center","marginBottom":"20px"}}>الصورة السؤال</h3>
            <div style={{"position":"relative","display":"flex","justifyContent":"center"}}>
                <input type="file" onChange={avatarchange} id="upload3" name='avatar' accept='image/*' hidden/>
                <label htmlFor="upload3" className='uploadbtn'><i className="fa-solid fa-camera"></i></label>
                <img src={avatar==null?defaultavatar:avatar} className='q' ref={img} alt="avatar"/>
            </div>
          </div>

          <label>
            <div>
            الأسم
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input ref={nameedit} type="text" placeholder="الأسم" name='Name' onChange={handleChange2}/>
            </div>
          </label>


          <label>
            <div>
            السؤال
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input ref={questionedit} type="text" placeholder="السؤال" name='Question' onChange={handleChange2}/>
            </div>
          </label>

          
          <label>
            <div>
            الأجابة الأولي
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input ref={answer1edit} type="text" placeholder="الاجابة الأولي" name='Answer1' onChange={handleChange2}/>
            </div>
          </label>
  
          <label>
            <div>
            الأجابة الثانية
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input ref={answer2edit} type="text" placeholder="الاجابة الثانية" name='Answer2' onChange={handleChange2}/>
            </div>
          </label>

          <label>
            <div>
            الأجابة الثالثة
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input ref={answer3edit} type="text" placeholder="الاجابة الثالثة" name='Answer3' onChange={handleChange2}/>
            </div>
          </label>
          
          <label>
            <div>
            الأجابة الرابعة
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input ref={answer4edit} type="text" placeholder="الاجابة الرابعة" name='Answer4' onChange={handleChange2}/>
            </div>
          </label>

          <label>
            <div>
            الأجابة الصحيحة
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input ref={cansweredit} type="text" placeholder="الاجابة الصحية" name='CorrectAnswer' onChange={handleChange2}/>
            </div>
          </label>

          <div className='imguploader'>
            <h3 style={{"textAlign":"center","marginBottom":"20px"}}>الصورة الاجابة</h3>
            <div style={{"position":"relative","display":"flex","justifyContent":"center"}}>
                <input type="file" onChange={avatar2change} id="upload4" name='avatar' accept='image/*' hidden/>
                <label htmlFor="upload4" className='uploadbtn'><i className="fa-solid fa-camera"></i></label>
                <img src={avatar2==null?defaultavatar:avatar2} className='q' ref={img2} alt="avatar"/>
            </div>
          </div>

          <button onClick={submithandler2}>اضافة</button>
        </div>

      </div>
    </div>
    </>
  )
}
