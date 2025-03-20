import React from 'react'
import { NavLink } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import "./admin.css"

export default function Admin() {
  return (
    <div className="admincont admin">
      <AdminHeader/>
      <div className='commands'>
        test
      </div>
    </div>
  )
}
