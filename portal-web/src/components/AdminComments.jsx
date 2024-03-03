import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentsList = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch comments from the API
    axios.get('http://localhost:3000/api/comments')
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      });
  }, []); // Empty dependency array to run the effect only once

  const handleDeleteComment = async (commentId) => {
    // Display a confirmation dialog
    const shouldDelete = window.confirm('Are you sure you want to delete this comment?');
  
    if (!shouldDelete) {
      return; // User canceled the deletion
    }
  
    try {
      // Delete comment using the API
      await axios.delete(`http://localhost:3000/api/comments/${commentId}`);
      
      // Remove the deleted comment from the state
      setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      
      {comments.map(comment => (
        <div key={comment._id} style={{
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
          <p style={{ margin: 0, marginBottom: '8px' }}><strong>News ID:</strong> {comment.newsId}</p>
          <p style={{ margin: 0, marginBottom: '8px' }}><strong>Comment:</strong> {comment.text}</p>
          <p style={{ margin: 0, marginBottom: '8px' }}><strong>User:</strong> {comment.userId ? comment.userId.name : 'Unknown User'}</p>
          <button style={{
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }} onClick={() => handleDeleteComment(comment._id)}>
            Delete Comment
          </button>
        </div>
      ))}
    </div>
  );
}

export default CommentsList;
