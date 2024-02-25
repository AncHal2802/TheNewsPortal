// Poll.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Poll = () => {
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        // Fetch polls from the server
        axios.get('/api/polls')
            .then(response => setPolls(response.data))
            .catch(error => console.error('Error fetching polls:', error));
    }, []);

    const handleVote = (pollId, optionIndex) => {
        // Send a vote to the server
        axios.post(`/api/vote/${pollId}/${optionIndex}`)
            .then(response => setPolls(prevPolls => prevPolls.map(poll => (poll._id === pollId ? response.data : poll))))
            .catch(error => console.error('Error voting:', error));
    };

    return (
        <div>
            {polls.map(poll => (
                <div key={poll._id}>
                    <h2>{poll.question}</h2>
                    <ul>
                        {poll.options.map((option, index) => (
                            <li key={index}>
                                {option.option} - Votes: {option.votes}
                                <button onClick={() => handleVote(poll._id, index)}>Vote</button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Poll;
