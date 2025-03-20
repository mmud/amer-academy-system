import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Navigate,useParams  } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import "./admin.css"
import "./exams.css"
import  * as Axios  from 'axios'
import { BACKEND_DOMAIN } from '../tools'
import Swal from 'sweetalert2'
import LoadingSpinnerunvis from '../components/LoadingSpinnerunvis'
import LoadingSpinner from '../components/LoadingSpinner'
import defaultavatar from "../images/avatar.png"
import PageHeader from '../components/PageHeader'
import "./CoursePage.css"
import "../../node_modules/video-react/dist/video-react.css";
import { Player } from 'video-react';


export default function SectionPage() {
  let { id } = useParams();

  const [loading, setloading] = useState(true);
  const [section, setsection] = useState([])
  const [refresh, setrefresh] = useState(1)

  const [index, setindex] = useState(0)


  //get codes
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
     };
    setloading(false);
    Axios.get( 
      BACKEND_DOMAIN+`/api/course/section/${id}`,
      config
    ).then((response)=>{
      setloading(true);
      setsection(response.data);
      console.log(response.data)
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
    
  }, [refresh])
  

  //video

  function createObjectURL(object) {
    return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
  }

  const v = useRef(null)
  const [url, seturl] = useState("")
//   useEffect(() => {

//   if(section.Blocks&&section.Blocks[index].Type=="Video"){
//     async function display(videoStream){
//       //var URL = window.URL || window.webkitURL;
//       //var blob = fetch("http://localhost:3500/video/1s.mp4").then(r => r.blob());
//       //var file = new Blob(["http://localhost:3500/video/1s.mp4"],{"type":"video/mp4"});
//       //var value = window.URL.createObjectURL(blob);

//       //او

//       // let blob = await fetch(videoStream).then(r => r.blob());
//       // var videoUrl=createObjectURL(blob);
//       // v.current.src = videoUrl;
//       // videoUrl = URL.revokeObjectURL(blob);

//       //او

//       let xhr = new XMLHttpRequest();
//       xhr.open("GET",videoStream)
//       xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem("token")}`);
//       xhr.responseType="arraybuffer";
//       xhr.onload=(e)=>{
//         let blob = new Blob([xhr.response])
//         var videoUrl=createObjectURL(blob);
//         seturl(videoUrl);
//       }
//       xhr.send();
//     }

//     display(BACKEND_DOMAIN+`/video/${section.Blocks&&section.Blocks[index].Video}?sectionid=${section._id}`);
//   }
// }, [index])


  return (
    <>  
    {!loading?<LoadingSpinner/>:""}
    <div className='container'>
    <div className="admincont admin container">
    <div className='commands container'>
      <h1 className='title' style={{"textAlign":"right"}}>
        {section.Name}
      </h1>

        {
        section.Blocks&&section.Blocks[index].Type=="Content"?<p style={{"textAlign":"center","fontSize":"20px"}}>{section.Blocks[index].Content}</p>:
        section.Blocks&&section.Blocks[index].Type=="Link"?<a className='sectionlink' href={section.Blocks&&section.Blocks[index].Link} target="_blank" rel="noopener noreferrer"><button>اضغط هنا للذهاب الي الرابط</button></a>:
        section.Blocks&&section.Blocks[index].Type=="Video"?<Player playsInline src={BACKEND_DOMAIN+`/video/${section.Blocks&&section.Blocks[index].Video}?sectionid=${section._id}&token=${section.VideoToken}`} />:
        section.Blocks&&section.Blocks[index].Type=="ExamId"?<a className='sectionlink' href={`/exams/${section.Blocks&&section.Blocks[index].ExamId}`} target="_blank" rel="noopener noreferrer"><button>اضغط هنا للذهاب الي الامتحان</button></a>:""
        }
        {console.log(section.Blocks&&section.Blocks[index])}
      <div className='section sectionpage'>
            {
              section.Blocks&&section.Blocks.map((b,i)=>i==index?
              <div className='blockactive'>
                {b.Name} {b.Type=="Video"?<i className="fa-solid fa-play"></i>:
                          b.Type=="Content"?<i className="fa-solid fa-file-lines"></i>:
                          b.Type=="Link"?<i className="fa-solid fa-link"></i>:
                          <i className="fa-solid fa-question"></i>
                }         
                </div>
              
              : <div className='block' onClick={()=>setindex(i)}>
                {b.Name} {b.Type=="Video"?<i className="fa-solid fa-play"></i>:
                          b.Type=="Content"?<i className="fa-solid fa-file-lines"></i>:
                          b.Type=="Link"?<i className="fa-solid fa-link"></i>:
                          <i className="fa-solid fa-question"></i>
                }         
                </div>)
            }
      </div>
      

    </div>
    </div>
    </div>
    </>)
  }

