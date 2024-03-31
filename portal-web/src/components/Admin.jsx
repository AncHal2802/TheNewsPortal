import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate=useNavigate()
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/getAllUser");
        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }
        const data = await response.json();
        setAllUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      fetch("http://localhost:3000/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          userID: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.data);
          fetchUserList();
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
        });
    }
  };

  const fetchUserList = () => {
    setLoading(true);
    fetch("http://localhost:3000/getAllUser")
      .then((res) => res.json())
      .then((data) => {
        setAllUsers(data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setError('Error fetching user data');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='dataAd'>
      <h2>User List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
            
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => deleteUser(user._id, user.name)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;