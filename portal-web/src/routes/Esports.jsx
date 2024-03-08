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
  max-height: 75vh; /* Set a maximum height for the container */
  overflow-y: auto; /* Add a scrollbar when content overflows */
`;

const Card = styled.div`
  width: 300px;
  height: 400px;
  margin: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease-in-out, overflow-y 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
    overflow-y: auto; /* Enable scrolling on hover */
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardBody = styled.div`
  padding: 20px;
  text-align: center;
`;

const StyledButton = styled.a`
  display: inline-block;
  background-color: #2ecc71;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  text-decoration: none;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #27ae60;
  }
`;

const Esports = () => {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const id = window.localStorage.getItem("userID");
    getSingleUser(id);
  }, []);

  useEffect(() => {
    getNews();
  }, []);

  const getSingleUser = async (id) => {
    const apiUrl = `http://localhost:3000/getSingleUser/${id}`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.data.isPremium) {
        // Handle non-premium user scenario
      }

      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching single user:', error);
    }
  };

  const getNews = () => {
    axios
      .get("https://newsapi.org/v2/everything?q=esports&apiKey=13aa3840ad6542d1b4f13aa762e81db9")
      .then((response) => {
        setData(response.data.articles.filter((item) => item.urlToImage)); // Filter out items without images
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
      });
  };

  return (
    <>
      <Navbar />
      <Container>
        <CardContainer>
          {data.map((value, index) => (
            <Card key={index}>
              <CardImage
                src={value.urlToImage}
                alt="News"
                onError={(e) => e.target.style.display = 'none'}
              />
              <CardBody>
                <h5>{value.title}</h5>
                {userData.isPremium ? (
                  <Link
                    to={`/newsDetails/${index}/${encodeURIComponent(value.title)}/${encodeURIComponent(
                      value.urlToImage
                    )}/${encodeURIComponent(value.description)}`}
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
              </CardBody>
            </Card>
          ))}
        </CardContainer>
      </Container>
    </>
  );
};

export default Esports 
