import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/wakeup-summary.css';

const WakeUpSummary = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // SleepMeasuring에서 전달된 수면 시간 (초 단위)
    const sleepTimeSeconds = location.state?.sleepTime || 0;
    const [sleepMemo, setSleepMemo] = useState('');

    // 컴포넌트 표시 순서를 제어하는 애니메이션 상태들
    const [isVisible, setIsVisible] = useState(false);
    const [titleVisible, setTitleVisible] = useState(false);
    const [sleepCardVisible, setSleepCardVisible] = useState(false);
    const [memoCardVisible, setMemoCardVisible] = useState(false);
    const [buttonVisible, setButtonVisible] = useState(false);

    useEffect(() => {
        // 데이터가 없을 경우 대시보드로 리다이렉트
        if (!location.state?.sleepTime) {
            alert("잘못된 접근입니다. 메인 페이지로 이동합니다.");
            navigate('/dashboard');
        }

        // 페이지 로드 시 순차적 애니메이션 시작
        setIsVisible(true);
        setTimeout(() => setTitleVisible(true), 300);
        setTimeout(() => setSleepCardVisible(true), 600);
        setTimeout(() => setMemoCardVisible(true), 900);
        setTimeout(() => setButtonVisible(true), 1200);
    }, [location.state, navigate]);

    // 초 단위를 '시간/분' 포맷으로 변환
    const formatSleepTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}시간 ${minutes}분`;
        }
        return `${minutes}분`;
    };

    // 수면 기록 저장 및 메인 대시보드 페이지 이동
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

        // 저장 완료 알림 
        alert('수면 기록이 저장되었습니다!');
        console.log('수면 기록 저장 완료:', sleepRecord);

        // 메인 대시보드로 이동
        navigate('/dashboard');
    };

    return (
        <div 
            className="wakeup-summary-page"
            style={{
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
            }}
        >
            <div 
                className="wakeup-summary-container"
                style={{
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'transform 0.6s ease-out',
                }}
            >
                <h1 
                    className="wakeup-summary-page-title"
                    style={{
                        opacity: titleVisible ? 1 : 0,
                        transform: titleVisible ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all 0.6s ease-out',
                    }}
                >
                    수면 측정 완료
                </h1>

                {/* 총 수면 시간 카드 */}
                <div 
                    className="wakeup-summary-sleep-time-card"
                    style={{
                        opacity: sleepCardVisible ? 1 : 0,
                        transform: sleepCardVisible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.6s ease-out',
                    }}
                >
                    <div className="wakeup-summary-sleep-icon">💤</div>
                    <div className="wakeup-summary-sleep-time-value">{formatSleepTime(sleepTimeSeconds)}</div>
                    <div className="wakeup-summary-sleep-time-label">총 수면 시간</div>
                </div>

                 {/* 수면 메모 입력 카드 */}
                <div 
                    className="wakeup-summary-memo-card"
                    style={{
                        opacity: memoCardVisible ? 1 : 0,
                        transform: memoCardVisible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.6s ease-out',
                    }}
                >
                    <div className="wakeup-summary-memo-header">
                        <span className="wakeup-summary-memo-icon">📝</span>
                        <h3 className="wakeup-summary-memo-title">수면은 어떠셨나요?</h3>
                    </div>
                    <p className="wakeup-summary-memo-description">어젯밤 수면에 대한 간단한 기록을 남겨보세요</p>

                    <textarea
                        className="wakeup-summary-memo-textarea"
                        placeholder="평소보다 일찍 잠들었어요, 스트레스 때문에 잠을 잘 못 잤어요, 꿈을 많이 꿨어요..."
                        value={sleepMemo}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSleepMemo(e.target.value)}
                        rows={4}
                    />

                    <p className="wakeup-summary-memo-note">* 이 기록은 향후 수면 분석에 참고자료로 활용됩니다</p>
                </div>

                {/* 기록 저장 및 메인 대시보드 페이지 이동 버튼 */}
                <button
                    className="wakeup-summary-save-button"
                    style={{
                        opacity: buttonVisible ? 1 : 0,
                        transform: buttonVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                        transitionDelay: buttonVisible ? '0s' : '0.3s',
                    }}
                    onClick={handleSaveAndGoMain}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#00b894';
                        e.currentTarget.style.transform = 'translateY(0) scale(1.02)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#00d4aa';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    }}
                >
                    <span className="wakeup-summary-button-icon">💾</span>
                    기록 저장하고 메인으로
                </button>
            </div>
        </div>
    );
};

export default WakeUpSummary;