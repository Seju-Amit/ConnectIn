import { getAboutUser } from "@config/redux/action/authAction";
import { getAllPosts } from "@config/redux/action/postAction";
import { getAllUsers } from "@config/redux/action/authAction";
import UserLayout from "@layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "@layout/DashboardLayout";
import ProfileHeader from "@components/ProfileHeader";
import WorkHistory from "@components/WorkHistory";
// import RecentActivity from "@components/RecentActivity";
import CreatePost from "@components/CreatePost";
import PostFeed from "@components/PostFeed";
import CommentModal from "@components/CommentModal";
import styles from "./styles.module.css";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);
  const postState = useSelector(state => state.post);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    // Set token presence and fetch data
    dispatch({ type: 'auth/setIsTokenThere' });
    dispatch(getAboutUser({ token }));
    dispatch(getAllPosts());
    
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
    
    setIsInitialized(true);
  }, []);

  const handleCommentClick = (post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
    setSelectedPost(null);
  };

  if (!isInitialized || !authState.profileFetched) {
    return (
      <UserLayout>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <h2 className={styles.loadingText}>Loading your dashboard</h2>
          <p className={styles.loadingSubtext}>Please wait while we prepare your personalized experience</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DashboardLayout>
        {/* Left Column - Navigation is already in DashboardLayout */}
        
        {/* Main Content Area */}
        <div className={styles.dashboardContainer}>
          {/* Center Column - Profile and Content */}
          <div className={styles.centerColumn}>
            {/* Profile Header */}
            {authState.user && (
              <ProfileHeader 
                user={authState.user} 
                profile={authState.user} 
                isOwnProfile={true}
              />
            )}
            
            {/* Profile Data */}
            <div className={styles.profileData}>
              <WorkHistory profile={authState.user} />
              
              {/* Stats Section */}
              <div className={styles.statsSection}>
                <div className={styles.statCard}>
                  <h3 className={styles.statTitle}>Connections</h3>
                  <p className={styles.statValue}>{authState.user?.connections?.length || 0}</p>
                </div>
                
                <div className={styles.statCard}>
                  <h3 className={styles.statTitle}>Posts</h3>
                  <p className={styles.statValue}>{authState.user?.posts?.length || 0}</p>
                </div>
              </div>
            </div>
            
            {/* Create Post */}
            <CreatePost user={authState.user.userId} />
            
            {/* Post Feed */}
            <PostFeed onCommentClick={handleCommentClick} />
          </div>
          
          {/* Right Column - Welcome Banner and Recent Activity */}
          {/* <div className={styles.rightColumn}>
            <div className={styles.welcomeBanner}>
              <h2 className={styles.welcomeTitle}>Welcome back, {authState.user?.userId?.name || 'Professional'}!</h2>
              <p className={styles.welcomeText}>Stay updated with your network and discover new opportunities.</p>
            </div>
            
            <RecentActivity />
          </div> */}
        </div>
        
        {/* Comment Modal */}
        {showCommentModal && selectedPost && (
          <CommentModal 
            post={selectedPost} 
            onClose={closeCommentModal} 
          />
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
