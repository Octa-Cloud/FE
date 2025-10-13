import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const WakeUpSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // SleepMeasuring에서 전달된 수면 시간 (초 단위)
  const sleepTimeSeconds = location.state?.sleepTime || 0;
  const [sleepMemo, setSleepMemo] = useState('');

  const formatSleepTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  const handleSaveAndGoMain = () => {
    // 수면 기록 저장 (로컬 스토리지 또는 서버로 전송)
    const sleepRecord = {
      date: new Date().toISOString().split('T')[0],
      sleepTime: sleepTimeSeconds,
      memo: sleepMemo,
      timestamp: new Date().toISOString()
    };
    
    // 로컬 스토리지에 저장
    const existingRecords = JSON.parse(localStorage.getItem('sleepRecords') || '[]');
    existingRecords.push(sleepRecord);
    localStorage.setItem('sleepRecords', JSON.stringify(existingRecords));
    
    console.log('수면 기록 저장 완료:', sleepRecord);
    
    // 메인 대시보드로 이동
    navigate('/dashboard');
  };

  return (
    <div className="sleep-record-page">
      <div className="main-container">
        <div className="content-container">
          {/* 헤더 */}
          <h1 className="page-title">수면 측정 완료</h1>
          
          {/* 수면 시간 표시 */}
          <div className="sleep-time-card">
            <div className="sleep-icon">💤</div>
            <div className="sleep-time-value">{formatSleepTime(sleepTimeSeconds)}</div>
            <div className="sleep-time-label">총 수면 시간</div>
          </div>
          
          {/* 수면 메모 입력 */}
          <div className="memo-card">
            <div className="memo-header">
              <span className="memo-icon">📝</span>
              <h3 className="memo-title">수면은 어떠셨나요?</h3>
            </div>
            <p className="memo-description">어젯밤 수면에 대한 간단한 기록을 남겨보세요</p>
            
            <textarea
              className="memo-textarea"
              placeholder="평소보다 일찍 잠들었어요, 스트레스 때문에 잠을 잘 못 잤어요, 꿈을 많이 꿨어요..."
              value={sleepMemo}
              onChange={(e) => setSleepMemo(e.target.value)}
              rows={4}
            />
            
            <p className="memo-note">* 이 기록은 향후 수면 분석에 참고자료로 활용됩니다</p>
          </div>
          
          {/* 저장 버튼 */}
          <button className="save-button" onClick={handleSaveAndGoMain}>
            <span className="button-icon">💾</span>
            기록 저장하고 메인으로
          </button>
        </div>
      </div>

      <style jsx>{`
        .sleep-record-page {
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

        .content-container {
          width: 800px;
          height: 708px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
          box-sizing: border-box;
        }

        .page-title {
          color: #ffffff;
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 40px 0;
          text-align: center;
        }

        .sleep-time-card {
          width: 752px;
          height: 252px;
          background-color: #1a1a1a;
          border: 1px solid rgba(0, 212, 170, 0.2);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .sleep-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .sleep-time-value {
          color: #00d4aa;
          font-size: 30px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .sleep-time-label {
          color: #a1a1aa;
          font-size: 16px;
          font-weight: 400;
        }

        .memo-card {
          width: 752px;
          height: 264px;
          background-color: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 14px;
          padding: 24px;
          margin-bottom: 24px;
          box-sizing: border-box;
        }

        .memo-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .memo-icon {
          font-size: 20px;
        }

        .memo-title {
          color: #ffffff;
          font-size: 20px;
          font-weight: 400;
          margin: 0;
        }

        .memo-description {
          color: #a1a1aa;
          font-size: 16px;
          margin: 0 0 16px 0;
        }

        .memo-textarea {
          width: 100%;
          height: 100px;
          background-color: rgba(42, 42, 42, 0.3);
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          color: #a1a1aa;
          font-size: 14px;
          font-family: inherit;
          padding: 12px;
          margin-bottom: 12px;
          resize: none;
          outline: none;
          box-sizing: border-box;
        }

        .memo-textarea::placeholder {
          color: #a1a1aa;
        }

        .memo-textarea:focus {
          border-color: #00d4aa;
        }

        .memo-note {
          color: #a1a1aa;
          font-size: 12px;
          margin: 0;
        }

        .save-button {
          width: 752px;
          height: 40px;
          background-color: #00d4aa;
          border: none;
          border-radius: 8px;
          color: #000000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.2s ease;
        }

        .save-button:hover {
          background-color: #00b894;
        }

        .button-icon {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default WakeUpSummary;
