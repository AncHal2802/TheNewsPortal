// AdminPanel.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import "./AdminPanel.css"
import Navbar from './Navbar';
import UserGraph from './UserGraph';

const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <Navbar />
    
      <div className="side-panel">
        <Link to="/admin/admindash">Dashboard</Link>
        <Link to="/admin/adminUser">Users</Link>
        <Link to="/admin/adminComment">Comments</Link>
        <Link to="/admin/adminPolls">Polls</Link>
        <Link to="/admin/adminRecords">Receipt</Link>

        {/* Add more links as needed */}
      </div>

    
      <div className="main-content">
        <header>
          <h1>Admin Panel</h1>
          <br></br>
        </header>
        <Outlet />
     
      </div>
    </div>
  );
};

export default AdminPanel;
