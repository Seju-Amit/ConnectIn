import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import UserLayout from '@layout/UserLayout';
import { getAboutUser } from '@config/redux/action/authAction';
import clientServer from '@config/index';
import styles from './styles.module.css';

const ProfilePage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        bio: '',
        currentPost: ''
    });
    const [workData, setWorkData] = useState([{ company: '', position: '', years: '' }]);
    const [educationData, setEducationData] = useState([{ school: '', degree: '', fieldOfStudy: '' }]);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        dispatch({ type: 'auth/setIsTokenThere' });
        dispatch(getAboutUser({ token }));
    }, []);

    useEffect(() => {
        if (authState.profileFetched && authState.user) {
            const userData = authState.user.userId || authState.user;
            const profileData = authState.user;

            setFormData({
                name: userData?.name || '',
                username: userData?.username || '',
                email: userData?.email || '',
                password: '',
                bio: profileData?.bio || '',
                currentPost: profileData?.currentPost || ''
            });

            if (profileData?.work && profileData.work.length > 0) {
                setWorkData(profileData.work);
            }

            if (profileData?.education && profileData.education.length > 0) {
                setEducationData(profileData.education);
            }

            setIsLoading(false);
        }
    }, [authState.profileFetched, authState.user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleWorkChange = (index, e) => {
        const { name, value } = e.target;
        const updatedWork = [...workData];
        updatedWork[index] = { ...updatedWork[index], [name]: value };
        setWorkData(updatedWork);
    };

    const handleEducationChange = (index, e) => {
        const { name, value } = e.target;
        const updatedEducation = [...educationData];
        updatedEducation[index] = { ...updatedEducation[index], [name]: value };
        setEducationData(updatedEducation);
    };

    const addWorkField = () => {
        setWorkData([...workData, { company: '', position: '', years: '' }]);
    };

    const removeWorkField = (index) => {
        const updatedWork = [...workData];
        updatedWork.splice(index, 1);
        setWorkData(updatedWork);
    };

    const addEducationField = () => {
        setEducationData([...educationData, { school: '', degree: '', fieldOfStudy: '' }]);
    };

    const removeEducationField = (index) => {
        const updatedEducation = [...educationData];
        updatedEducation.splice(index, 1);
        setEducationData(updatedEducation);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        try {
            // Update user data
            const userUpdateData = {
                token: localStorage.getItem('token'),
                name: formData.name,
                username: formData.username,
                email: formData.email
            };

            // Only include password if it's provided
            if (formData.password) {
                userUpdateData.password = formData.password;
            }

            // Update user basic info
            const userResponse = await clientServer.post('/update_user', userUpdateData);

            // Update profile data
            const profileUpdateData = {
                token: localStorage.getItem('token'),
                bio: formData.bio,
                currentPost: formData.currentPost,
                work: workData,
                education: educationData
            };

            // Update profile info
            const profileResponse = await clientServer.post('/update_Profile_Data', profileUpdateData);

            // Refresh user data
            dispatch(getAboutUser({ token: localStorage.getItem('token') }));
            
            // After successful profile update
            setMessage({ 
                text: 'Profile updated successfully!', 
                type: 'success' 
            });
            
            // Add a short delay before redirecting to ensure Redux state is updated
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ 
                text: error.response?.data?.message || 'Failed to update profile', 
                type: 'error' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <UserLayout>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <h2 className={styles.loadingText}>Loading your profile</h2>
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <div className={styles.profileFormContainer}>
                <h1 className={styles.formTitle}>Update Your Profile</h1>
                
                {message.text && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className={styles.profileForm}>
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Basic Information</h2>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password (leave blank to keep current)</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Profile Information</h2>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="bio">Bio</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows="3"
                            ></textarea>
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="currentPost">Current Position</label>
                            <input
                                type="text"
                                id="currentPost"
                                name="currentPost"
                                value={formData.currentPost}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Work Experience</h2>
                        
                        {workData.map((work, index) => (
                            <div key={index} className={styles.repeatingGroup}>
                                <div className={styles.formGroup}>
                                    <label htmlFor={`company-${index}`}>Company</label>
                                    <input
                                        type="text"
                                        id={`company-${index}`}
                                        name="company"
                                        value={work.company}
                                        onChange={(e) => handleWorkChange(index, e)}
                                    />
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <label htmlFor={`position-${index}`}>Position</label>
                                    <input
                                        type="text"
                                        id={`position-${index}`}
                                        name="position"
                                        value={work.position}
                                        onChange={(e) => handleWorkChange(index, e)}
                                    />
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <label htmlFor={`years-${index}`}>Years</label>
                                    <input
                                        type="text"
                                        id={`years-${index}`}
                                        name="years"
                                        value={work.years}
                                        onChange={(e) => handleWorkChange(index, e)}
                                    />
                                </div>
                                
                                {workData.length > 1 && (
                                    <button 
                                        type="button" 
                                        className={styles.removeButton}
                                        onClick={() => removeWorkField(index)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        
                        <button 
                            type="button" 
                            className={styles.addButton}
                            onClick={addWorkField}
                        >
                            Add Work Experience
                        </button>
                    </div>
                    
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Education</h2>
                        
                        {educationData.map((edu, index) => (
                            <div key={index} className={styles.repeatingGroup}>
                                <div className={styles.formGroup}>
                                    <label htmlFor={`school-${index}`}>School</label>
                                    <input
                                        type="text"
                                        id={`school-${index}`}
                                        name="school"
                                        value={edu.school}
                                        onChange={(e) => handleEducationChange(index, e)}
                                    />
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <label htmlFor={`degree-${index}`}>Degree</label>
                                    <input
                                        type="text"
                                        id={`degree-${index}`}
                                        name="degree"
                                        value={edu.degree}
                                        onChange={(e) => handleEducationChange(index, e)}
                                    />
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <label htmlFor={`fieldOfStudy-${index}`}>Field of Study</label>
                                    <input
                                        type="text"
                                        id={`fieldOfStudy-${index}`}
                                        name="fieldOfStudy"
                                        value={edu.fieldOfStudy}
                                        onChange={(e) => handleEducationChange(index, e)}
                                    />
                                </div>
                                
                                {educationData.length > 1 && (
                                    <button 
                                        type="button" 
                                        className={styles.removeButton}
                                        onClick={() => removeEducationField(index)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        
                        <button 
                            type="button" 
                            className={styles.addButton}
                            onClick={addEducationField}
                        >
                            Add Education
                        </button>
                    </div>
                    
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.submitButton} disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </UserLayout>
    );
};

export default ProfilePage;