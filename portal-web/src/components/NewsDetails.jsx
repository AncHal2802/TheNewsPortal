import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './NewsDetails.css';
import TopHeadings from '../routes/TopHeadings';

const NewsDetails = () => {
  const { index, title, urlToImage, description } = useParams();

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() !== '') {
      // Update comments array or send the comment to the server
      setComments((prevComments) => [...prevComments, comment]);
      // Clear the comment input
      setComment('');
    }
  };

  return (
    <div className='Info'>
      <h1>News Details</h1>
      <img src={urlToImage} alt="Article" />
  
      <h3>{title}</h3>
      <p>{description}</p>

      

      <div className="commentBox">
        <h2>Comments</h2>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="Enter your comment"
          ></textarea>
          <button type="submit">Submit Comment</button>
        </form>
        <ul>
          {comments.map((c, index) => (
            <li key={index}>{c}</li>
          ))}
        </ul>
      </div>
      <div className='flex-div'> 
      <TopHeadings />
      </div>
    </div>
  );
};

export default NewsDetails;
