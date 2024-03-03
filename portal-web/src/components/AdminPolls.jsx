import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPolls = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    // Fetch polls from the API
    axios.get('http://localhost:3000/api/polls')
      .then(response => {
        setPolls(response.data);
      })
      .catch(error => {
        console.error('Error fetching polls:', error);
      });
  }, []); // Empty dependency array to run the effect only once

  const handleDeletePoll = async (pollId) => {
    // Display a confirmation dialog
    const shouldDelete = window.confirm('Are you sure you want to delete this poll?');
  
    if (!shouldDelete) {
      return; // User canceled the deletion
    }
  
    try {
      // Delete poll using the API
      await axios.delete(`http://localhost:3000/api/polls/${pollId}`);
      
      // Remove the deleted poll from the state
      setPolls(prevPolls => prevPolls.filter(poll => poll._id !== pollId));
    } catch (error) {
      console.error('Error deleting poll:', error);
    }
  };

  const calculateAverageVotes = (votes, totalOptions) => {
    return totalOptions > 0 ? (votes / totalOptions).toFixed(2) : 0;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      {polls.map(poll => (
        <div key={poll._id} style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          margin: '10px',
          padding: '15px',
          width: '300px', // Adjust the width as needed
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <p style={{ margin: 0, marginBottom: '8px' }}><strong>Poll ID:</strong> {poll._id}</p>
          <p style={{ margin: 0, marginBottom: '8px' }}><strong>Question:</strong> {poll.question}</p>
          <p style={{ margin: 0, marginBottom: '8px' }}><strong>Total Votes:</strong> {poll.votes}</p>
          
          {/* Display options and their vote counts along with average votes */}
          <div style={{ marginTop: '10px' }}>
            <strong>Options:</strong>
            <ul>
              {poll.options.map((option, index) => (
                <li key={index}>
                  {option.text} - Votes: {option.votes} (Average: {calculateAverageVotes(option.votes, poll.options.length)})
                </li>
              ))}
            </ul>
          </div>
          
          <p style={{ margin: 0, marginBottom: '8px' }}><strong>Number:</strong> {poll.number}</p>
          
          <button style={{
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }} onClick={() => handleDeletePoll(poll._id)}>
            Delete Poll
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminPolls;
