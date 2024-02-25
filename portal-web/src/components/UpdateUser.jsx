import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UpdateUser = () => {
  const location = useLocation();
 const { _id } = useParams();
console.log('_id:', _id);


  const [values, setValues] = useState({
    id: _id,
    name: null,
    email: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/getAllUser/${_id}`);
        const user = response.data.user;

        if (user) {
          setValues((prevValues) => ({
            ...prevValues,
            id: user._id,  
            name: user.name,
            email: user.email,
          }));
        }
      } catch (error) {
        console.error('Error fetching user:', error.message);
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [_id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:3000/updateUser/${values.id}`, values);

      if (response.status === 200) {
        console.log('User updated successfully:', response.data);
      } else {
        console.error('Failed to update user:', response.statusText);
        setError('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error.message);
      setError('Error updating user');
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleUpdate}>
            <div>
              <label htmlFor="name">Name: </label>
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={values.name || ''}
                onChange={(e) => setValues((prevValues) => ({ ...prevValues, name: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={values.email || ''}
                onChange={(e) => setValues((prevValues) => ({ ...prevValues, email: e.target.value }))}
              />
            </div>
            <br />
            <button type="submit">Update</button>
          </form>
        </>
      )}
    </div>
  );
};

export default UpdateUser;
