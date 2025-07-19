import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import { useDispatch } from 'react-redux';
import clientServer from '@config/index';
import { createPost } from '@config/redux/action/postAction';
import { io } from 'socket.io-client';

const CreatePost = ({ user }) => {
  const [postText, setPostText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const dispatch = useDispatch();
  const socket = useRef();
  
  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
    
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postText.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Create post data
      const postData = {
        token: localStorage.getItem('token'),
        body: postText,
        media: mediaFile
      };
      
      // Dispatch the createPost action
      const result = await dispatch(createPost(postData)).unwrap();
      
      // Emit socket event for real-time updates
      socket.current.emit('new_post', { userId: user?._id || (user?.userId?._id) });
      
      // Reset form
      setPostText('');
      setMediaFile(null);
      setMediaPreview(null);
      
      // Show success message
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={styles.createPostContainer}>
      <form onSubmit={handleSubmit} className={styles.createPostForm}>
        <div className={styles.userInfo}>
          <img 
            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${user?.ProfilePicture || 'default.jpg'}`} 
            alt={user?.name} 
            className={styles.userImage}
          />
          <span className={styles.userName}>{user?.name}</span>
        </div>
        
        <textarea
          className={styles.postInput}
          placeholder="What's on your mind?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          required
        />
        
        {mediaPreview && (
          <div className={styles.mediaPreviewContainer}>
            <img src={mediaPreview} alt="Preview" className={styles.mediaPreview} />
            <button 
              type="button" 
              className={styles.removeMediaButton}
              onClick={() => {
                setMediaFile(null);
                setMediaPreview(null);
              }}
            >
              ×
            </button>
          </div>
        )}
        
        <div className={styles.postActions}>
          <div className={styles.mediaButton}>
            <label htmlFor="media-upload" className={styles.mediaLabel}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Photo/Video
            </label>
            <input 
              id="media-upload"
              type="file" 
              accept="image/*,video/*" 
              onChange={handleFileChange} 
              style={{ display: 'none' }}
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.postButton}
            disabled={isSubmitting || !postText.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;