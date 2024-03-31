import React from 'react';
import Card1 from './Card1';
import Logo1 from '../../src/images/portal.jpeg';
import '../components/About.css'
import AuthenImg from '../../src/images/image-2.png';
import Navbar from './Navbar';

const About = () => {
  return (
    <div className='NewDes'>
     <div className="container">
    <img src={Logo1} alt="Portal Logo" className="logoPortal" />
   
</div>
 <h1>What is website about?</h1>
      <div className='first-des'>
        <div className='des-text'>
          <h2>Latest News</h2>
          <p>Get the latest news from around the world</p>
          <p>Looking for a one-stop-shop for all the latest buzz in sports, politics, and crazy happenings? You've found it!</p>
        </div>
        <div className='image'>
          <img alt='bat' src="https://i.pinimg.com/564x/8d/2e/c7/8d2ec72b8a3c86f9c143c61516ea8631.jpg"/>
          <img alt='ball' src="https://i.pinimg.com/564x/d2/a3/7e/d2a37e72488c3cce5a5f6bfa3e15ecaf.jpg"/>
        </div>
      </div>
      <div className='second-des'>
        <div className='des-text'>
          <h2>Enjoy Different features! </h2>
          <p>News made more interesting!</p>
          <p>Make it more interactive with polls and comments, so you can share your opinion on the news</p>
        </div>
        <div className='image'>
          <img alt='bat' src="https://img.freepik.com/premium-vector/man-writing-laptop_23-2147495329.jpg"/>
          <img alt='ball' src="https://images.thequint.com/thequint%2F2023-11%2F920851ea-eea9-4a8a-90cf-8461df56c103%2Felection_and_social_poll_concept_tiny_voters_male_and_female_characters_casting_ballots_at_jpg_s_102.jpg"/>
        </div>
      </div>
      <div className='third-des'>
        <div className='des-text'>
          <h2>Authenticate and Reliable</h2>
          <p>Get real and authentic news</p>
          <p>You can get your daily news fix from us because we make sure it's authentic</p>
        </div>
        <div className='image1'>
          <img alt='bat' src="https://www.shutterstock.com/image-vector/vector-illustration-approved-label-flag-600nw-1506750614.jpg"/>
        </div>
      </div>
      </div>

      
  );
};

export default About;
