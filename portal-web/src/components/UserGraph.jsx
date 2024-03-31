import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './UserGraph.css'
const UserGraph = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/getAllUser');
        const data = await response.json();
        console.log('Fetched data:', data);

        const freeUsers = data.filter(user => !user.isPremium).length;
        const paidUsers = data.filter(user => user.isPremium).length;
        const totalUsers = data.length;

        // Set the data for the chart
        setUserData([
          { name: 'Total Users', total: totalUsers },
          { name: 'Free Users', free: freeUsers },
          { name: 'Paid Users', paid: paidUsers },
        ]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='bar'>

      <BarChart width={1000} height={800} data={userData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#36A2EB" />
        <Bar dataKey="free" fill="#FFCE56" />
        <Bar dataKey="paid" fill="#FF6384" />
      </BarChart>
    </div>
  );
};

export default UserGraph;
