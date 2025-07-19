import React from 'react';
import styles from "./index.module.css";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import RecentActivity from "@components/RecentActivity";

const DashboardLayout = ({ children }) => {
    const router = useRouter();
    const authState = useSelector(state => state.auth);
    
    // Check if current route is active
    const isActive = (path) => router.pathname === path;

    // Add this function to handle navigation
    const handleNavigation = (path) => {
        console.log("Navigating to:", path);
        router.push(path);
    };

    return (
        <div className={styles.homeContainer}>
            {/* Desktop Sidebar */}
            <div className={styles.homeContainer_left}>
                <div 
                    onClick={() => handleNavigation("/dashboard")}
                    className={`${styles.sidebar} ${isActive('/dashboard') ? styles.sidebarActive : ''}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <p>Home</p>
                </div>
                
                <div
                    onClick={() => handleNavigation("/discover")} 
                    className={`${styles.sidebar} ${isActive('/discover') ? styles.sidebarActive : ''}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <p>Discover</p>
                </div>
                
                <div
                    onClick={() => handleNavigation("/my_connections")} 
                    className={`${styles.sidebar} ${isActive('/my_connections') ? styles.sidebarActive : ''}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <p>My Connection</p>
                </div>
            </div>
            <div className={styles.feedContainer}>
                {children}
            </div>
            <div className={styles.extraContainer}>
                {/* Right Column - Welcome Banner and Recent Activity */}
                <div className={styles.welcomeBanner}>
                    <h2 className={styles.welcomeTitle}>Welcome back, {authState.user?.userId?.name || 'Professional'}!</h2>
                    <p className={styles.welcomeText}>Stay updated with your network and discover new opportunities.</p>
                </div>
                
                <RecentActivity />
            </div>
        </div>
    )
}

export default DashboardLayout;