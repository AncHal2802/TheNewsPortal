import React from 'react';
import './Hero.css'; 

const Hero = (props) => {
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

        {/* subscription */}
        <a href={props.url2} className={props.btnClass2}>
          {props.btnText2}
        </a>
      </div>
    </>
  );
};

export default Hero;
