import { useEffect, useState } from 'react';
import './Hero.css';
import Footer from './footer';

const Hero = (props) => {

  const [userData, setUserData] = useState({});

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


  return (
    <>
      <div className={props.cName}>
        <img alt="HeroImg" src={props.heroImg} />
      </div>

      <div className='hero-text'>
        <h1>{props.title}</h1>
        <p>{props.text}</p>
        <a href={props.url} className={props.btnClass}>
          {props.btnText}
        </a>

        {!userData.isPremium &&
          < a href={props.url2} className={props.btnClass2}>
            {props.btnText2}
          </a>
        }
        
      </div >
  
    </>
  );
};

export default Hero;
