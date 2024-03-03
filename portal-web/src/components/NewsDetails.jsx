import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './NewsDetails.css';
import TopHeadings from '../routes/TopHeadings';
import io from 'socket.io-client';
import Polls from './Polls';

const NewsDetails = () => {
  const { title, urlToImage, description } = useParams();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userColors, setUserColors] = useState({});
  const userType = window.localStorage.getItem("userType");

  const socket = io('http://localhost:3000'); // Connect to the Socket.io server

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (comment.trim() !== '') {
      const userID = window.localStorage.getItem('userID');
      const newsId = title;

      try {
        setLoading(true);

        const response = await fetch('http://localhost:3000/comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userID, newsId: newsId, text: comment }),
        });

        if (response.ok) {
          // Clear the comment input
          setComment('');
        } else {
          console.error('Failed to add comment');
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  
const getColorForUserInCommentBox = (() => {
  const colorMap = {};

  return (userId) => {
    if (!colorMap[userId]) {
      const hue = Object.keys(colorMap).length * 60;
      const saturation = 50;
      const lightness = 70;
      colorMap[userId] = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    return colorMap[userId];
  };
})();

  useEffect(() => {
    const fetchCommentsAndColors = async () => {
      try {
        const response = await fetch(`http://localhost:3000/show-comment?newsId=${title}&userID=${localStorage.getItem('userID')}`);

        if (response.ok) {
          const commentsData = await response.json();

          // Collect unique user IDs from comments
          const uniqueUserIds = Array.from(new Set(commentsData.map(({ userId }) => userId._id)));

          // Generate colors for each user ID
          const colors = uniqueUserIds.reduce((acc, userId, index) => {
            const hue = index * 60;
            const saturation = 50;
            const lightness = 70;
            acc[userId] = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            return acc;
          }, {});

          // Set the colors in the state
          setUserColors(colors);

          // Assuming the comment data structure is like { userId: { name: "user name" }, text: "comment text" }
          const formattedComments = commentsData.map(({ userId, text }) => ({
            userName: userId.name,
            text: text,
          }));

          setComments(formattedComments);
        } else {
          console.error('Failed to fetch comments');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchCommentsAndColors();

    socket.on('commentAdded', (newComment) => {
      // Update user colors when a new comment is added
      setUserColors((prevUserColors) => {
        const userId = newComment.userId._id;
        if (!prevUserColors[userId]) {
          // Generate color for the new user
          const hue = Object.keys(prevUserColors).length * 60;
          const saturation = 50;
          const lightness = 70;
          return {
            ...prevUserColors,
            [userId]: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
          };
        }
        return prevUserColors;
      });

      // Update comments
      setComments((prevComments) => [...prevComments, newComment]);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [title, socket]);

  return (
    <div className="page-container">
      <div className="top-heading">
        <TopHeadings />
      </div>
      <div className="content-container">
        <div className='Info'>
          <h3>{title}</h3>
          <img src={urlToImage} alt="Article" />
          <p>{description}</p>
        </div>
        <Polls articleTitle={title} />
        <div className="commentBox">
          <h2>Comments</h2>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Enter your comment"
              disabled={loading}
            ></textarea>
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Comment'}
            </button>
          </form>
          {loading && <p>Loading...</p>}
          <ul className="comments-list">
            {comments.length > 0 ? (
              comments.map((c, index) => (
                <li key={index} className="comment-item">
                  <div className="comment-header" style={{ backgroundColor: getColorForUserInCommentBox(c.userId) }}>
                    <strong>{c.userName}</strong>
                  </div>
                  <div className="comment-body">
                    {c.text}
                  </div>
                </li>
              ))
            ) : (
              <li>No comments available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;
