import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import { useSelector } from 'react-redux';
import clientServer from '@config/index';
import { io } from 'socket.io-client';

const CommentModal = ({ post, onClose }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const authState = useSelector(state => state.auth);
  const socket = useRef();
  const modalRef = useRef();
  
  useEffect(() => {
    // Fetch comments for this post
    const fetchComments = async () => {
      try {
        const response = await clientServer.get(`/all_comments?post_Id=${post._id}`);
        setComments(response.data || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
    
    // Set up event listener for ESC key and outside click
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [post._id, onClose]);
  
  // Initialize socket connection
  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
    
    // Listen for new comments
    socket.current.on('comment_added', (newComment) => {
      if (newComment.postId === post._id) {
        setComments(prevComments => [newComment, ...prevComments]);
      }
    });
    
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [post._id]);
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await clientServer.post('/comment_on_post', {
        token: localStorage.getItem('token'),
        post_Id: post._id,
        commentBody: commentText
      });
      
      // Create a new comment object to add to the UI immediately
      const newComment = {
        _id: Date.now().toString(),
        userId: {
          _id: authState.user?.userId?._id || authState.user?._id,
          name: authState.user?.userId?.name || authState.user?.name,
          username: authState.user?.userId?.username || authState.user?.username,
          ProfilePicture: authState.user?.userId?.ProfilePicture || authState.user?.ProfilePicture
        },
        postId: post._id,
        commment: commentText,
        createdAt: new Date().toISOString()
      };
      
      // Add to local state
      setComments(prevComments => [newComment, ...prevComments]);
      
      // Emit socket event
      socket.current.emit('new_comment', newComment);
      
      // Reset form
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Comments</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.commentForm}>
          <img 
            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${authState.user?.userId?.ProfilePicture || authState.user?.ProfilePicture || 'default.jpg'}`} 
            alt={authState.user?.userId?.name || authState.user?.name || 'User'} 
            className={styles.userImage}
          />
          <form onSubmit={handleSubmitComment} className={styles.form}>
            <input 
              type="text" 
              placeholder="Add a comment..." 
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)}
              className={styles.commentInput}
              required
            />
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting || !commentText.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </form>
        </div>
        
        <div className={styles.commentsList}>
          {loading ? (
            <p className={styles.loadingText}>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment._id} className={styles.commentItem}>
                <img 
                  src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${comment.userId?.ProfilePicture || 'default.jpg'}`} 
                  alt={comment.userId?.name} 
                  className={styles.commentUserImage}
                />
                <div className={styles.commentContent}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentUserName}>{comment.userId?.name}</span>
                    <span className={styles.commentTime}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={styles.commentText}>{comment.commment || comment.body}</p>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noCommentsText}>No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentModal;