import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import moonIcon from '../assets/moonIcon.svg';
import '../styles/profile.css';

interface UserProfile {
  name: string;
  avatar?: string;
  email?: string;
}

interface NavBarProps {
  onStartSleepRecord?: () => void;
  userProfile: UserProfile;
  onLogout?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onStartSleepRecord, userProfile, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleBackClick = () => {
    if (isDailyReportPage) {
      navigate('/profile');
    } else {
      navigate(-1);
    }
  };

  const handleStatisticsClick = () => {
    navigate('/statistics');
  };

  const handleDailyReportClick = () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
    navigate(`/daily-report/${today}`);
  };

  // 통계나 일별 보고서 페이지인지 확인
  const isStatisticsPage = location.pathname.includes('/statistics');
  const isDailyReportPage = location.pathname.includes('/daily-report');

  return (
    <header className="profile-header">
      <div className="profile-header-content">
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <div className="profile-header-logo">
              <img src={moonIcon} alt="moon icon" className="profile-header-logo-icon" />
            </div>
            <span className="profile-header-brand">mong</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* 뒤로가기 버튼 (통계/일별보고서 페이지에서만 표시) */}
          {(isStatisticsPage || isDailyReportPage) && (
            <button 
              className="nav-back-button" 
              onClick={handleBackClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
              뒤로가기
            </button>
          )}
          
          {/* 구분선 (뒤로가기 버튼이 있을 때만 표시) */}
          {(isStatisticsPage || isDailyReportPage) && (
            <div className="nav-divider"></div>
          )}
          
          {/* 일별 보고서 버튼 (홈 페이지에서만 표시) */}
          {!isStatisticsPage && !isDailyReportPage && (
            <button 
              className="nav-stats-button" 
              onClick={handleDailyReportClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              일별 보고서
            </button>
          )}
          
          {/* 통계 버튼 (홈 페이지에서만 표시) */}
          {!isStatisticsPage && !isDailyReportPage && (
            <button 
              className="nav-stats-button" 
              onClick={handleStatisticsClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg>
              통계
            </button>
          )}
          
          {/* 수면 기록 시작 버튼 */}
          <button className="start-sleep-button" onClick={onStartSleepRecord}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path>
            </svg>
            수면 기록 시작
          </button>
        </div>
        
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

export default NavBar;
