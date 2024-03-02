
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

  &:hover {
    transform: scale(1.05);
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
  cursor: pointer;
  font-size: 16px;
  text-decoration: none;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #27ae60;
  }
`;

const TopHeadings = () => {
  ;
  const [searchResults, setSearchResults] = useState([]);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    getNews();
  }, []);


  useEffect(() => {
    const id = window.localStorage.getItem("userID");

    const getSingleUser = async (id) => {
      // const apiUrl = `http://localhost:3000/getSingleUser?userID=${id}`;
      const apiUrl = `http://localhost:3000/getSingleUser/${id}`;

      try {
        // Make the API request with Fetch
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
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
      : 'https://newsapi.org/v2/top-headlines?country=us&apiKey=13aa3840ad6542d1b4f13aa762e81db9';

    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response);
        setSearchResults(response.data.articles);

        // STORING DATA INTO THE BACKEND : 
        console.log("Response : ", response);
        console.log("Response : ", response.data.articles);
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
              <CardImage src={value.urlToImage} alt="News" />
              <CardBody>
                <h5>{value.title}</h5>

                {userData.isPremium ?
                  <Link
                    to={`/newsDetails/${index}/${encodeURIComponent(value.title)}/${encodeURIComponent(value.urlToImage)}/${encodeURIComponent(value.description)}`}
                    state={{ articleData: value }}
                  >
                    <StyledButton target="_blank" rel="noopener noreferrer">
                      More
                    </StyledButton>
                  </Link> :
                  <Link
                    to={`/subscription`}
                  >
                    <StyledButton target="_blank" rel="noopener noreferrer">
                      Subscribe to Read
                    </StyledButton>
                  </Link>}
              </CardBody>
            </Card>
          ))}
        </CardContainer>
      </Container>
    </>
  );
};

export default TopHeadings;
