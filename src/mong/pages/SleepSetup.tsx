import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/Container'

// --- 아이콘 import ---
import { IoTimeOutline, IoWarningOutline, IoCheckmarkCircleOutline, IoArrowBack } from "react-icons/io5";
import { FaPlay, FaChevronDown } from "react-icons/fa";

export default function SleepSetup() {
    const [wakeHour, setWakeHour] = useState<number>(6)
    const [wakeMinute, setWakeMinute] = useState<number>(0)
    const navigate = useNavigate()

    const handleStartRecording = () => {
        // 확인 팝업 표시
        if (window.confirm("수면 측정은 하루에 한 번만 가능합니다. 측정을 시작하시겠습니까?")) {
            // 수면 측정 페이지로 이동
            navigate('/sleep-measuring')
        }
    }

    const handleGoBack = () => {
        // 대시보드로 돌아가기
        navigate('/dashboard')
    }

    const handleGoToGoalSetting = () => {
        // 수면 목표 설정 페이지로 이동
        navigate('/sleep-goal')
    }

    return (
        <div className="page-container">
            <Container>
                <div className="page-content">
                    <div className="page-header">
                        <div className="page-title-section">
                            <button 
                                onClick={handleGoBack}
                                className="basic-back-button"
                                style={{ transition: 'all 0.2s ease' }}
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
                            <h1 className="page-title">수면 기록 측정하기</h1>
                        </div>
                    </div>

                    <div className="basic-card">
                        <div className="basic-card-header">
                            <IoTimeOutline color="#a1a1aa" size={20} />
                            <span className="basic-card-title">목표 기상 시간 설정</span>
                        </div>
                        <p className="basic-card-description">목표 기상 시간을 설정하세요</p>

                        <div style={{ marginBottom: 16 }}>
                            <div className="basic-input-group">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <input 
                                        type="number" 
                                        min="0" 
                                        max="23" 
                                        value={wakeHour} 
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { 
                                            const value = parseInt(e.target.value); 
                                            if (!isNaN(value) && value >= 0 && value <= 23) { 
                                                setWakeHour(value) 
                                            } 
                                        }} 
                                        className="basic-input-time"
                                    />
                                    <label className="basic-input-label">시</label>
                                </div>

                                <div className="basic-input-separator">:</div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <input 
                                        type="number" 
                                        min="0" 
                                        max="59" 
                                        value={wakeMinute} 
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { 
                                            const value = parseInt(e.target.value); 
                                            if (!isNaN(value) && value >= 0 && value <= 59) { 
                                                setWakeMinute(value) 
                                            } 
                                        }} 
                                        className="basic-input-time"
                                    />
                                    <label className="basic-input-label">분</label>
                                </div>

                                <div className="basic-input-display">
                                    {wakeHour.toString().padStart(2, '0')}:{wakeMinute.toString().padStart(2, '0')}
                                </div>
                            </div>

                            <div className="basic-preset-buttons">
                                {[
                                    { label: '06:00', hour: 6, minute: 0 },
                                    { label: '06:30', hour: 6, minute: 30 },
                                    { label: '07:00', hour: 7, minute: 0 },
                                    { label: '07:30', hour: 7, minute: 30 },
                                    { label: '08:00', hour: 8, minute: 0 },
                                    { label: '08:30', hour: 8, minute: 30 },
                                    { label: '09:00', hour: 9, minute: 0 }
                                ].map((preset) => (
                                    <button 
                                        key={preset.label} 
                                        onClick={() => { setWakeHour(preset.hour); setWakeMinute(preset.minute); }} 
                                        className={`basic-preset-button ${wakeHour === preset.hour && wakeMinute === preset.minute ? 'active' : ''}`}
                                        style={{ transition: 'all 0.2s ease' }}
                                        onMouseOver={(e) => {
                                            if (wakeHour === preset.hour && wakeMinute === preset.minute) {
                                                // 선택된 버튼: 어두운 청록색으로 호버
                                                e.currentTarget.style.setProperty('background-color', '#00b894', 'important');
                                                e.currentTarget.style.setProperty('border-color', '#00b894', 'important');
                                            } else {
                                                // 선택되지 않은 버튼: 밝은 회색으로 호버
                                                e.currentTarget.style.setProperty('background-color', 'rgba(42, 42, 46, 0.5)', 'important');
                                                e.currentTarget.style.setProperty('border-color', '#52525b', 'important');
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (wakeHour === preset.hour && wakeMinute === preset.minute) {
                                                // 선택된 버튼: CSS 클래스로 복원 (인라인 스타일 제거)
                                                e.currentTarget.style.removeProperty('background-color');
                                                e.currentTarget.style.removeProperty('border-color');
                                            } else {
                                                // 선택되지 않은 버튼: CSS 클래스로 복원 (인라인 스타일 제거)
                                                e.currentTarget.style.removeProperty('background-color');
                                                e.currentTarget.style.removeProperty('border-color');
                                            }
                                        }}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={handleGoToGoalSetting}
                                className="basic-secondary-button"
                                style={{ transition: 'all 0.2s ease' }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(42, 42, 46, 0.5)';
                                    e.currentTarget.style.borderColor = '#52525b';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(42, 42, 46, 0.3)';
                                    e.currentTarget.style.borderColor = '#3f3f46';
                                }}
                            >
                                목표 설정 바로가기
                                <FaChevronDown size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="basic-card">
                        <div className="basic-card-header">
                            <IoWarningOutline color="#a1a1aa" size={20} />
                            <span className="basic-card-title">수면 측정 주의사항</span>
                        </div>
                        <div className="basic-card-section">
                            <div className="basic-card-section-header">
                                <IoCheckmarkCircleOutline color="#a1a1aa" size={16} style={{ marginTop: 2 }} />
                                <div>
                                    <h3 className="basic-card-section-title">노트북 설정</h3>
                                    <ul className="basic-card-section-list">
                                        <li>노트북을 침대 근처 안정된 곳에 놓아주세요</li>
                                        <li>충전 케이블을 연결하여 배터리 부족을 방지하세요</li>
                                        <li>노트북 화면이 잠들 때까지 켜져있도록 설정하세요</li>
                                        <li>마이크 권한이 허용되어 있는지 확인하세요</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="basic-card-section">
                            <div className="basic-card-section-header">
                                <IoCheckmarkCircleOutline color="#a1a1aa" size={16} style={{ marginTop: 2 }} />
                                <div>
                                    <h3 className="basic-card-section-title">수면 환경</h3>
                                    <ul className="basic-card-section-list">
                                        <li>조용하고 어두운 환경에서 측정하세요</li>
                                        <li>측정 중에는 노트북을 끄거나 덮지 마세요</li>
                                        <li>침대에서 너무 많이 움직이지 않도록 주의하세요</li>
                                        <li>노트북과 침대 사이의 거리는 1-2미터 정도 유지하세요</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="basic-card-section">
                            <div className="basic-card-section-header">
                                <IoCheckmarkCircleOutline color="#a1a1aa" size={16} style={{ marginTop: 2 }} />
                                <div>
                                    <h3 className="basic-card-section-title">측정 정확도 향상 팁</h3>
                                    <ul className="basic-card-section-list">
                                        <li>매일 같은 시간에 잠자리에 드세요</li>
                                        <li>측정 전 2시간 동안은 카페인을 피하세요</li>
                                        <li>주변 소음을 최소화하여 마이크가 수면음을 정확히 감지할 수 있도록 하세요</li>
                                        <li>노트북 화면 밝기를 최소로 설정하세요</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: 32 }}>
                        <button 
                            onClick={handleStartRecording} 
                            className="basic-primary-button"
                            style={{ transition: 'all 0.2s ease' }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#00b894';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#00d4aa';
                            }}
                        >
                            <FaPlay size={16} />
                            수면 측정 시작
                        </button>
                    </div>
                    <div style={{ height: 48 }}></div>
                </div>
            </Container>
        </div>
    )
}