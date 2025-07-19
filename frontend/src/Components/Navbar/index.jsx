import React from "react";
import styles from "./styles.module.css"
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export const navBar = () => {
    const router = useRouter();
    const authState = useSelector(state => state.auth);

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem('token');
        // Redirect to login page
        router.push('/');
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navBar}>
                <div className={styles.navLogo}>
                    <img src="/icon.ico" alt="ConnectIn logo" onClick={() => router.push("/")} />
                    <h1 className={styles.connectIn} onClick={() => router.push("/")}>ConnectIn</h1>
                </div>

                <div className={styles.navLinks}>
                    {!authState.profileFetched ? (
                        <div className={styles.authButtons}>
                            <button 
                                className={styles.buttonOutline} 
                                onClick={() => router.push("/login")}
                            >
                                Login
                            </button>
                            <button 
                                className={styles.buttonJoin} 
                                onClick={() => router.push("/login")}
                            >
                                Register
                            </button>
                        </div>
                    ) : (
                        <div className={styles.authButtons}>
                            <div className={styles.userInfo}>
                                <span className={styles.userGreeting}>Hey,</span>
                                <span 
                                    className={`${styles.userName} ${styles.clickable}`}
                                    onClick={() => router.push("/dashboard")}
                                >
                                    {authState.user?.userId?.name || 'User'}
                                </span>
                            </div>
                            <button 
                                className={styles.profileButton}
                                onClick={() => router.push("/profile")}
                            >
                                Profile
                            </button>
                            <button 
                                className={styles.buttonLogout} 
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    )
}

