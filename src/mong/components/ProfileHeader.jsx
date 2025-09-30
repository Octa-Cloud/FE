import React from 'react';
import '../styles/profile.css';

const ProfileHeader = ({ onBack, onStartSleepRecord, userProfile }) => {
  return (
    <header className="profile-header">
      <div className="profile-header-content">
        <div className="header-left">
          <div className="logo-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="moon-icon">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
            <span className="app-name">mong</span>
          </div>
        </div>
        
        <div className="header-center">
          <button className="start-sleep-button" onClick={onStartSleepRecord}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path>
            </svg>
            수면 기록 시작
          </button>
        </div>
        
        <div className="header-right">
          <div className="user-profile">
            <div className="user-avatar">
              <span className="avatar-fallback">{userProfile.avatar}</span>
            </div>
            <span className="user-name">{userProfile.name}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
