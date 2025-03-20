import Axios  from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import { BACKEND_DOMAIN } from '../tools';
import Error404 from './Error404';
import { useNavigate } from "react-router-dom";

export default function Verifyemail() {
    const params = useParams();
    const [loaded, setloaded] = useState(false)
    const Navigate = useNavigate();


    useEffect(() => {
        setloaded(false);
        Axios.post( 
            BACKEND_DOMAIN+'/api/auth/verify',
            {
                id:params.id,
                token:params.token
            }
          ).then((response)=>{
            console.log(response)
            Navigate("/login", {replace: true})
          }).catch(e=>{
            console.log(e.response)
            setloaded(true);
          });
    
    }, [])
    

  return (
    <div>
        {loaded?
            <Error404/>:<LoadingSpinner/>
        }

    </div>
  )
}
