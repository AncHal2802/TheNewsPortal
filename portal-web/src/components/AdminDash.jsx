import React from 'react'
import UserGraph from './UserGraph'
import './AdminDash.css'
const AdminDash = () => {
  return (
  <div> 
       <h1>Dashboard</h1>
     <div className='bar'>  
       
    <UserGraph/>
    
    </div>
    
    </div>
    )
}

export default AdminDash