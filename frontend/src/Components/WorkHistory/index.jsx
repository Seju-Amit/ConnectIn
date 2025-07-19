import React from 'react';
import styles from './styles.module.css';

const WorkHistory = ({ profile }) => {
  const workExperience = profile?.workExperience || [
    { company: 'Google', position: 'CTO', duration: '2+ years' },
    { company: 'Google', position: 'ASDE', duration: '2+ years' },
    { company: 'ASDF', position: 'ASDF', duration: '2+ years' }
  ];
  
  return (
    <div className={styles.workHistoryCard}>
      <h3 className={styles.workHistoryTitle}>Work History</h3>
      <div className={styles.workList}>
        {workExperience.map((work, index) => (
          <div key={index} className={styles.workItem}>
            <div className={styles.companyLogo}>
              <span>{work.company.charAt(0)}</span>
            </div>
            <div className={styles.workInfo}>
              <p className={styles.workTitle}>{work.company} - {work.position}</p>
              <p className={styles.workDuration}>{work.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkHistory;