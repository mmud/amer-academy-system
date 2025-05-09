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

export default function Adminexam() {

  const addpanel = useRef(null)
  const overlay = useRef(null)

  const [inputs,setInputs] = useState({
    Name:"",
    Questions:[],
    Private:false,
    Year:0,
    Term:"1"
  })
  const isprivate = useRef(null);

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

    const [avatar, setavatar] = useState(defaultavatar);
      const img = useRef(null);
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

  const logout=()=>{
    localStorage.setItem("token",null);
    Navigate("/", {replace: true})
    window.location.reload();
  }

  const submithandler=(e)=>{
    e.preventDefault();
    let qscodes=qslist.map((q)=>q._id)

    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };

    setloadingcode(false);
    Axios.post( 
      BACKEND_DOMAIN+'/api/exam',
      {...inputs,Questions:qscodes,Private:isprivate.current.checked},
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
      BACKEND_DOMAIN+`/api/exam?num=${num}&type=${selectinput.current.value}&s=${searchinput.current.value}`,
      config
    ).then((response)=>{
      setloading(true);
      setqs(response.data);
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
      BACKEND_DOMAIN+`/api/exam/delete`,
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
  const privateedit = useRef(null);
  const yearedit = useRef(null);
  const termedit = useRef(null);

  const editcode=async(_id,Name,Questions,Private,Year,Term)=>{
      setInputs2((prev)=>({
        _id:_id,
        Name:Name,
        Questions:Questions,
        Year:Year,
        Term:Term
      }))
      nameedit.current.value=Name;
      privateedit.current.checked=Private;
      yearedit.current.value=Year;
      termedit.current.value=Term;
      console.log(Term)
      setqslistedit(Questions)
      // img.current.src=Qimg;
      // setavatar(Qimg);
      overlay.current.style.display="block";
      editpanel.current.style.display="block";
    }

    const [inputs2,setInputs2] = useState({
      Name:"",
      Questions:"",
      Private:"",
      Year:""
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
      let qscodes=qslistedit.map((q)=>q._id)

      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
       };
  
      setloadingcode(false);
      Axios.post( 
        BACKEND_DOMAIN+'/api/exam/edit',
        {...inputs2,Questions:qscodes,Private:privateedit.current.checked},
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

      //qs list
      const [qslist, setqslist] = useState([])
      
      const dragItem = useRef(null);
      const dragOverItem = useRef(null);

      const handlesort=()=>
      {
        let _qItems = [...qslist];
        const draggedItem = _qItems.splice(dragItem.current,1)[0];
        _qItems.splice(dragOverItem.current,0,draggedItem)
        dragItem.current=null;
        dragOverItem.current=null;
        setqslist(_qItems);
      }

      useEffect(() => {
        
      console.log(qslist);
       
      }, [qslist])

      //get all qs
      const [searchqs, setsearchqs] = useState([])
      const [refresh2, setrefresh2] = useState(1)

  //get codes
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };
    setloading(false);
    Axios.get( 
      BACKEND_DOMAIN+`/api/question?num=${1}&type=${selectqinput.current.value}&s=${searchqinput.current.value}`,
      config
    ).then((response)=>{
      setloading(true);
      setsearchqs(response.data);

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
  
    
  }, [num,refresh2])
  

      //search
      const searchqinput = useRef(null)
      const selectqinput = useRef(null)
  
      const searchqclick=(e)=>{
        e.preventDefault();
        setrefresh2(refresh2+1);
  
      }

      const [showsearch, setshowsearch] = useState(false)

      //add to the list
      const addtothelist=(newq)=>{
        let _list =  qslist;
        _list.push(newq);
        setqslist(_list);
      }

      const deletefromthelist=(q)=>{
        let _qItems = [...qslist];
        const Items = _qItems.filter((aq)=>aq._id!==q._id);
        setqslist(Items);
      }


      //edit ************

            //qs list
            const [qslistedit, setqslistedit] = useState([])
      
            const dragItemedit = useRef(null);
            const dragOverItemedit = useRef(null);
      
            const handlesortedit=()=>
            {
              let _qItems = [...qslistedit];
              const draggedItem = _qItems.splice(dragItemedit.current,1)[0];
              _qItems.splice(dragOverItemedit.current,0,draggedItem)
              dragItemedit.current=null;
              dragOverItemedit.current=null;
              setqslistedit(_qItems);
            }
      
      
            //get all qs
            const [searchqsedit, setsearchqsedit] = useState([])
            const [refresh2edit, setrefresh2edit] = useState(1)
      
        //get codes
        useEffect(() => {
          const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
           };
          setloading(false);
          Axios.get( 
            BACKEND_DOMAIN+`/api/question?num=${1}&type=${selectqinputedit.current.value}&s=${searchqinputedit.current.value}`,
            config
          ).then((response)=>{
            setloading(true);
            setsearchqsedit(response.data);
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
        
          
        }, [num,refresh2edit])
        
      
            //search
            const searchqinputedit = useRef(null)
            const selectqinputedit = useRef(null)
        
            const searchqclickedit=(e)=>{
              e.preventDefault();
              setrefresh2edit(refresh2edit+1);
        
            }
      
            const [showsearchedit, setshowsearchedit] = useState(false)
      
            //add to the list
            const addtothelistedit=(newq)=>{
              let _list =  qslistedit;
              _list.push(newq);
              setqslistedit(_list);
            }
            
            const deletefromthelistedit=(q)=>{
              let _qItems = [...qslistedit];
              const Items = _qItems.filter((aq)=>aq._id!==q._id);
              setqslistedit(Items);
            }

  //getcount
  const [count, setcount] = useState([])
  useEffect(() => {
    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
      setloading(false);
      Axios.get( 
        BACKEND_DOMAIN+`/api/exam/solveexam`,
        config
      ).then((response)=>{
        setloading(true);
        setsearchqsedit(response.data);
        setcount(response.data);
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
                  
    }, [num,refresh2])
            


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
              <option value="Name">الأسم</option>
          </select>
          <button  type="submit" ><i className="fa-solid fa-magnifying-glass"></i></button>
          </form>
        </div>
      
        <div className='toright'>
          <button onClick={()=>{addpanel.current.style.display="block";overlay.current.style.display="block"}}>اضافة امتحان</button>
        </div>
        <table>
            <thead>
                <tr>
                  <th>id</th>
                  <th>الأسم</th>
                  <th>الحالة</th>
                  <th>عدد الطلاب</th>
                  <th>السنة الدراسية</th>
                  <th style={{"width":"100px"}}></th>
                </tr>
            </thead>
            <tbody>
                

                {qs.map((code,i)=>{
                  return(<tr>
                          <td>{code._id}</td>
                          <td>{code.Name}</td>
                          <td>{code.Private?"خاص":"عام"}</td>
                          
                          <td>{Number(code.Year)==1?"الصف الأول الثانوي":Number(code.Year)==2?"الصف الثاني الثانوي":"الصف الثالث الثانوي"}</td>
                          {//<td><img src={code.Qimg} className='q' alt="teacherimg" style={{"width":"100px"}}/></td>
                          }
                          {
                            //_id,Question,Qimg,Answer1,Answer2,Answer3,Answer4,CAnswer
                          }
                          <td>
                            <i className="fa-solid fa-pen" onClick={()=>editcode(code._id,code.Name,code.Questions,code.Private,code.Year,code.Term)}></i>
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
        <h1 style={{"width":"fit-content","margin":"10px auto"}}>
          عدد الطلاب
        </h1>
        <div className='examescont'>
          {
          count.map((e,i)=>{
            return(
              <div className="boxs" key={i}>
                <div className="content">
                    <h2>{e.Name}:{e.Count}</h2>
                </div>
            </div>
            
            )
          })
        }
        </div>


        <div className='overlay unvis' ref={overlay}></div>
        {!loadingcode?<LoadingSpinnerunvis/>:""}
        <div className='add bigpanel' ref={addpanel}>
          <div className='toright'>
            <span className='xicon' onClick={()=>{addpanel.current.style.display="none";overlay.current.style.display="none"}}>
              ×
            </span>
          </div>
          {/*
          <div className='imguploader'>
            <h3 style={{"textAlign":"center","marginBottom":"20px"}}>الصورة السؤال</h3>
            <div style={{"position":"relative","display":"flex","justifyContent":"center"}}>
                <input type="file" onChange={avatarchange} id="upload" name='Qimg' accept='image/*' hidden/>
                <label htmlFor="upload" className='uploadbtn'><i className="fa-solid fa-camera"></i></label>
                <img src={avatar==null?defaultavatar:avatar} className='q' ref={img} alt="avatar"/>
            </div>
          </div>
            */}
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
            السنة الدراسية
            </div>
            
            <select  name="Year" onChange={handleChange}>
              <option value="no Academic Year">اختار السنة</option>
              <option value="1">أولي ثانوي</option>
              <option value="2">ثانية ثانوي </option>
              <option value="3">ثالثة ثانوي</option>

                
            </select>
          </label>

          <label>
            <div>
              الترم
            </div>
            
            <select  name="Term" onChange={handleChange}>
              <option value="no Academic Year">اختار الترم</option>
              <option value="1">الأول</option>
              <option value="2">الثاني</option>
                
            </select>
          </label>

          <label class="container-checkbox">is private
            <input type="checkbox" name='Year'ref={isprivate}/>
            <span class="checkmark"></span>
          </label>

            <h1 style={{"textAlign":"center"}}>الاسئلة</h1>

            <div style={{"position":"relative"}}>
            <div className='search'>
              <form onSubmit={searchqclick}> 
              <input type="text" placeholder="ابحث" onFocus={()=>setshowsearch(true)} onBlur={()=>setTimeout(() => {setshowsearch(false)}, 100)} ref={searchqinput} name='search'/>
              <select  name="type" ref={selectqinput} >
                  <option value="Name">الأسم</option>
              </select>
              <button  type="submit" onClick={()=>setTimeout(() => {setshowsearch(true)}, 150)}><i className="fa-solid fa-magnifying-glass"></i></button>
              </form>
            </div>

            <div className='searchlist' onClick={()=>setshowsearch(true)}>
                {
                  showsearch?
                  searchqs.map((q,i)=>{
                    return(
                      <div onClick={()=>addtothelist(q)}>
                        {q.Name}
                      </div>
                    )
                  }):""
                }
            </div>
            </div>
            <div className='list-container'>

            {
              qslist.map((q,i)=>{
                return(
                  <div key={i} draggable className='list-item'
                    onDragStart={(e)=>dragItem.current=i}
                    onDragEnter={(e)=>dragOverItem.current=i}
                    onDragEnd={handlesort}
                    onDragOver={(e)=>e.preventDefault()}
                
                  >
                    <div style={{"display":"flex"}}>
                    <i className='fa-solid fa-bars'></i>
                    <h3>{q.Name}</h3>
                    </div>
                    <i className="fa-solid fa-trash" onClick={()=>deletefromthelist(q)}></i>
                  </div>
                )
              })
            }
              
            </div>
          

          <button onClick={submithandler}>اضافة</button>
        </div>


        <div className='add bigpanel' ref={editpanel}>
          <div className='toright'>
            <span className='xicon' onClick={()=>{editpanel.current.style.display="none";overlay.current.style.display="none"}}>
              ×
            </span>
          </div>

          {/*<div className='imguploader'>
            <h3 style={{"textAlign":"center","marginBottom":"20px"}}>الصورة السؤال</h3>
            <div style={{"position":"relative","display":"flex","justifyContent":"center"}}>
                <input type="file" onChange={avatarchange} id="upload" name='avatar' accept='image/*' hidden/>
                <label htmlFor="upload" className='uploadbtn'><i className="fa-solid fa-camera"></i></label>
                <img src={avatar==null?defaultavatar:avatar} className='q' ref={img} alt="avatar"/>
            </div>
          </div>

          */}

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
            السنة الدراسية
            </div>
            
            <select  name="Year" ref={yearedit} onChange={handleChange2}>
              <option value="no Academic Year">اختار السنة</option>
              <option value="1">أولي ثانوي</option>
              <option value="2">ثانية ثانوي </option>
              <option value="3">ثالثة ثانوي</option>

                
            </select>
          </label>

          <label>
            <div>
              الترم
            </div>
            
            <select  name="Term" ref={termedit} onChange={handleChange2}>
              <option value="no Academic Year">اختار الترم</option>
              <option value="1">الأول</option>
              <option value="2">الثاني</option>
                
            </select>
          </label>

          <label class="container-checkbox">is private
            <input type="checkbox" ref={privateedit} name='Year'/>
            <span class="checkmark"></span>
          </label>

          <h1 style={{"textAlign":"center"}}>الاسئلة</h1>

            <div style={{"position":"relative"}}>
            <div className='search'>
              <form onSubmit={searchqclickedit}> 
              <input type="text" placeholder="ابحث" onFocus={()=>setshowsearchedit(true)} onBlur={()=>setTimeout(() => {setshowsearchedit(false)}, 100)} ref={searchqinputedit} name='search'/>
              <select  name="type" ref={selectqinputedit} >
                  <option value="Name">الأسم</option>
              </select>
              <button  type="submit" onClick={()=>setTimeout(() => {setshowsearchedit(true)}, 150)}><i className="fa-solid fa-magnifying-glass"></i></button>
              </form>
            </div>

            <div className='searchlist' onClick={()=>setshowsearchedit(true)}>
                {
                  showsearchedit?
                  searchqsedit.map((q,i)=>{
                    return(
                      <div onClick={()=>addtothelistedit(q)}>
                        {q.Name}
                      </div>
                    )
                  }):""
                }
            </div>
            </div>
            <div className='list-container'>

            {
              qslistedit.map((q,i)=>{
                return(
                  <div key={i} draggable className='list-item'
                    onDragStart={(e)=>dragItemedit.current=i}
                    onDragEnter={(e)=>dragOverItemedit.current=i}
                    onDragEnd={handlesortedit}
                    onDragOver={(e)=>e.preventDefault()}
                
                  >
                    <div style={{"display":"flex"}}>
                    <i className='fa-solid fa-bars'></i>
                    <h3>{q.Name}</h3>
                    </div>
                    <i className="fa-solid fa-trash" onClick={()=>deletefromthelistedit(q)}></i>
                  </div>
                )
              })
            }
              
            </div>

          <button onClick={submithandler2}>اضافة</button>
        </div>

      </div>
    </div>


    
    </>
  )
}
