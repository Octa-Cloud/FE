import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import { SleepAPI, SleepGoalResponse } from '../api/sleep'

// --- 아이콘 import ---
import { IoTimeOutline, IoWarningOutline, IoCheckmarkCircleOutline, IoArrowBack } from "react-icons/io5";
import { FaPlay, FaChevronDown } from "react-icons/fa";

export default function SleepSetup() {
    // 사용자가 입력하는 목표 기상 시간 (시, 분)
    const [wakeHour, setWakeHour] = useState<number>(6)
    const [wakeMinute, setWakeMinute] = useState<number>(0)

    // API 상태 관리
    const [apiSleepGoal, setApiSleepGoal] = useState<SleepGoalResponse | null>(null);
    const [apiLoading, setApiLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const navigate = useNavigate()

    // API에서 수면 목표 정보 가져오기
    const fetchSleepGoal = useCallback(async () => {
        try {
            setApiLoading(true);
            setApiError(null);
            
            // 토큰 확인
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.warn('⚠️ 액세스 토큰이 없습니다. 로그인이 필요합니다.');
                setApiError('로그인이 필요합니다. 로그인 페이지로 이동하세요.');
                return;
            }
            
            console.log('🔍 API 호출: 수면 목표 조회 (SleepSetup)');
            
            const response = await SleepAPI.getSleepGoal();
            console.log('✅ API 응답: 수면 목표 조회 성공 (SleepSetup)', response);
            
            if (response.result) {
                setApiSleepGoal(response.result);
                console.log('😴 수면 목표 설정 (SleepSetup):', response.result);
                
                // API에서 가져온 기상 시간으로 폼 데이터 업데이트
                const wakeTime = response.result.goalWakeTime.split(':');
                setWakeHour(parseInt(wakeTime[0]));
                setWakeMinute(parseInt(wakeTime[1]));
            }
        } catch (error: any) {
            console.error('❌ API 호출 실패: 수면 목표 조회 (SleepSetup)', error);
            
            // 404 에러일 때는 기본 데이터 설정하고 에러 메시지 표시하지 않음
            if (error.response?.status === 404) {
                console.log('📝 404 에러: 기본 기상 시간 설정');
                setWakeHour(6);  // 기본 06:00
                setWakeMinute(0);
                setApiSleepGoal(null);
                setApiLoading(false);
                return;
            }
            
            // 에러 타입별 처리 - 모든 에러를 콘솔에만 로그하고 UI에는 표시하지 않음
            if (error.response?.status === 401) {
                console.log('🔑 401 에러: 토큰 재발급 시도 중...');
            } else if (error.response?.status === 403) {
                console.log('🚫 403 에러: 접근 권한이 없습니다.');
            } else if (error.code === 'NETWORK_ERROR' || !error.response) {
                console.log('🌐 네트워크 에러: 연결을 확인해주세요.');
            } else {
                console.log('❌ 수면 목표 조회 실패:', error.message || '알 수 없는 오류');
            }
        } finally {
            setApiLoading(false);
        }
    }, []);

    // 컴포넌트 마운트 시 API에서 수면 목표 데이터 로드
    useEffect(() => {
        fetchSleepGoal();
    }, [fetchSleepGoal]);

    const handleStartRecording = () => {
        // 하루 한 번 측정 확인 팝업 -> "예" 버튼 클릭 시 수면 측정 페이지로 이동
        if (window.confirm("수면 측정은 하루에 한 번만 가능합니다. 측정을 시작하시겠습니까?")) {
            navigate('/sleep-measuring')
        }
    }

    // '뒤로가기' 버튼 -> 대시보드로 돌아가기
    const handleGoBack = () => {
        navigate('/dashboard')
    }

    // '목표 설정 바로가기' 버튼 -> 수면 목표 설정 페이지로 이동
  const handleGoToGoalSetting = () => {
      navigate('/sleep-goal', { state: { from: 'sleep-setup' } })
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

                    {/* 목표 기상 시간 설정 */} 
                    <div className="basic-card">
                        <div className="basic-card-header">
                            <IoTimeOutline color="#a1a1aa" size={20} />
                            <span className="basic-card-title">목표 기상 시간 설정</span>
                        </div>
                        <p className="basic-card-description">
                            {apiLoading ? '목표 기상 시간을 불러오는 중...' : '목표 기상 시간을 설정하세요'}
                        </p>

                        {/* API 에러 메시지 */}
                        {apiError && (
                            <div style={{ 
                                color: '#ef4444', 
                                fontSize: '14px', 
                                marginBottom: '16px',
                                padding: '8px 12px',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: '6px'
                            }}>
                                {apiError}
                                {apiError.includes('로그인이 필요합니다') && (
                                    <div style={{ marginTop: '8px' }}>
                                        <button 
                                            onClick={() => navigate('/login')}
                                            style={{
                                                padding: '6px 12px',
                                                fontSize: '12px',
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            로그인하러 가기
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 시/분 입력 필드 */}
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
                                        disabled={apiLoading}
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
                                        disabled={apiLoading}
                                        className="basic-input-time"
                                    />
                                    <label className="basic-input-label">분</label>
                                </div>

                                <div className="basic-input-display">
                                    {wakeHour.toString().padStart(2, '0')}:{wakeMinute.toString().padStart(2, '0')}
                                </div>
                            </div>

                            {/* 미리 선택 가능한 시간 프리셋 버튼 */}
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
                                        disabled={apiLoading}
                                        className={`basic-preset-button ${wakeHour === preset.hour && wakeMinute === preset.minute ? 'active' : ''}`}
                                        style={{ transition: 'all 0.2s ease' }}
                                        onMouseOver={(e) => {
                                            if (wakeHour === preset.hour && wakeMinute === preset.minute) {
                                                e.currentTarget.style.setProperty('background-color', '#00b894', 'important');
                                                e.currentTarget.style.setProperty('border-color', '#00b894', 'important');
                                            } else {
                                                e.currentTarget.style.setProperty('background-color', 'rgba(42, 42, 46, 0.5)', 'important');
                                                e.currentTarget.style.setProperty('border-color', '#52525b', 'important');
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (wakeHour === preset.hour && wakeMinute === preset.minute) {
                                                e.currentTarget.style.removeProperty('background-color');
                                                e.currentTarget.style.removeProperty('border-color');
                                            } else {
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

                         {/* 목표 설정 페이지로 이동 버튼 */}
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

                    {/* 수면 측정 전 유의사항 카드 */}
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

                    {/* 수면 측정 시작 버튼 */}
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