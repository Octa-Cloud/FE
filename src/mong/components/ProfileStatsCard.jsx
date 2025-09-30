import React from 'react';
import '../styles/profile.css';

const ProfileStatsCard = ({ userData }) => {
  const { name, email, avatar, averageScore, averageSleepTime, totalDays } = userData;

  return (
    <div className="profile-stats-card">
      <div className="profile-stats-header">
        <div className="profile-avatar">
          <span className="avatar-fallback">{avatar}</span>
        </div>
        <h4 className="profile-name">{name}</h4>
        <p className="profile-email">{email}</p>
      </div>
      <div className="profile-stats-content">
        <div className="stats-grid">
          <div className="stat-item">
            <p className="stat-value">{averageScore}점</p>
            <p className="stat-label">평균 점수</p>
          </div>
          <div className="stat-item">
            <p className="stat-value">{averageSleepTime}h</p>
            <p className="stat-label">평균 수면시간</p>
          </div>
          <div className="stat-item">
            <p className="stat-value">{totalDays}일</p>
            <p className="stat-label">총 측정일수</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStatsCard;
