import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import TopHeadings from '../routes/TopHeadings';
import io from 'socket.io-client';
import Polls from './Polls';
import randomColor from 'randomcolor';

const PageContainer = styled.div`
  display: flex;
`;

const TopHeading = styled.div`
  width: 30%;
  padding: 0 20px;
  box-sizing: border-box;
`;

const ContentContainer = styled.div`
  text-align: center;
  justify-content: center;
  margin-top: 8rem;
  flex-grow: 1;
  padding: 4px;
  box-sizing: border-box;
`;

const Info = styled.div`
  max-width: 100%;
  margin-top: 0;
`;

const InfoImage = styled.img`
  border-radius: 20px;
`;

const CommentBox = styled.div`
  text-align: left;
  margin-top: 20px;
  width: 100%;
  max-width: 800px; /* Increase the max-width as needed */
  margin: 0 auto;
`;

const CommentBoxTitle = styled.h2`
  margin-bottom: 10px;
  font-size: 1.5rem;
  color: #333;
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
`;

const CommentButton = styled.button`
  padding: 10px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
`;

const CommentsList = styled.ul`
  width: 100%;
  max-width: 900px; /* Increase the max-width as needed */
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 20px; /* Add margin-top as needed */
`;

const CommentItem = styled.li`
  background-color: #fff;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
  display: flex; /* Display items horizontally */
  flex-direction: column; /* Align items vertically */
`;
const CommentContainer = styled.div`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
`;

const CommentHeader = styled.div`
  text-align: left;
  background-color: #007bff;
  color: #fff;
  padding: 8px;
  border-radius: 4px;
`;;

const Strong = styled.strong`
  font-weight: bold;
`;

const CommentBody = styled.div`
  word-wrap: break-word;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
`;

const LoadingMessage = styled.p`
  margin-top: 10px;
  color: #007bff;
`;

const UserComment = styled.div`
  background-color: #e0f7fa;
`;

const OtherComment = styled.div`
  background-color: #f9f9f9;
`;

const NewsDetails = () => {
  const { title, urlToImage, description } = useParams();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const loggedInUserId = window.localStorage.getItem('userID');
  const socket = io('http://localhost:3000');

  const [userColors, setUserColors] = useState({});

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (comment.trim() !== '') {
      const userID = loggedInUserId;
      const newsId = title;
      const replyTo = replyToCommentId;

      try {
        setLoading(true);

        const response = await fetch('http://localhost:3000/comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userID, newsId: newsId, text: comment, replyTo: replyTo }),
        });

        if (response.ok) {
          setComment('');
          setReplyToCommentId(null);
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

  useEffect(() => {
    const fetchCommentsAndColors = async () => {
      try {
        const response = await fetch(`http://localhost:3000/show-comment?newsId=${title}&userID=${loggedInUserId}`);

        if (response.ok) {
          const commentsData = await response.json();

          const colors = {};
          commentsData.forEach(({ userId }) => {
            if (!colors[userId._id]) {
              colors[userId._id] = randomColor();
            }
          });

          setUserColors(colors);

          const formattedComments = commentsData.map(({ userId, text, replyTo }) => ({
            commentId: userId._id,
            userName: userId.name,
            text: text,
            replyTo: replyTo,
          }));

          const commentsWithReplies = formattedComments.reduce((acc, comment) => {
            if (!comment.replyTo) {
              acc.push(comment);
            } else {
              const parentCommentIndex = acc.findIndex((c) => c.commentId === comment.replyTo);
              if (parentCommentIndex !== -1) {
                if (!acc[parentCommentIndex].replies) {
                  acc[parentCommentIndex].replies = [];
                }
                acc[parentCommentIndex].replies.push(comment);
              }
            }
            return acc;
          }, []);

          setComments(commentsWithReplies.reverse());
        } else {
          console.error('Failed to fetch comments');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchCommentsAndColors();

    socket.on('commentAdded', (newComment) => {
      setUserColors((prevUserColors) => {
        const userId = newComment.userId._id;
        if (!prevUserColors[userId]) {
          return {
            ...prevUserColors,
            [userId]: randomColor(),
          };
        }
        return prevUserColors;
      });

      setComments((prevComments) => [newComment, ...prevComments]);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [title, loggedInUserId, socket]);

  return (
    <PageContainer>
      <TopHeading>
        <TopHeadings />
      </TopHeading>
      <ContentContainer>
        <Info>
          <h3>{title}</h3>
          <InfoImage src={urlToImage} alt="Article" />
          <p>{description}</p>
        </Info>
        <Polls articleTitle={title} />
        <CommentBox>
          <CommentBoxTitle>Comments</CommentBoxTitle>
          <CommentForm onSubmit={handleCommentSubmit}>
            <CommentTextarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Enter your comment"
              disabled={loading}
            ></CommentTextarea>
            <CommentButton type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Comment'}
            </CommentButton>
          </CommentForm>
          {loading && <LoadingMessage>Loading...</LoadingMessage>}
          <CommentsList>
            {comments.length > 0 ? (
              comments.map((c, index) => (
                <CommentItem
                  key={index}
                  className={`comment-item ${c.commentId === loggedInUserId ? 'user-comment' : 'other-comment'}`}
                >
                  <CommentContainer>
                    <CommentHeader style={{ backgroundColor: userColors[c.commentId] }}>
                      <Strong>{c.userName}</Strong>
                    </CommentHeader>
                    <CommentBody>{c.text}</CommentBody>
                    {c.replies && (
                      <CommentsList>
                        {c.replies.map((reply, replyIndex) => (
                          <CommentItem
                            key={replyIndex}
                            className={`comment-item ${reply.commentId === loggedInUserId ? 'user-comment' : 'other-comment'}`}
                          >
                            <CommentContainer>
                              <CommentHeader style={{ backgroundColor: userColors[reply.commentId] }}>
                                <Strong>{reply.userName}</Strong>
                              </CommentHeader>
                              <CommentBody>{reply.text}</CommentBody>
                            </CommentContainer>
                          </CommentItem>
                        ))}
                      </CommentsList>
                    )}
                  </CommentContainer>
                </CommentItem>
              ))
            ) : (
              <CommentItem>No comments available</CommentItem>
            )}
          </CommentsList>
        </CommentBox>
      </ContentContainer>
    </PageContainer>
  );
};

export default NewsDetails;
