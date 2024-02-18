import React from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MovingSlide = ({ images }) => {
  return (
    <Carousel>
      {images.map((imageUrl, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={imageUrl}
            alt={`Slide ${index + 1}`}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default MovingSlide;
