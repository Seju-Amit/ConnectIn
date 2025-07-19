import React, { useEffect, useState } from 'react'
import UserLayout from '@layout/UserLayout'
import DashboardLayout from '@layout/DashboardLayout'
import clientServer from '@config/index'
import styles from './styles.module.css'
import { useRouter } from 'next/router'  // Add this import

export default function MyConnectionsPage() {
  const [connections, setConnections] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();  // Add this line

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchConnections();
    fetchConnectionRequests();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await clientServer.get('/user/get_my_connection_request', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setConnections(response.data.connections || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConnectionRequests = async () => {
    try {
      const response = await clientServer.get('/user/user_connection_request', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setConnectionRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching connection requests:', error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await clientServer.post('/user/accept_connection_request', {
        token: localStorage.getItem('token'),
        requestId,
        action_Type: 'accept'
      });
      alert(response.data.message);
      fetchConnectionRequests();
      fetchConnections();
    } catch (error) {
      console.error('Error accepting connection request:', error);
      alert('Failed to accept connection request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await clientServer.post('/user/accept_connection_request', {
        token: localStorage.getItem('token'),
        requestId,
        action_Type: 'reject'
      });
      alert(response.data.message);
      fetchConnectionRequests();
    } catch (error) {
      console.error('Error rejecting connection request:', error);
      alert('Failed to reject connection request');
    }
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.connectionsContainer}>
          <h1 className={styles.pageTitle}>My Network</h1>
          
          {/* Connection Requests Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Connection Requests</h2>
            {connectionRequests.length > 0 ? (
              <div className={styles.requestsGrid}>
                {connectionRequests.map((request) => (
                  <div key={request._id} className={styles.requestCard}>
                    <div className={styles.userInfo}>
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${request.userId?.ProfilePicture || 'default.jpg'}`} 
                        alt={request.userId?.name} 
                        className={styles.userImage}
                      />
                      <div>
                        <h3 className={styles.userName}>{request.userId?.name}</h3>
                        <p className={styles.userUsername}>@{request.userId?.username}</p>
                      </div>
                    </div>
                    <div className={styles.actionButtons}>
                      <button 
                        className={styles.acceptButton}
                        onClick={() => handleAcceptRequest(request._id)}
                      >
                        Accept
                      </button>
                      <button 
                        className={styles.rejectButton}
                        onClick={() => handleRejectRequest(request._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyMessage}>No pending connection requests</p>
            )}
          </div>
          
          {/* Connections Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>My Connections</h2>
            {connections.length > 0 ? (
              <div className={styles.connectionsGrid}>
                {connections.map((connection) => (
                  <div key={connection._id} className={styles.connectionCard}>
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${connection.connectionId?.ProfilePicture || 'default.jpg'}`} 
                      alt={connection.connectionId?.name} 
                      className={styles.connectionImage}
                    />
                    <div className={styles.connectionInfo}>
                      <h3 className={styles.connectionName}>{connection.connectionId?.name}</h3>
                      <p className={styles.connectionUsername}>@{connection.connectionId?.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyMessage}>No connections yet</p>
            )}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}
