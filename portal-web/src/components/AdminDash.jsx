import React from 'react'
import UserGraph from './UserGraph'
import './AdminDash.css'
const AdminDash = () => {
  return (
  <div className='center'> 
       <h1>User Statistics</h1>
     <div className='bar'>  
       
    <UserGraph/>
    
    </div>
    
    </div>
    )
}

export default AdminDash