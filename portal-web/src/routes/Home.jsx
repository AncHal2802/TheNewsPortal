import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import "../components/Hero.css"
import NewDis from '../components/NewDis';
import Footer from '../components/footer';
import MovingSlide from '../components/MovingSlide';

const Home = () => {

  const images = [
    ' https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
    'https://media.istockphoto.com/id/1401514081/video/cinematic-aerial-view-of-bandra-worli-sea-link-in-mumbai-india.jpg?s=640x640&k=20&c=4fmTxZqCxhoCjCE4SvF8uHUxOJY5q7_nx7PiMu97qpU='



  ];
  return (
    <>
      <Navbar />
      <Hero
        cName="hero"
        heroImg="https://c4.wallpaperflare.com/wallpaper/917/114/344/planet-earth-universe-darkness-wallpaper-preview.jpg"
        title="Engage, Explore, Evolve"
        text="News Made Easy"
        btnText="Explore"
        url='top-heading'
        btnClass="show"
        
        btnText2="Subscription"
        url2='subscription'
        btnClass2="show"
      />
      <NewDis />

      <MovingSlide images={images} />  <Footer />
    </>
  )
}

export default Home