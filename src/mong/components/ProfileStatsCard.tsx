import React from 'react';
import '../styles/profile.css';
import { ProfileStatsCardProps } from '../types';

const ProfileStatsCard = ({ userData }: ProfileStatsCardProps) => {
  const { name, email, avatar, averageScore, averageSleepTime, totalDays } = userData;

  return (
    <div className="stats-card">
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold">
          <span>{name.charAt(0)}</span>
        </div>
        <h4 className="text-xl font-semibold text-white m-0">{name}</h4>
        <p className="text-gray-400 text-sm m-0">{email}</p>
      </div>
      <div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl font-bold text-primary-400 m-0">{averageScore}점</p>
            <p className="text-xs text-gray-400 m-0">평균 점수</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl font-bold text-primary-400 m-0">{averageSleepTime}h</p>
            <p className="text-xs text-gray-400 m-0">평균 수면시간</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl font-bold text-primary-400 m-0">{totalDays}일</p>
            <p className="text-xs text-gray-400 m-0">총 측정일수</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStatsCard;
