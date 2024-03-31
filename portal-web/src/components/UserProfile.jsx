import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  width:120px; 
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: 8px;
  background-size: cover;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  padding: 8px;
  border-radius: 4px;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
`;

const Username = styled.span`
  font-weight: bold;
  margin-bottom: 4px;
  font-size: 1.5rem;
`;

const UserType = styled.span`
  font-size: 1rem;
  margin-bottom: 8px;
  color:green;

`;

const LogoutButton = styled.button`
  background-color: #e74c3c;
  color: #fff;
  border: none;
  padding: 8px;
  cursor: pointer;
  margin-top: 8px;
`;

const UserProfile = ({ userID }) => {
  const dummyImageURL = '../videos/portal.jpeg'

  const id = window.localStorage.getItem("userID");
  const logged = window.localStorage.getItem("userLogged");

  const [user, setUser] = useState(null);
  const [isInfoVisible, setInfoVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/getSingleUser/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        console.log('User Data:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUser();
  }, [id]);

  const handleLogout = () => {
    window.localStorage.clear();
    window.location.replace("/login");
  };

  return (
    <ProfileContainer
      to={`/profile/${id}`} 
      onMouseEnter={() => setInfoVisible(true)}
      onMouseLeave={() => setInfoVisible(false)}
    >
       <ProfileImage
        src='https://toppng.com/uploads/preview/circled-user-icon-user-pro-icon-11553397069rpnu1bqqup.png'
        alt="jai"
        onError={(e) => {
          e.target.style.display = 'none'; 
        }}/>  
        
  {isInfoVisible && user && (
        <ProfileInfo>
          <Username>{user.username}</Username>
          <UserType>
            {user.isPremium ? 'Premium' : 'Free'}
          </UserType>
          {logged === "true" && (
            <LogoutButton  to='/login'onClick={handleLogout}>Logout</LogoutButton>
          )}
        </ProfileInfo>
      )}
    </ProfileContainer>
  );
};

export default UserProfile;