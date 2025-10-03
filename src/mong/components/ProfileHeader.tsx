import React, { useState, useRef, useEffect } from 'react';
import '../styles/profile.css';
import { ProfileHeaderProps } from '../types';

const ProfileHeader = ({ onBack, onStartSleepRecord, userProfile, onLogout }: ProfileHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    if (action === 'logout' && onLogout) {
      onLogout();
    }
    // 다른 메뉴 액션들은 추후 구현
  };
  
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
          <div className="user-profile-container" ref={dropdownRef}>
            <div className="user-profile" onClick={handleUserProfileClick}>
              <div className="user-avatar">
                <span className="avatar-fallback">{userProfile.avatar}</span>
              </div>
              <span className="user-name">{userProfile.name}</span>
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
                className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </div>
            
            {/* 드롭다운 메뉴 */}
            {isDropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-menu-item" onClick={() => handleMenuClick('profile')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  내 정보 수정
                </div>
                <div className="dropdown-menu-item" onClick={() => handleMenuClick('sleep-goal')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                  </svg>
                  수면 목표 설정
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-menu-item logout" onClick={() => handleMenuClick('logout')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16,17 21,12 16,7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  로그아웃
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
