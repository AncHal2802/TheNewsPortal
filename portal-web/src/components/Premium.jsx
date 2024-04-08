import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import './Premium.css'


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
  const [payments, setPayments] = useState([]);
  const userID = window.localStorage.getItem('userID');
  console.log(userID);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/getSingleUser/${userID}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      }
    };
    console.log(user);

    if (userID) {
      fetchUser();
    }
  }, [userID]);

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

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/get-payments");
      const data = await response.json();
      setPayments(data.payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  let paymentAmount;
  let paymentCurrency;

  const getOptions = (planId, user) => {
    if (!user || !user.username) {
      console.error("User data is not available");
      return {};
    }

    // When initiating the payment
    paymentAmount = planId === "monthly" ? '2000' : '10000';
    paymentCurrency = 'INR';

    return {
      key: 'rzp_test_2LcW3MD6x5jzrt',
      amount: paymentAmount,
      currency: paymentCurrency,
      name: 'The News Portal',
      description: 'Subscription Payment',
      handler: function (response) {
        const paymentDetails = {
          userId: user.userId,
          username: user.username,
          paymentId: response.razorpay_payment_id,
          plan: planId,
          date: new Date().toISOString(),
          amount: paymentAmount,
          currency: paymentCurrency,
        };

        console.log('paymentDetails.amount:', paymentDetails.amount);
        console.log('paymentDetails.currency:', paymentDetails.currency, user?._id);

        console.log('Payment successful:', response);

        const newPaymentDetails = {
          userId: user?._id,
          email:user.email,
          username: user.username,
          paymentId: response.razorpay_payment_id,
          plan: planId,
          date: new Date().toISOString(),
          amount: paymentDetails.amount,  // Using the globally stored paymentAmount
          currency: paymentDetails.currency,  // Using the globally stored paymentCurrency
        };

        // Perform any additional actions, e.g., store payment details on the server
        storePaymentDetails(newPaymentDetails);
      }
    };
  };

  const handleSubscribe = (planId) => {
    if (!razorpayReady || !user || !user.username) {
      return console.error("Razorpay SDK is not ready or user data is not available.");
    }

    const options = getOptions(planId, user);
    const rzp1 = new window.Razorpay(options);

    rzp1.on('payment.success', function (response) {
      // Handle successful payment here
    });

    rzp1.on('payment.error', function (response) {
      // Handle payment failure here
      console.error('Payment failed:', response);
      alert('Payment failed. Please try again.');
    });

    rzp1.open();
  };

  const storePaymentDetails = (paymentDetails) => {
    // Make a POST request to your server to store payment details
    fetch('http://localhost:3000/store-payment-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentDetails),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Payment details stored successfully:', data);

        const expiryDate = new Date(data.expiryDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        });

        alert(`Payment successful! Your premium subscription is active until: ${expiryDate}`);
        navigate("/");
        fetchPayments();
      })
      .catch(error => {
        console.error('Error storing payment details:', error);
        alert('Payment successful, but an error occurred while processing. Please contact support.');
      });
  };

  return (
    <>
      <Navbar />
      <div style={{ marginTop: "6rem", textAlign: "center" }}>
        <br />  <br /> <br /> 
        <h1>Premium Subscriptions</h1>
        <br /> <br />
        {user && user.userType === "Admin" ? (
          <div style={{ width:"500px", border: "2px solid #2ecc71", borderRadius: "10px", padding: "20px", marginBottom: "20px", margin: "0 auto" }}>
            <span role="img" aria-label="Happy face" style={{ fontSize: "48px" }}>😊</span>
            <h3 style={{ fontSize: "30px", marginTop: "10px" }}>Admin Features</h3>
            <p style={{ fontSize: "28px", marginTop: "10px" }}>As an admin, you already have access to all premium features.</p>
          </div>
        ) : (
          <div className="subscriptions">
            <SubscriptionCard
              title="Monthly Subscription"
              price="₹20/month"
              benefits={[
                "Comment on News Posts",
                "Participate on Polls",
                "Read Article",
                
              ]}
              buttonText="Subscribe Now"
              onSubscribe={() => handleSubscribe("monthly")}
            />
            <SubscriptionCard
              title="Annual Subscription"
              price="₹100/year"
              benefits={[
                "Be a Premium User",
                "Unlock Comments Feature",
                "Give  Reviews to Articles",
                "Participate on Polls",
                "Entire Year subscription",
               
              ]}
              buttonText="Subscribe Now"
              onSubscribe={() => handleSubscribe("annual")}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Premium;
