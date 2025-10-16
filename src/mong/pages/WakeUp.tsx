import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/wakeup.css';

const WakeUp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentTime, setCurrentTime] = useState(new Date()); // 실시간 시각 표시용
    const [isVisible, setIsVisible] = useState(false); // 전체 페이드 인 제어
    const [greetingVisible, setGreetingVisible] = useState(false); // "좋은 아침입니다!" 표시 여부
    const [timeVisible, setTimeVisible] = useState(false); // 시계, 날짜 표시 여부
    const [buttonVisible, setButtonVisible] = useState(false); // 버튼 표시 여부

    // SleepMeasuring에서 전달된 수면 시간 (초 단위)
    const sleepTimeSeconds = location.state?.sleepTime || 0;

    useEffect(() => {
        // 데이터가 없을 경우 대시보드로 리다이렉트 (0초)
        if (!location.state?.sleepTime) {
            alert("잘못된 접근입니다. 메인 페이지로 이동합니다.");
            navigate('/dashboard');
        }

        // 페이지 로드 시 애니메이션 순차적으로 실행
        setIsVisible(true);
        
        setTimeout(() => setGreetingVisible(true), 300);
        setTimeout(() => setTimeVisible(true), 600);
        setTimeout(() => setButtonVisible(true), 900);

        // 현재 시간 매초 갱신
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // 언마운트 시 타이머 정리
        return () => clearInterval(timer);
    }, [location.state, navigate]);

    // 현재 시간을 '오전/오후 시:분' 형태로 표시
    const formatTime = (date: Date): string => {
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? '오후' : '오전';
        const displayHours = hours % 12 || 12;
        return `${ampm} ${displayHours}:${minutes}`;
    };

    // 오늘 날짜를 'YYYY년 M월 D일 요일' 형태로 표시
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const weekday = weekdays[date.getDay()];

        return `${year}년 ${month}월 ${day}일 ${weekday}`;
    };

    // 수면 시간을 '시/분' 단위로 변환
    // ex) 3800초 → "1시간 3분", 90초 → "1분"
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

    return (
        <div 
            className="wakeup-page"
            style={{
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
            }}
        >
            <div 
                className="wakeup-content-frame"
                style={{
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'transform 0.6s ease-out',
                }}
            >
                {/* 인사 문구 */}
                <h1 
                    className="wakeup-greeting"
                    style={{
                        opacity: greetingVisible ? 1 : 0,
                        transform: greetingVisible ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all 0.6s ease-out',
                    }}
                >
                    좋은 아침입니다!
                </h1>
                <p 
                    className="wakeup-subtitle"
                    style={{
                        opacity: greetingVisible ? 1 : 0,
                        transform: greetingVisible ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all 0.6s ease-out 0.1s',
                    }}
                >
                    상쾌한 하루를 시작해보세요
                </p>

                {/* 수면 시간 표시 (SleepMeasuring에서 전달된 값) */}
                {sleepTimeSeconds > 0 && (
                    <div 
                        className="wakeup-sleep-time-display"
                        style={{
                            opacity: greetingVisible ? 1 : 0,
                            transform: greetingVisible ? 'translateY(0)' : 'translateY(10px)',
                            transition: 'all 0.6s ease-out 0.2s',
                        }}
                    >
                        <div className="wakeup-sleep-time-label">수면 시간</div>
                        <div className="wakeup-sleep-time-value">{formatSleepTime(sleepTimeSeconds)}</div>
                    </div>
                )}

                {/* 현재 시각 및 날짜 */}
                <div 
                    className="wakeup-time-display"
                    style={{
                        opacity: timeVisible ? 1 : 0,
                        transform: timeVisible ? 'translateY(0)' : 'translateY(15px)',
                        transition: 'all 0.6s ease-out',
                    }}
                >
                    <div 
                        className="wakeup-current-time"
                        style={{
                            opacity: timeVisible ? 1 : 0,
                            transform: timeVisible ? 'translateY(0)' : 'translateY(15px)',
                            transition: 'all 0.6s ease-out 0.1s',
                        }}
                    >
                        {formatTime(currentTime)}
                    </div>
                    <div 
                        className="wakeup-current-date"
                        style={{
                            opacity: timeVisible ? 1 : 0,
                            transform: timeVisible ? 'translateY(0)' : 'translateY(15px)',
                            transition: 'all 0.6s ease-out 0.2s',
                        }}
                    >
                        {formatDate(currentTime)}
                    </div>
                </div>

                {/* 기상하기 버튼 */}
                <button
                    className="wakeup-button"
                    style={{
                        opacity: buttonVisible ? 1 : 0,
                        transform: buttonVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                        transitionDelay: buttonVisible ? '0s' : '0.3s',
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#00b894';
                        e.currentTarget.style.transform = 'translateY(0) scale(1.02)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#00d4aa';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    }}
                    onClick={handleWakeUp}
                >
                    <span style={{ fontSize: '16px', transition: 'transform 0.2s ease' }}>☀️</span>
                    기상하기
                </button>
            </div>
        </div>
    );
};

export default WakeUp;