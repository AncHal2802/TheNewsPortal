import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
  margin-top: 6rem;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const Card = styled.div`
  width: 300px;
  height: 400px;
  margin: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: scale(1.05);
  }
`;

const CardImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ScrollableCardBody = styled.div`
  flex-grow: 1;
  padding: 20px;
  text-align: center;
  overflow: hidden;
  transition: overflow 0.3s ease-in-out;

  &:hover {
    overflow: auto;
  }
`;

const StyledButton = styled.a`
  display: inline-block;
  background-color: #2ecc71;
  color: #fff;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  text-decoration: none;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #27ae60;
  }
`;

const Crypto = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    getNews();
  }, []);

  useEffect(() => {
    const id = window.localStorage.getItem('userID');

    const getSingleUser = async (id) => {
      const apiUrl = `http://localhost:3000/getSingleUser/${id}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching single user:', error);
      }
    };

    getSingleUser(id);
  }, []);

  const getNews = (query = '') => {
    const apiUrl = query
    
    ? `https://newsapi.org/v2/everything?q=${query}&apiKey=13aa3840ad6542d1b4f13aa762e81db9`
    : 'https://newsapi.org/v2/everything?q=crypto&apiKey=13aa3840ad6542d1b4f13aa762e81db9';

    axios
      .get(apiUrl)
      .then((response) => {
        setSearchResults(response.data.articles);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSearch = (query) => {
    getNews(query);
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <Container>
        <CardContainer>
          {searchResults.map((value, index) => (
            <Card key={index}>
               <ScrollableCardBody>
              <CardImageContainer>
                {value.urlToImage && (
                  <CardImage src={value.urlToImage} alt="News" />
                )}
              </CardImageContainer>

                <h5>{value.title}</h5>
                {userData.isPremium || userData.userType === 'Admin' ? (
                  <Link
                    to={`/newsDetails/${index}/${encodeURIComponent(
                      value.title
                    )}/${encodeURIComponent(value.urlToImage)}/${encodeURIComponent(
                      value.description
                    )}/${encodeURIComponent(value.url)}`}
                    state={{ articleData: value }}
                  >
                    <StyledButton target="_blank" rel="noopener noreferrer">
                      More
                    </StyledButton>
                  </Link>
                ) : (
                  <Link to={`/subscription`}>
                    <StyledButton target="_blank" rel="noopener noreferrer">
                      Subscribe to Read
                    </StyledButton>
                  </Link>
                )}
              </ScrollableCardBody>
            </Card>
          ))}
        </CardContainer>
      </Container>
    </>
  );
};

export default Crypto;
