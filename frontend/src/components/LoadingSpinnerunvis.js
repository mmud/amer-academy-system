import React from 'react'
import "./loadingspinner.css"

export default function LoadingSpinnerunvis() {
  return (
    <>
        <div className='overlay unvis'></div>
        <div className="lds-ring main"><div></div><div></div><div></div><div></div></div>
    </>
  )
}
