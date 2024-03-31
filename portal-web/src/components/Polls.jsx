import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Polls.css'; // Import your CSS file
import { useParams } from 'react-router-dom';

const Polls = () => {
  const { title } = useParams();
  const [newsID, setNewsID] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [polls, setPolls] = useState([]);
  const [votedPolls, setVotedPolls] = useState([]);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  const userType = window.localStorage.getItem("userType");
  const userId = window.localStorage.getItem("userID");

  useEffect(() => {
    fetchPolls();
  }, []);

  useEffect(() => {
    fetchVotedPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/polls');
      console.log(response.data);
      setPolls(response.data);
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  };

  const fetchVotedPolls = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/polls/${userId}/voted`);
      setVotedPolls(response.data);
    } catch (error) {
      console.error('Error fetching voted polls:', error);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleVote = async (pollId, optionIndex, userId) => {
    try {
      // Check if the user has already voted
      const userHasVoted = votedPolls.includes(pollId);

      if (userHasVoted) {
        window.alert('You have already voted. Thanks for participating!');
        return;
      }

      // Make the API request to record the vote
      const response = await axios.post(
        `http://localhost:3000/api/polls/${pollId}/vote`,
        { optionIndex, userId }
      );

      if (response.status === 200) {
        // Update the poll options with the new vote count
        setPolls((prevPolls) =>
          prevPolls.map((poll) => {
            if (poll._id === pollId) {
              const updatedOptions = poll.options.map((opt, index) => {
                if (index === optionIndex) {
                  return { ...opt, votes: opt.votes + 1 };
                }
                return opt;
              });

              return { ...poll, options: updatedOptions };
            }
            return poll;
          })
        );

        // Mark the poll as voted by the current user
        setVotedPolls([...votedPolls, pollId]);
      } else {
        console.error('Failed to vote. Status:', response.status);
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleCreatePoll = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/polls/create', {
        question,
        options,
        newsID: title
      });

      const createdPoll = response.data;
      console.log('Poll created:', createdPoll);

      setPolls([...polls, { ...createdPoll }]);
      setQuestion('');
      setOptions(['', '']);
    } catch (error) {
      console.error('Error creating poll:', error.response);
    }
  };

  return (
    <div>
      {console.log('User Type:', userType)}
      {alreadyVoted && (
        <div>
          <p>You have already voted. Thanks for participating!</p>
        </div>
      )}
      {userType === 'Admin' && (
        <div className="create-poll-section">
          <h2>Create Poll</h2>
          <label>
            Question:
            <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
          </label>
          <h3>Options:</h3>
          {options.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <button className='remove' onClick={() => handleRemoveOption(index)}>
                Remove
              </button>
            </div>
          ))}
          <button className='options' onClick={handleAddOption}>
            Add Option
          </button>
          <button className='create' onClick={handleCreatePoll}>
            Create Poll
          </button>
        </div>
      )}

      <div className="vote-poll-section">
        <h2>Vote on Polls</h2>
        {polls.map((poll) => (
          poll.newsID === title && <div key={poll._id}>
            <h3>{poll.question}</h3>
            <ul>
              {poll.options.map((option, index) => (
                <li key={index}>
                  {option.text} - Votes: {option.votes}{' '}
                  <button
                    onClick={() => handleVote(poll._id, index)}
                    className={`vote-button ${votedPolls.includes(poll._id) ? 'voted' : ''}`}
                    disabled={alreadyVoted || votedPolls.includes(poll._id)}
                  >
                    {votedPolls.includes(poll._id) ? 'Voted' : 'Vote'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Polls;
