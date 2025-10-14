import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/Container'

// --- 아이콘 import ---
import { IoArrowBack, IoStop } from "react-icons/io5";
import { FaSun, FaMoon } from "react-icons/fa";

export default function SleepMeasuring() {
    const navigate = useNavigate()
    const [elapsedTime, setElapsedTime] = useState<number>(0)
    const [brightness, setBrightness] = useState<number>(50)
    const [isMeasuring, setIsMeasuring] = useState<boolean>(true)

    // 실시간 시간 업데이트
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isMeasuring) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isMeasuring])

    // 시간 포맷팅 (시:분:초)
    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // 기상하기 버튼 클릭
    const handleWakeUp = () => {
        setIsMeasuring(false)
        console.log('기상 완료! 총 수면 시간:', formatTime(elapsedTime))
        // WakeUp 페이지로 이동하면서 수면 시간 전달
        navigate('/wakeup', { state: { sleepTime: elapsedTime } })
    }

    // 밝기 조절
    const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBrightness(parseInt(e.target.value))
    }

    // 뒤로가기 버튼 클릭 시 확인 팝업을 띄우는 함수
    const handleGoBack = () => {
        if (window.confirm("지금 뒤로가면 기록이 저장되지 않습니다. 그래도 뒤로 가시겠습니까?")) {
            navigate('/sleep-setup');
        }
    };

    return (
        <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#fff' }}>
            <Container>
                <div style={{ paddingTop: 32, paddingBottom: 32 }}>
                    <div style={{ marginBottom: 32, paddingTop: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                            <button 
                                onClick={handleGoBack}
                                style={{ 
                                    backgroundColor: 'transparent', 
                                    border: 'none', 
                                    color: '#a1a1aa', 
                                    cursor: 'pointer', 
                                    padding: '8px', 
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.color = '#fff';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#a1a1aa';
                                }}
                            >
                                <IoArrowBack size={20} />
                            </button>
                        </div>
                    </div>
                    {/* 실시간 시간 표시 */}
                    <div style={{ textAlign: 'center', marginBottom: 80 }}>
                        <h1 style={{
                            fontSize: 48,
                            fontWeight: 300,
                            color: '#a1a1aa',
                            margin: 0,
                            letterSpacing: '2.4px',
                            fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                            opacity: brightness / 100,
                            transition: 'opacity 0.2s ease'
                        }}>
                            {formatTime(elapsedTime)}
                        </h1>
                    </div>

                    {/* 밝기 조절 섹션 */}
                    <div style={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #2a2a2a',
                        borderRadius: 14,
                        padding: 24,
                        marginBottom: 32
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FaSun color="#a1a1aa" size={16} />
                                <span style={{ fontSize: 12, color: '#a1a1aa', fontWeight: 400 }}>밝기</span>
                            </div>
                            <FaMoon color="#a1a1aa" size={16} />
                        </div>

                        {/* 밝기 슬라이더 */}
                        <div style={{ position: 'relative', marginBottom: 16 }}>
                            <div style={{
                                backgroundColor: '#3d3d3d',
                                height: 16,
                                borderRadius: 8,
                                position: 'relative'
                            }}>
                                <div style={{
                                    backgroundColor: '#2a2a2a',
                                    height: 16,
                                    borderRadius: 8,
                                    width: `${brightness}%`,
                                    transition: 'width 0.2s ease'
                                }} />
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={brightness}
                                    onChange={handleBrightnessChange}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: 16,
                                        background: 'transparent',
                                        outline: 'none',
                                        margin: 0,
                                        WebkitAppearance: 'none',
                                        appearance: 'none',
                                        cursor: 'pointer'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    left: `${brightness}%`,
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 16,
                                    height: 16,
                                    backgroundColor: '#000',
                                    border: '1px solid #3e3e3e',
                                    borderRadius: '50%',
                                    pointerEvents: 'none'
                                }} />
                            </div>
                        </div>

                        {/* 기상하기 버튼 */}
                        <button
                            onClick={handleWakeUp}
                            style={{
                                backgroundColor: 'rgba(220, 38, 38, 0.6)',
                                border: 'none',
                                color: '#a1a1aa',
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: 'pointer',
                                padding: '12px 24px',
                                borderRadius: 8,
                                width: '100%',
                                height: 48,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                transition: 'all 0.2s ease',
                                opacity: brightness / 100,
                            }}
                        >
                            <IoStop size={16} />
                            기상하기
                        </button>
                    </div>

                    <div style={{ height: 48 }}></div>
                </div>
            </Container>
        </div>
    )
}