// AdminConfig.jsx
import React from 'react';
import AdminPanel from './AdminPanel';
import Admin from './Admin';

const AdminConfig = () => {
  const links = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/adminUser', label: 'Users' },
    { to: '/admin/Acomment', label: 'Comment' },
    {to:'/admin/Apolls',label:'Polls'}
    // Add more links as needed
  ];

  return <AdminPanel links={links} adminComponent={<Admin />} />;
};

export default AdminConfig;
