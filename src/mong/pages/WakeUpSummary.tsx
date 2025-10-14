import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const WakeUpSummary = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // SleepMeasuring에서 전달된 수면 시간 (초 단위)
    const sleepTimeSeconds = location.state?.sleepTime || 0;
    const [sleepMemo, setSleepMemo] = useState('');

    useEffect(() => {
        // 데이터가 없을 경우 대시보드로 리다이렉트
        if (!location.state?.sleepTime) {
            alert("잘못된 접근입니다. 메인 페이지로 이동합니다.");
            navigate('/dashboard');
        }
    }, [location.state, navigate]);

    const formatSleepTime = (seconds: number): string => {
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

    const styles: { [key: string]: React.CSSProperties } = {
        page: {
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, sans-serif",
        },
        container: {
            width: '800px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px',
            boxSizing: 'border-box',
        },
        pageTitle: {
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: 600,
            margin: '0 0 40px 0',
            textAlign: 'center',
        },
        sleepTimeCard: {
            width: '752px',
            height: '252px',
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(0, 212, 170, 0.2)',
            borderRadius: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
        },
        sleepIcon: {
            fontSize: '64px',
            marginBottom: '16px',
        },
        sleepTimeValue: {
            color: '#00d4aa',
            fontSize: '30px',
            fontWeight: 700,
            marginBottom: '8px',
        },
        sleepTimeLabel: {
            color: '#a1a1aa',
            fontSize: '16px',
            fontWeight: 400,
        },
        memoCard: {
            width: '752px',
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '24px',
            boxSizing: 'border-box',
        },
        memoHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
        },
        memoIcon: {
            fontSize: '20px',
        },
        memoTitle: {
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: 400,
            margin: 0,
        },
        memoDescription: {
            color: '#a1a1aa',
            fontSize: '16px',
            margin: '0 0 16px 0',
        },
        memoTextarea: {
            width: '100%',
            height: '100px',
            backgroundColor: 'rgba(42, 42, 42, 0.3)',
            border: '1px solid #2a2a2a',
            borderRadius: '8px',
            color: '#a1a1aa',
            fontSize: '14px',
            fontFamily: 'inherit',
            padding: '12px',
            marginBottom: '12px',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
        },
        memoNote: {
            color: '#a1a1aa',
            fontSize: '12px',
            margin: 0,
        },
        saveButton: {
            width: '752px',
            height: '40px',
            backgroundColor: '#00d4aa',
            border: 'none',
            borderRadius: '8px',
            color: '#000000',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background-color 0.2s ease',
        },
        buttonIcon: {
            fontSize: '16px',
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.pageTitle}>수면 측정 완료</h1>

                <div style={styles.sleepTimeCard}>
                    <div style={styles.sleepIcon}>💤</div>
                    <div style={styles.sleepTimeValue}>{formatSleepTime(sleepTimeSeconds)}</div>
                    <div style={styles.sleepTimeLabel}>총 수면 시간</div>
                </div>

                <div style={styles.memoCard}>
                    <div style={styles.memoHeader}>
                        <span style={styles.memoIcon}>📝</span>
                        <h3 style={styles.memoTitle}>수면은 어떠셨나요?</h3>
                    </div>
                    <p style={styles.memoDescription}>어젯밤 수면에 대한 간단한 기록을 남겨보세요</p>

                    <textarea
                        style={styles.memoTextarea}
                        placeholder="평소보다 일찍 잠들었어요, 스트레스 때문에 잠을 잘 못 잤어요, 꿈을 많이 꿨어요..."
                        value={sleepMemo}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSleepMemo(e.target.value)}
                        rows={4}
                    />

                    <p style={styles.memoNote}>* 이 기록은 향후 수면 분석에 참고자료로 활용됩니다</p>
                </div>

                <button
                    style={styles.saveButton}
                    onClick={handleSaveAndGoMain}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#00b894'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00d4aa'}
                >
                    <span style={styles.buttonIcon}>💾</span>
                    기록 저장하고 메인으로
                </button>
            </div>
        </div>
    );
};

export default WakeUpSummary;