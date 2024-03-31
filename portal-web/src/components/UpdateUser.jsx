import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    email: '',
  });

  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/getUser/${id}`);
        const userData = response.data.data;

        setUser({
          name: userData.name,
          email: userData.email,
        });
      } catch (error) {
        console.error('Error fetching user:', error.message);
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
        navigate('/user-list');
      } else {
        console.error('Failed to update user:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user:', error.message);
    }
  };

  const toggleEditMode = (field) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [field]: !prevEditMode[field],
    }));
  };

  return (
    <div>
      <h2>Edit User</h2>
      <label>
        Name:
        {editMode.name ? (
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        ) : (
          <span onClick={() => toggleEditMode('name')}>{user.name}</span>
        )}
      </label>
      <label>
        Email:
        {editMode.email ? (
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        ) : (
          <span onClick={() => toggleEditMode('email')}>{user.email}</span>
        )}
      </label>
      <button onClick={handleUpdate}>Update User</button>
    </div>
  );
}

export default UpdateUser;
