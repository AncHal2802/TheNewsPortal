// AdminPanel.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import "./AdminPanel.css"

const AdminPanel = () => {
  return (
    <div className="admin-panel">
      {/* Side Panel */}
      <div className="side-panel">
        <Link to="/admin/dashboard">Read Me</Link>
        <Link to="/admin/adminUser">Users</Link>
        <Link to="/admin/adminComment">Comments</Link>
        <Link to="/admin/adminPolls">Polls</Link>
        <Link to="/admin/adminRecords">Receipt</Link>

        {/* Add more links as needed */}
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header>
          <h1>Admin Panel</h1>
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
