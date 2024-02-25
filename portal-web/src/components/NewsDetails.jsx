// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import './NewsDetails.css';
// import TopHeadings from '../routes/TopHeadings';
// import io from 'socket.io-client';

// const NewsDetails = () => {
//   const { title, urlToImage, description } = useParams();
//   const [comment, setComment] = useState('');
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const socket = io('http://localhost:3000'); // Connect to the Socket.io server

//   const handleCommentChange = (e) => {
//     setComment(e.target.value);
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();

//     if (comment.trim() !== '') {
//       const userID = window.localStorage.getItem('userID');
//       const newsId = title;

//       try {
//         setLoading(true);

//         const response = await fetch('http://localhost:3000/comment', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ userId: userID, newsId: newsId, text: comment }),
//         });

//         if (response.ok) {
//           // Clear the comment input
//           setComment('');
//         } else {
//           console.error('Failed to add comment');
//         }
//       } catch (error) {
//         console.error('Error adding comment:', error);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const fetchComments = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/show-comment?newsId=${title}&userID=${localStorage.getItem('userID')}`);

//       if (response.ok) {
//         const commentsData = await response.json();
//         console.log('Comments fetched:', commentsData);

//         // Assuming the comment data structure is like { userId: { name: "user name" }, text: "comment text" }
//         const formattedComments = commentsData.map(({ userId, text }) => ({
//           userName: userId.name,
//           text: text,
//         }));

//         setComments(formattedComments);
//       } else {
//         console.error('Failed to fetch comments');
//       }
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//     }
//   };

//   // Fetch Comments with Socket
//   useEffect(() => {
//     fetchComments();

//     socket.on('commentAdded', (newComment) => {
//       setComments((prevComments) => [...prevComments, newComment]);
//     });

//     socket.on('disconnect', () => {
//       console.log('Socket disconnected');
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [title, socket]);

//   return (
//     <div className="page-container">
//       <div className="top-heading">
//         <TopHeadings />
//       </div>
//       <div className="content-container">
//         <div className='Info'>
//           <h3>{title}</h3>
//           <img src={urlToImage} alt="Article" />
//           <p>{description}</p>
//         </div>
//         <div className="commentBox">
//           <h2>Comments</h2>
//           <form onSubmit={handleCommentSubmit}>
//             <textarea
//               value={comment}
//               onChange={handleCommentChange}
//               placeholder="Enter your comment"
//               disabled={loading}
//             ></textarea>
//             <button type="submit" disabled={loading}>
//               {loading ? 'Submitting...' : 'Submit Comment'}
//             </button>
//           </form>
//           {loading && <p>Loading...</p>}
//           <ul>
//             {comments.length > 0 ? (
//               comments.map((c, index) => (
//                 <li key={index}>
//                   <strong>{c.userName}:</strong> {c.text}
//                 </li>
//               ))
//             ) : (
//               <li>No comments available</li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewsDetails;

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './NewsDetails.css';
import TopHeadings from '../routes/TopHeadings';
import io from 'socket.io-client';
import axios from 'axios';

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

const NewsDetails = () => {
  const { title, urlToImage, description } = useParams();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [polls, setPolls] = useState([]);
  const socket = io('http://localhost:3000');

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

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:3000/show-comment?newsId=${title}`);

      if (response.ok) {
        const commentsData = await response.json();

        const formattedComments = commentsData.map(({ userId, text }) => ({
          userId: userId._id,
          userName: userId.name,
          text: text,
        }));

        setComments(formattedComments.reverse());
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchPolls = async () => {
    try {
      const response = await axios.get('/api/polls');
      setPolls(response.data);
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  };

  useEffect(() => {
    Promise.all([fetchComments(), fetchPolls()])
      .then(() => {
        socket.on('commentAdded', (newComment) => {
          setComments((prevComments) => [newComment, ...prevComments]);
        });

        socket.on('disconnect', () => {
          console.log('Socket disconnected');
        });

        return () => {
          socket.disconnect();
        };
      })
      .catch((error) => {
        console.error('Error during fetch:', error);
      });
  }, [title, socket]);

  const handleVote = async (pollId, optionIndex) => {
    try {
      const userID = window.localStorage.getItem('userID');
      const response = await fetch('http://localhost:3000/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userID, pollId: pollId, optionIndex: optionIndex }),
      });

      if (response.ok) {
        setPolls((prevPolls) =>
          prevPolls.map((poll) => {
            if (poll._id === pollId) {
              const updatedOptions = [...poll.options];
              updatedOptions[optionIndex].votes++;
              return { ...poll, options: updatedOptions };
            }
            return poll;
          })
        );
      } else {
        console.error('Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

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
        <div>
          {/* Poll section */}
          {Array.isArray(polls) && polls.map((poll) => (
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
      </div>
    </div>
  );
};

export default NewsDetails;


