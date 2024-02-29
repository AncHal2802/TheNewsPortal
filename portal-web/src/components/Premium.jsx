import React, { useEffect, useState } from 'react';
import './Premium.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link



const SubscriptionCard = ({ title, price, benefits, buttonText, onSubscribe }) => {
  return (
    
    <div className="subscription-card">
      
      <h3 className="card-title">{title}</h3>
      <p className="card-price">{price}</p>
      <ul className="card-benefits">
        {benefits.map((benefit, index) => (
          <li key={index}>{benefit}</li>
        ))}
      </ul>
      <button onClick={onSubscribe} className="card-button">{buttonText}</button>
    </div>
  );
};

const Premium = () => {
  const [razorpayReady, setRazorpayReady] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    if (!window.Razorpay) {
      loadScript('https://checkout.razorpay.com/v1/checkout.js').then((loaded) => {
        if (loaded) {
          console.log("Razorpay SDK loaded.");
          setRazorpayReady(true);
        } else {
          console.error("Failed to load Razorpay SDK.");
        }
      });
    } else {
      setRazorpayReady(true);
    }
  }, []);

  const handleSubscribe = (planId) => {
    if (!razorpayReady) {
      console.error("Razorpay SDK is not ready.");
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    const updatedUser = { ...user, isPremium: true };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  
    const options = getOptions(planId, user);
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  
  const getOptions = (planId, user) => {
    return {
      key: 'rzp_test_2LcW3MD6x5jzrt',
      amount: planId === "monthly" ? '2000' : '10000',
      currency: 'INR',
      name: 'The News Portal',
      description: 'Subscription Payment',
      //image: '../images/portal.jpeg',
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        //navigate('../routes/Home');
        const paymentDetails = {
          userId: user?._id, 
          paymentId: response.razorpay_payment_id,
          plan: planId,
          date: new Date().toISOString(),
        };
        console.log("Before fetch:", paymentDetails);

        fetch('http://localhost:3000/api/store-payment-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentDetails),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Payment details stored successfully:', data);
          navigate("/Home");
          if (data.message && data.message.startsWith('Failed to send receipt email')) {
            console.error('Failed to send receipt email:', data.error);
          } else {
            // Optionally handle further logic after confirmation
          }
        })
          // Optionally handle further logic after confirmation
      
        .catch(error => {
          console.error('Error:', error);
        });
      },
      theme: {
        color: '#0056b3'
      }
    };
  };
  
  return (
    <>
    <Navbar />
    <div className="premium-container">
      <br />  <br /> <br /> <br /> <br />
      <br /> <br /> 
      <h2>Premium Subscriptions</h2>
      <br /> <br />
      
      <div className="subscriptions">
      
        <SubscriptionCard
          title="Monthly Subscription"
          price="₹20/month"
          benefits={[
            "Font customization",
            "Comment to a book",
            "Unlock AudioBooks",
            "Priority customer support",
          ]}
          buttonText="Subscribe Now"
          onSubscribe={() => handleSubscribe("monthly")}
        />
        <SubscriptionCard
          title="Annual Subscription"
          price="₹100/year"
          benefits={[
            "Font customization",
            "Comment to a book",
            "Unlock AudioBooks",
            "Priority customer support",
            "2 months free",
            "Unlock all features",
            "Pay once in a while and just Read",
          ]}
          buttonText="Subscribe Now"
          onSubscribe={() => handleSubscribe("annual")}
        />
      </div>
     
    </div>
    </>
  );
};

export default Premium;