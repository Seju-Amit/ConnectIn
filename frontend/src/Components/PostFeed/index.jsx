import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clientServer from '@config/index';
import { getAllPosts } from '@config/redux/action/postAction';
import styles from './styles.module.css';
import { io } from 'socket.io-client';

const PostFeed = ({ onCommentClick }) => {
  const { posts, loading } = useSelector(state => state.post);
  const authState = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const socket = useRef();
  
  useEffect(() => {
    // Initialize socket connection
    socket.current = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
    
    // Listen for new posts
    socket.current.on('post_added', () => {
      dispatch(getAllPosts());
    });
    
    // Listen for like updates
    socket.current.on('like_updated', (data) => {
      dispatch(getAllPosts());
    });
    
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [dispatch]);
  
  const handleLikePost = async (postId) => {
    try {
      await clientServer.post('/like_post', {
        token: localStorage.getItem('token'),
        post_Id: postId
      });
      
      // Emit like event
      socket.current.emit('post_liked', { postId });
      
      // Refresh posts after liking
      dispatch(getAllPosts());
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  
  const handleSharePost = (post) => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.userId?.name}`,
        text: post.body,
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${post.body} - ${window.location.href}`);
      alert('Post link copied to clipboard!');
    }
  };
  
  if (loading) {
    return (
      <div className={styles.postFeedContainer}>
        {[1, 2, 3].map(i => (
          <div key={i} className={styles.loadingPost}>
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!posts || posts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <svg className={styles.emptyStateIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <p className="text-gray-500">No posts available. Be the first to post!</p>
      </div>
    );
  }
  
  return (
    <div className={styles.postFeedContainer}>
      {posts.map(post => {
        const isLiked = post.likes?.includes(authState.user?.userId?._id || authState.user?._id);
        
        return (
          <div key={post._id} className={styles.postCard}>
            {/* Post Header */}
            <div className={styles.postHeader}>
              <img 
                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${post.userId?.ProfilePicture || 'default.jpg'}`} 
                alt={post.userId?.name} 
                className={styles.postAuthorImage}
              />
              <div className={styles.postAuthorInfo}>
                <h3 className={styles.postAuthorName}>{post.userId?.name || 'User'}</h3>
                <p className={styles.postAuthorUsername}>@{post.userId?.username || 'username'}</p>
                <p className={styles.postDate}>{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            {/* Post Content */}
            <div className={styles.postContent}>
              <p className={styles.postText}>{post.body}</p>
              {post.media && (
                <img 
                  src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${post.media}`} 
                  alt="Post media" 
                  className={styles.postMedia}
                />
              )}
            </div>
            
            {/* Post Actions */}
            <div className={styles.postActions}>
              <button 
                className={`${styles.actionButton} ${isLiked ? styles.likedButton : ''}`}
                onClick={() => handleLikePost(post._id)}
              >
                <svg fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span className={styles.actionButtonText}>{post.likes?.length || 0}</span>
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => onCommentClick(post)}
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className={styles.actionButtonText}>Comment</span>
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => handleSharePost(post)}
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className={styles.actionButtonText}>Share</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostFeed;