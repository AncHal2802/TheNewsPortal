import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { CiLogin } from 'react-icons/ci';

function UpdateUser() {
  const { id,email,name } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/getAllUser/${id}`);
        const userData = response.data;

        setUser({
          name: userData.name,
          email: userData.email,
        });
      } catch (error) {
        console.error('Error fetching user:', error.message);
        // Handle error (e.g., show an error message)
      }
    };

    fetchUser();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/updateUser/${id}`, user);

      if (response.status === 200) {
        console.log('User updated successfully:', response.data);
        // Redirect to the user list page after a successful update
        navigate('/user-list'); // Replace '/user-list' with your desired route
      } else {
        console.error('Failed to update user:', response.statusText);
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error updating user:', error.message);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div>
      <h2>Edit User</h2>
      <input
        type="text"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
      <input
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <button onClick={handleUpdate}>Update User</button>
    </div>
  );
}

export default UpdateUser;
