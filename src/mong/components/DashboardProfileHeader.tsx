import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moonIcon from '../assets/moonIcon.svg';
import '../styles/profile.css';
import { ProfileHeaderProps } from '../types';

const DashboardProfileHeader = ({ onBack, onStartSleepRecord, userProfile, onLogout }: ProfileHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUserProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuClick = (action: string) => {
    setIsDropdownOpen(false);
    if (action === 'profile') {
      navigate('/profile');
    } else if (action === 'sleep-goal') {
      navigate('/sleep-goal');
    } else if (action === 'logout' && onLogout) {
      onLogout();
    }
  };
  
  return (
    <header className="profile-header">
      <div className="dashboard-profile-header-content">
        {/* 로고 */}
        <button 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <div className="profile-header-logo">
            <img src={moonIcon} alt="moon icon" className="profile-header-logo-icon" />
          </div>
          <span className="profile-header-brand">mong</span>
        </button>
        
        {/* 중앙 메뉴 버튼들 */}
        <div className="flex items-center gap-2">
          <button 
            className="px-4 py-2 bg-transparent text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => console.log('상세기록 클릭')}
          >
            상세기록
          </button>
          <button 
            className="px-4 py-2 bg-transparent text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => console.log('통계 클릭')}
          >
            통계
          </button>
          <button 
            className="px-4 py-2 bg-transparent text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => console.log('AI 인사이트 클릭')}
          >
            AI 인사이트
          </button>
        </div>
        
        {/* 수면 기록 시작 버튼 */}
        <div className="flex items-center">
          <button className="start-sleep-button" onClick={onStartSleepRecord}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path>
            </svg>
            수면 기록 시작
          </button>
        </div>
        
        {/* 사용자 드롭다운 */}
        <div className="flex items-center">
          <div className="relative" ref={dropdownRef}>
            <button className="user-dropdown-trigger" onClick={handleUserProfileClick}>
              <div className="profile-header-avatar">
                <span>{userProfile.name.charAt(0)}</span>
              </div>
              <span className="profile-header-username">{userProfile.name}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`profile-header-arrow ${isDropdownOpen ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
            
            {/* 드롭다운 메뉴 */}
            {isDropdownOpen && (
              <div className="user-dropdown-menu">
                <button className="user-dropdown-item" onClick={() => handleMenuClick('profile')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  내 정보 수정
                </button>
                <button className="user-dropdown-item" onClick={() => handleMenuClick('sleep-goal')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                  </svg>
                  수면 목표 설정
                </button>
                <div className="user-dropdown-divider"></div>
                <button className="user-dropdown-item text-red-400" onClick={() => handleMenuClick('logout')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16,17 21,12 16,7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardProfileHeader;
