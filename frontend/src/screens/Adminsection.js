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

export default function Adminsection() {

  const addpanel = useRef(null)
  const overlay = useRef(null)

  const [inputs,setInputs] = useState({
    Name:"",
    Blocks:[],
    Isfree:false,
    Price:0
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
      BACKEND_DOMAIN+'/api/section',
      {...inputs,Blocks:qscodes,Isfree:isprivate.current.checked},
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
      BACKEND_DOMAIN+`/api/section?num=${num}&type=${selectinput.current.value}&s=${searchinput.current.value}`,
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
      BACKEND_DOMAIN+`/api/section/delete`,
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
  const isfreeedit = useRef(null);
  const priceedit = useRef(null);
  const yearedit = useRef(null);

  const editcode=async(_id,Name,Blocks,Isfree,Price,Year)=>{
      setInputs2((prev)=>({
        _id:_id,
        Name:Name,
        Blocks:Blocks,
        Isfree:Isfree,
        Price:Price,
        Year:Year
      }))
      nameedit.current.value=Name;
      isfreeedit.current.checked=Isfree;
      priceedit.current.value=Price;
      yearedit.current.value=Year
      setqslistedit(Blocks)
      // img.current.src=Qimg;
      // setavatar(Qimg);
      overlay.current.style.display="block";
      editpanel.current.style.display="block";
    }

    const [inputs2,setInputs2] = useState({
      Name:"",
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
        BACKEND_DOMAIN+'/api/section/edit',
        {...inputs2,Blocks:qscodes,Private:isfreeedit.current.checked},
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
      BACKEND_DOMAIN+`/api/block?num=${1}&type=${selectqinput.current.value}&s=${searchqinput.current.value}`,
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
            BACKEND_DOMAIN+`/api/block?num=${1}&type=${selectqinputedit.current.value}&s=${searchqinputedit.current.value}`,
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
          <button onClick={()=>{addpanel.current.style.display="block";overlay.current.style.display="block"}}>اضافة سيكشن</button>
        </div>
        <table>
            <thead>
                <tr>
                  <th>الأسم</th>
                  <th>السعر</th>
                  <th>السنة الدراسية</th>
                  <th style={{"width":"100px"}}></th>
                </tr>
            </thead>
            <tbody>
                

                {qs.map((code,i)=>{
                  return(<tr>
                          <td>{code.Name}</td>
                          <td>{code.Price}</td>
                          <td>{Number(code.Year)==1?"الصف الأول الثانوي":Number(code.Year)==2?"الصف الثاني الثانوي":"الصف الثالث الثانوي"}</td>
                          <td>
                          {/* _id,Name,Blocks,Isfree,Price */}
                            <i className="fa-solid fa-pen" onClick={()=>editcode(code._id,code.Name,code.Blocks,code.Isfree,code.Price,code.Year)}></i>
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
            السعر
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input type="text" placeholder="السعر" name='Price' onChange={handleChange}/>
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

          <label class="container-checkbox">is free
            <input type="checkbox" name='Isfree'ref={isprivate}/>
            <span class="checkmark"></span>
          </label>

            <h1 style={{"textAlign":"center"}}>البلوكات</h1>

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
            السعر
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input ref={priceedit} type="text" placeholder="السعر" name='Price' onChange={handleChange2}/>
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

          <label class="container-checkbox">is private
            <input type="checkbox" ref={isfreeedit} name='Year'/>
            <span class="checkmark"></span>
          </label>

          <h1 style={{"textAlign":"center"}}>البلوكات</h1>

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
