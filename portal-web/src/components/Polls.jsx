import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Polls.css'; // Import your CSS file

const Polls = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [polls, setPolls] = useState([]);

  const userType = window.localStorage.getItem("userType");

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/polls');
      setPolls(response.data);
    } catch (error) {
      console.error('Error fetching polls:', error);
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

  const handleVote = async (pollId, optionIndex) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/polls/${pollId}/vote`,
        { optionIndex }
      );

      setPolls((prevPolls) =>
        prevPolls.map((poll) => {
          if (poll._id === pollId) {
            const updatedOptions = poll.options.map((opt, index) => {
              if (index === optionIndex) {
                return { ...opt, votes: opt.votes + 1 };
              }
              return opt;
            });

            return { ...poll, options: updatedOptions, voted: true };
          }
          return poll;
        })
      );
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleCreatePoll = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/polls/create', {
        question,
        options,
      });

      const createdPoll = response.data;
      console.log('Poll created:', createdPoll);

      setPolls([...polls, { ...createdPoll, voted: false }]);
      setQuestion('');
      setOptions(['', '']);
    } catch (error) {
      console.error('Error creating poll:', error.response);
    }
  };

  return (
    <div>
      {console.log('User Type:', userType)} 
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
          <div key={poll._id}>
            <h3>{poll.question}</h3>
            <ul>
              {poll.options.map((option, index) => (
                <li key={index}>
                  {option.text} - Votes: {option.votes}{' '}
                  <button
                    onClick={() => handleVote(poll._id, index)}
                    disabled={poll.voted}
                    className={poll.voted ? 'voted-button' : 'vote-button'}
                  >
                    {poll.voted ? 'Voted' : 'Vote'}
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
