import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { BACKEND_DOMAIN } from '../tools';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import AdminHeader from '../components/AdminHeader';
import LoadingSpinnerunvis from '../components/LoadingSpinnerunvis';

export default function Upload() {
    const [uploadedFile, setUploadedFile] = useState ('');
    const [fileTitle, setFileTitle] = useState ('');
    const addpanel = useRef(null)
    const overlay = useRef(null)
    const progressbar = useRef(null)
    const progresstop = useRef(null)
  
    const [loading, setloading] = useState(true);
    const [loadingcode, setloadingcode] = useState(true);

  
    const logout=()=>{
        localStorage.setItem("token",null);
        Navigate("/", {replace: true})
        window.location.reload();
      }

    function handleFormSubmittion (e) {
    e.preventDefault ();

    let form = document.getElementById ('form');
    let formData = new FormData (form);
    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        onUploadProgress: progressEvent =>{
          progresstop.current.style.display="block";
          progressbar.current.style.width=`${(progressEvent.loaded/progressEvent.total)*100}%`
        }
    };
    setloading(false);

    Axios.post (
        BACKEND_DOMAIN+'/api/block/upload',
         formData,
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

    function handleFileTitle (e) {
        setFileTitle (e.target.value);
    }

    function handleUploadedFile (e) {
        setUploadedFile (e.target.value);
    }







  
    const [uploads, setcuploads] = useState([])
    const [num, setnum] = useState(1)
    const [refresh, setrefresh] = useState(1)
  
    //get codes
    useEffect(() => {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
       };
      setloading(false);
      Axios.get( 
        BACKEND_DOMAIN+`/api/block/upload?num=${num}`,
        config
      ).then((response)=>{
        setloading(true);
        setcuploads(response.data);
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
        BACKEND_DOMAIN+`/api/block/upload/delete`,
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
    const Nameedit = useRef(null);
    const editcode=async(_id,Name)=>{
        setInputs2((prev)=>({
          _id:_id,
          Name:Name
        }))
        Nameedit.current.value=Name;
        overlay.current.style.display="block";
        editpanel.current.style.display="block";
      }
  
      const [inputs2,setInputs2] = useState({
        Name:""
      })
  
       const handleChange2=(e)=>{
        setInputs2((prev)=>({
            ...prev,
            [e.target.name]: e.target.value
        }))
      }
  
      const submithandler2=(e)=>{
        e.preventDefault();
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
         };
    
        setloadingcode(false);
        Axios.post( 
          BACKEND_DOMAIN+'/api/block/upload/edit',
          inputs2,
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

    return (
        <>
    {!loading?<><LoadingSpinner/>
        <div class="progress-wrapper" ref={progresstop}>
          <div class="progress" ref={progressbar}>
          </div>
        </div>
        </>:""}
    <div className="admincont admin">
      <AdminHeader/>
      <div className='commands'>
        <div className='toright'>
          <button onClick={()=>{addpanel.current.style.display="block";overlay.current.style.display="block"}}>رفع ملف</button>
        </div>
        <table>
            <thead>
                <tr>
                  <th>الأسم</th>
                  <th style={{"width":"100px"}}></th>
                </tr>
            </thead>
            <tbody>
                

                {uploads.map((code,i)=>{
                  return(<tr>
                          <td>{code.Name}</td>
                          <td>
                            <i className="fa-solid fa-pen" onClick={()=>editcode(code._id,code.Name)}></i>
                            <i className="fa-solid fa-trash" onClick={()=>deletecode(code._id)}></i>
                          </td>
                        </tr>)
                })}
            </tbody>
        </table>


        <div className='spacebtween'>
          <button onClick={()=>{
            if(uploads.length>=10)
            setnum(num+1);
            }}>التالي</button>
          <button onClick={()=>{            
            if(num>1)
              setnum(num-1);
              }}>السابق</button>
        </div>


        <div className='overlay unvis' ref={overlay}></div>
        {!loadingcode?<>
        <LoadingSpinnerunvis/>
        </>:""}
        <div className='add' ref={addpanel}>
          <div className='toright'>
            <span className='xicon' onClick={()=>{addpanel.current.style.display="none";overlay.current.style.display="none"}}>
              ×
            </span>
          </div>

          <>
        <h1>File upload</h1>
        <form
            encType="multipart/form-data"
            onSubmit={handleFormSubmittion}
            id="form"
            className='upload'
        >
            <input
            type="file"
            name="uploadedFile"
            value={uploadedFile}
            onChange={handleUploadedFile}
            required
            />
            <br />
            <br />

            <label>File title:</label><br />
            <input
            type="text"
            placeholder="Enter file title"
            name="fileTitle"
            value={fileTitle}
            onChange={handleFileTitle}
            required
            />
            <br />
            <br />

            <button type="submit">Submit Form</button>
        </form>
        </>

        </div>


        <div className='add' ref={editpanel}>
          <div className='toright'>
            <span className='xicon' onClick={()=>{editpanel.current.style.display="none";overlay.current.style.display="none"}}>
              ×
            </span>
          </div>

          <label>
            <div>
            الأسم
            </div>
            <div style={{"display":"flex","alignItems":"center"}}>
              <input ref={Nameedit} type="text" placeholder="الأسم" name='Name' onChange={handleChange2}/>
            </div>
          </label>

          <button onClick={submithandler2}>اضافة</button>
        </div>

      </div>
    </div>
    </>
    );
}
