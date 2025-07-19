import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import clientServer from '@config/index';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // This would typically fetch from an API
    const fetchActivities = async () => {
      try {
        // Simulate API call - replace with actual endpoint when available
        // const response = await clientServer.get('/user_activities');
        // setActivities(response.data.activities || []);
        
        // Placeholder data
        setActivities([
          { id: 1, text: 'You have a new connection request from John Doe' },
          { id: 2, text: 'Your post received 5 new likes' },
          { id: 3, text: 'New job recommendations based on your profile' },
          { id: 4, text: 'Your connection Sarah shared a new post' }
        ]);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, []);
  
  return (
    <div className={styles.activityCard}>
      <h2 className={styles.activityTitle}>Recent Activity</h2>
      {loading ? (
        <div className={styles.loadingContainer}>
          {[1, 2, 3].map(i => (
            <div key={i} className={styles.loadingItem}></div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className={styles.activityList}>
          {activities.map(activity => (
            <div key={activity.id} className={styles.activityItem}>
              <p className={styles.activityText}>{activity.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyActivity}>No recent activity</p>
      )}
    </div>
  );
};

export default RecentActivity;