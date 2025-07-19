import React, { useState } from 'react';
import styles from './styles.module.css';
import clientServer from '@config/index';
import { useDispatch } from 'react-redux';
import { getAboutUser } from '@config/redux/action/authAction';

const ProfileHeader = ({ user, profile, isOwnProfile = false }) => {
  const [isEditingPicture, setIsEditingPicture] = useState(false);
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [bannerPicture, setBannerPicture] = useState(null);
  const dispatch = useDispatch();
  
  if (!user) return null;
  
  const userData = user.userId || user;
  
  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };
  
  const handleBannerPictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBannerPicture(e.target.files[0]);
    }
  };
  
  const uploadProfilePicture = async () => {
    if (!profilePicture) return;
    
    const formData = new FormData();
    formData.append('token', localStorage.getItem('token'));
    formData.append('ProfilePicture', profilePicture);
    
    try {
      const response = await clientServer.post('/update_Profile_Picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.message) {
        alert(response.data.message);
        dispatch(getAboutUser({ token: localStorage.getItem('token') }));
        setIsEditingPicture(false);
        setProfilePicture(null);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture');
    }
  };
  
  const uploadBannerPicture = async () => {
    if (!bannerPicture) return;
    
    const formData = new FormData();
    formData.append('token', localStorage.getItem('token'));
    formData.append('bannerPicture', bannerPicture);
    
    try {
      const response = await clientServer.post('/update_Profile_Banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.message) {
        alert(response.data.message);
        dispatch(getAboutUser({ token: localStorage.getItem('token') }));
        setIsEditingBanner(false);
        setBannerPicture(null);
      }
    } catch (error) {
      console.error('Error uploading banner picture:', error);
      alert('Failed to upload banner picture');
    }
  };
  
  return (
    <div className={styles.profileHeader}>
      {/* LinkedIn-style Banner */}
      <div className={styles.banner} style={{
        backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${userData?.bannerPicture || 'default_banner.jpg'})`
      }}>
        <div className={styles.bannerOverlay}></div>
        {isOwnProfile && (
          <button 
            className={styles.editBannerButton}
            onClick={() => setIsEditingBanner(!isEditingBanner)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Banner
          </button>
        )}
        
        {isEditingBanner && (
          <div className={styles.editBannerForm}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleBannerPictureChange} 
              className={styles.fileInput}
            />
            <div className={styles.editButtons}>
              <button 
                className={styles.saveButton}
                onClick={uploadBannerPicture}
                disabled={!bannerPicture}
              >
                Save
              </button>
              <button 
                className={styles.cancelButton}
                onClick={() => {
                  setIsEditingBanner(false);
                  setBannerPicture(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Profile Section */}
      <div className="relative">
        {/* Profile Picture */}
        <div className={styles.profileImageContainer}>
          <img 
            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${userData?.ProfilePicture || 'default.jpg'}`} 
            alt={userData?.name} 
            className={styles.profileImage}
          />
          {isOwnProfile && (
            <button 
              className={styles.editPictureButton}
              onClick={() => setIsEditingPicture(!isEditingPicture)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
        </div>
        
        {isEditingPicture && (
          <div className={styles.editPictureForm}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleProfilePictureChange} 
              className={styles.fileInput}
            />
            <div className={styles.editButtons}>
              <button 
                className={styles.saveButton}
                onClick={uploadProfilePicture}
                disabled={!profilePicture}
              >
                Save
              </button>
              <button 
                className={styles.cancelButton}
                onClick={() => {
                  setIsEditingPicture(false);
                  setProfilePicture(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {/* User Info */}
        <div className={styles.profileInfo}>
          <h1 className={styles.profileName}>{userData?.name || 'User'}</h1>
          <p className={styles.profileUsername}>@{userData?.username ? userData.username.toLowerCase() : 'username'}</p>
          <p className={styles.profileBio}>{profile?.bio || userData?.bio || 'Professional at connecting people'}</p>
          <p className={styles.profilePosition}>{profile?.currentPost || userData?.currentPost || 'Open to opportunities'}</p>
          
          {/* Stats */}
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <p className={styles.statValue}>{profile?.connections?.length || 0}</p>
              <p className={styles.statLabel}>Connections</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.statValue}>{profile?.posts?.length || 0}</p>
              <p className={styles.statLabel}>Posts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;