import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './NewsDetails.css';

const NewsDetails = () => {
  const { index, title, urlToImage } = useParams();

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
      <p>Article Index: {index}</p>
      <p>Article Title: {title}</p>
      <img src={urlToImage} alt="Article" />

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
    </div>
  );
};

export default NewsDetails;
