import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const WakeUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // SleepMeasuring에서 전달된 수면 시간 (초 단위)
  const sleepTimeSeconds = location.state?.sleepTime || 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 || 12;
    return `${ampm} ${displayHours}:${minutes}`;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weekday = weekdays[date.getDay()];
    
    return `${year}년 ${month}월 ${day}일 ${weekday}`;
  };

  const formatSleepTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  const handleWakeUp = () => {
    // 기상하기 버튼 클릭 시 수면 기록 페이지로 이동하면서 수면 시간 전달
    navigate('/wake-up-summary', { state: { sleepTime: sleepTimeSeconds } });
  };

  return (
    <div className="wakeup-page">
      <div className="main-container">
        <div className="content-frame">
          {/* 인사말 */}
          <h1 className="greeting">좋은 아침입니다!</h1>
          <p className="subtitle">상쾌한 하루를 시작해보세요</p>
          
          {/* 수면 시간 표시 */}
          {sleepTimeSeconds > 0 && (
            <div className="sleep-time-display">
              <div className="sleep-time-label">수면 시간</div>
              <div className="sleep-time-value">{formatSleepTime(sleepTimeSeconds)}</div>
            </div>
          )}
          
          {/* 현재 시간 */}
          <div className="time-display">
            <div className="current-time">{formatTime(currentTime)}</div>
            <div className="current-date">{formatDate(currentTime)}</div>
          </div>
          
          {/* 기상하기 버튼 */}
          <button className="wakeup-button" onClick={handleWakeUp}>
            <span className="button-icon">☀️</span>
            기상하기
          </button>
        </div>
      </div>

      <style jsx>{`
        .wakeup-page {
          width: 100vw;
          height: 100vh;
          background-color: #000000;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .main-container {
          width: 100%;
          height: 100%;
          background-color: transparent;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .content-frame {
          width: 448px;
          height: 436px;
          background-color: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          box-sizing: border-box;
        }

        .greeting {
          color: #00d4aa;
          font-size: 30px;
          font-weight: 500;
          margin: 0 0 16px 0;
          text-align: center;
        }

        .subtitle {
          color: #a1a1aa;
          font-size: 18px;
          font-weight: 400;
          margin: 0 0 24px 0;
          text-align: center;
        }

        .sleep-time-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
          padding: 16px 24px;
          background-color: rgba(0, 212, 170, 0.1);
          border: 1px solid rgba(0, 212, 170, 0.3);
          border-radius: 8px;
        }

        .sleep-time-label {
          color: #00d4aa;
          font-size: 14px;
          font-weight: 400;
          margin-bottom: 4px;
        }

        .sleep-time-value {
          color: #ffffff;
          font-size: 20px;
          font-weight: 500;
        }

        .time-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 40px;
        }

        .current-time {
          color: #ffffff;
          font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 36px;
          font-weight: 300;
          margin-bottom: 8px;
        }

        .current-date {
          color: #a1a1aa;
          font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          font-weight: 400;
        }

        .wakeup-button {
          width: 320px;
          height: 64px;
          background-color: #00d4aa;
          border: none;
          border-radius: 8px;
          color: #000000;
          font-size: 18px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.2s ease;
        }

        .wakeup-button:hover {
          background-color: #00b894;
        }

        .button-icon {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default WakeUp;
