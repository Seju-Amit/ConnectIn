import React, { useEffect, useState } from 'react'
import UserLayout from '@layout/UserLayout'
import DashboardLayout from '@layout/DashboardLayout'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { getAllUsers } from '@config/redux/action/authAction'
import styles from './styles.module.css'
import clientServer from '@config/index'

export default function DiscoverPage() {
  const authState = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    if(!authState.all_profiles_fetched){
      dispatch(getAllUsers());
    }
  }, []);

  const handleSendRequest = async (connectionId) => {
    setIsLoading(true);
    try {
      const response = await clientServer.post("/user/send_connection_request", {
        token: localStorage.getItem("token"),
        connectionId
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error sending connection request:", error);
      alert("Failed to send connection request");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter profiles based on search term and filter option
  const filteredProfiles = authState.all_users ? authState.all_users.filter(profile => {
    const nameMatch = profile.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const usernameMatch = profile.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const positionMatch = profile.currentPost?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSearch = nameMatch || usernameMatch || positionMatch;
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'tech' && profile.industry === 'Technology') return matchesSearch;
    if (filter === 'business' && profile.industry === 'Business') return matchesSearch;
    if (filter === 'creative' && profile.industry === 'Creative') return matchesSearch;
    
    return false;
  }) : [];

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.discoverContainer}>
          <h1 className={styles.pageTitle}>Discover People</h1>
          
          {/* Search and Filter Section */}
          <div className={styles.searchFilterContainer}>
            <div className={styles.searchContainer}>
              <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Search by name, username, or position..." 
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className={styles.filterContainer}>
              <button 
                className={`${styles.filterButton} ${filter === 'all' ? styles.activeFilter : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`${styles.filterButton} ${filter === 'tech' ? styles.activeFilter : ''}`}
                onClick={() => setFilter('tech')}
              >
                Technology
              </button>
              <button 
                className={`${styles.filterButton} ${filter === 'business' ? styles.activeFilter : ''}`}
                onClick={() => setFilter('business')}
              >
                Business
              </button>
              <button 
                className={`${styles.filterButton} ${filter === 'creative' ? styles.activeFilter : ''}`}
                onClick={() => setFilter('creative')}
              >
                Creative
              </button>
            </div>
          </div>
          
          {/* Results Count */}
          <p className={styles.resultsCount}>
            Showing {filteredProfiles.length} {filteredProfiles.length === 1 ? 'person' : 'people'}
          </p>
          
          {/* User Grid */}
          <div className={styles.userGrid}>
            {filteredProfiles.map((profile) => (
              <div key={profile._id} className={styles.userCard}>
                <div className={styles.userCardHeader}>
                  <div className={styles.userImageContainer}>
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${profile.userId?.ProfilePicture || 'default.jpg'}`} 
                      alt={profile.userId?.name} 
                      className={styles.userImage}
                    />
                  </div>
                </div>
                <div className={styles.userInfo}>
                  <h3 className={styles.userName}>{profile.userId?.name}</h3>
                  <p className={styles.userUsername}>@{profile.userId?.username}</p>
                  
                  <div className={styles.userDetails}>
                    <div className={styles.detailItem}>
                      <svg className={styles.detailIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                      <span>{profile.currentPost || "Open to opportunities"}</span>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <svg className={styles.detailIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{profile.location || "Location not specified"}</span>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <svg className={styles.detailIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span>{profile.industry || "Industry not specified"}</span>
                    </div>
                  </div>
                  
                  <p className={styles.userBio}>{profile.bio || "No bio available"}</p>
                </div>
                
                <div className={styles.cardFooter}>
                  <button 
                    className={styles.viewProfileButton}
                    onClick={() => router.push(`/profile/${profile.userId?._id}`)}
                  >
                    View Profile
                  </button>
                  
                  <button 
                    className={styles.connectButton}
                    onClick={() => handleSendRequest(profile.userId?._id)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Connect"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {filteredProfiles.length === 0 && (
            <div className={styles.emptyState}>
              <svg className={styles.emptyStateIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 15s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
              <h3>No people found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}
