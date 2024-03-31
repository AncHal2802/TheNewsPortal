import React, { useState, useEffect } from 'react';

const AdminRecords = () => {
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    fetch('http://localhost:3000/api/get-payments')
      .then(response => response.json())
      .then(data => {
        // Check if data is an array, or an object with a 'payments' property
        const paymentsArray = Array.isArray(data) ? data : (data.payments || []);
        setPaymentData(paymentsArray);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []); 

  console.log(paymentData); // Log the type of paymentData

  return (
    <div>
      <h2>User Payment Details</h2>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Payment ID</th>
            <th>Plan</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {paymentData.map(payment => (
            <tr key={payment._id}>
              <td>{payment.userId}</td>
              <td>{payment.username}</td>
              <td>{payment.paymentId}</td>
              <td>{payment.plan}</td>
              <td>{payment.date}</td>
              <td>{payment.amount}</td>
--            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminRecords;
