import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const WakeUp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentTime, setCurrentTime] = useState(new Date());

    // SleepMeasuring에서 전달된 수면 시간 (초 단위)
    const sleepTimeSeconds = location.state?.sleepTime || 0;

    useEffect(() => {
        // 데이터가 없을 경우 대시보드로 리다이렉트
        if (!location.state?.sleepTime) {
            alert("잘못된 접근입니다. 메인 페이지로 이동합니다.");
            navigate('/dashboard');
        }

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, [location.state, navigate]);

    const formatTime = (date: Date): string => {
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? '오후' : '오전';
        const displayHours = hours % 12 || 12;
        return `${ampm} ${displayHours}:${minutes}`;
    };

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const weekday = weekdays[date.getDay()];

        return `${year}년 ${month}월 ${day}일 ${weekday}`;
    };

    const formatSleepTime = (seconds: number): string => {
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

    // 스타일 객체
    const styles: { [key: string]: React.CSSProperties } = {
        wakeupPage: {
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, sans-serif",
        },
        contentFrame: {
            width: '448px',
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            boxSizing: 'border-box',
        },
        greeting: {
            color: '#00d4aa',
            fontSize: '30px',
            fontWeight: 500,
            margin: '0 0 16px 0',
            textAlign: 'center',
        },
        subtitle: {
            color: '#a1a1aa',
            fontSize: '18px',
            fontWeight: 400,
            margin: '0 0 24px 0',
            textAlign: 'center',
        },
        sleepTimeDisplay: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '24px',
            padding: '16px 24px',
            backgroundColor: 'rgba(0, 212, 170, 0.1)',
            border: '1px solid rgba(0, 212, 170, 0.3)',
            borderRadius: '8px',
        },
        sleepTimeLabel: {
            color: '#00d4aa',
            fontSize: '14px',
            fontWeight: 400,
            marginBottom: '4px',
        },
        sleepTimeValue: {
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: 500,
        },
        timeDisplay: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '40px',
        },
        currentTime: {
            color: '#ffffff',
            fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: '36px',
            fontWeight: 300,
            marginBottom: '8px',
        },
        currentDate: {
            color: '#a1a1aa',
            fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: '16px',
            fontWeight: 400,
        },
        wakeupButton: {
            width: '320px',
            height: '64px',
            backgroundColor: '#00d4aa',
            border: 'none',
            borderRadius: '8px',
            color: '#000000',
            fontSize: '18px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background-color 0.2s ease',
        },
    };

    return (
        <div style={styles.wakeupPage}>
            <div style={styles.contentFrame}>
                <h1 style={styles.greeting}>좋은 아침입니다!</h1>
                <p style={styles.subtitle}>상쾌한 하루를 시작해보세요</p>

                {sleepTimeSeconds > 0 && (
                    <div style={styles.sleepTimeDisplay}>
                        <div style={styles.sleepTimeLabel}>수면 시간</div>
                        <div style={styles.sleepTimeValue}>{formatSleepTime(sleepTimeSeconds)}</div>
                    </div>
                )}

                <div style={styles.timeDisplay}>
                    <div style={styles.currentTime}>{formatTime(currentTime)}</div>
                    <div style={styles.currentDate}>{formatDate(currentTime)}</div>
                </div>

                <button
                    style={styles.wakeupButton}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#00b894'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00d4aa'}
                    onClick={handleWakeUp}
                >
                    <span style={{ fontSize: '16px' }}>☀️</span>
                    기상하기
                </button>
            </div>
        </div>
    );
};

export default WakeUp;