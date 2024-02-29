// DateTimeDisplay.js
import React, { useState, useEffect } from 'react';

const DateTimeDisplay = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update the date and time every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const formattedDateTime = currentDateTime.toLocaleString();

  return (
    <div style={containerStyle}>
      <p style={containerStyle}>{formattedDateTime}</p>
    </div>
  );
};

const containerStyle = {
  textAlign: 'center',
  padding: '3px',
  marginBottom: '2px',
};

const paragraphStyle = {
  fontSize: '15px',
  margin: '0',
  color: '#0056b3',
};

export default DateTimeDisplay;
