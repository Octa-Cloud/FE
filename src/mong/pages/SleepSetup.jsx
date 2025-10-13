import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../components/Container.jsx'

// --- 아이콘 import ---
import { IoBedOutline, IoArrowBack, IoTimeOutline, IoWarningOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { FaPlay, FaChevronDown } from "react-icons/fa";

export default function SleepSetup() {
  const [wakeHour, setWakeHour] = useState(6)
  const [wakeMinute, setWakeMinute] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const navigate = useNavigate()

  const handleStartRecording = () => {
    setIsRecording(true)
    const wakeTime = `${wakeHour.toString().padStart(2, '0')}:${wakeMinute.toString().padStart(2, '0')}`
    console.log('수면 측정 시작:', wakeTime)
    // 수면 측정 페이지로 이동
    navigate('/sleep-measuring')
  }

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#fff' }}>
      {/* 헤더 */}
      <div style={{ backgroundColor: '#000000', borderBottom: '1px solid #27272a', padding: '16px 0' }}>
        <Container>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 32 }}>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'rgba(0, 212, 170, 0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IoArrowBack color="#00d4aa" size={20} />
                </div>
                <span style={{ fontFamily: 'Righteous, system-ui', fontSize: 24, color: '#fff' }}>mong</span>
              </div>
            </Link>
          </div>
        </Container>
      </div>

      <Container>
        <div style={{ paddingTop: 32, paddingBottom: 32 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: '#fff', margin: 0 }}>수면 시작</h1>
          </div>

          <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: 24, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <IoTimeOutline color="#a1a1aa" size={20} />
              <span style={{ fontSize: 16, fontWeight: 400, color: '#fff' }}>목표 기상 시간 설정</span>
            </div>
            <p style={{ fontSize: 16, color: '#a1a1aa', marginBottom: 24, margin: 0 }}>목표 기상 시간을 설정하세요</p>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginBottom: 8, display: 'block' }}> </label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, backgroundColor: 'rgba(42, 42, 46, 0.3)', border: '1px solid #2a2a2a', borderRadius: 8, padding: '12px 16px', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="number" min="0" max="23" value={wakeHour} onChange={(e) => { const value = parseInt(e.target.value); if (!isNaN(value) && value >= 0 && value <= 23) { setWakeHour(value) } }} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: 16, fontWeight: 600, width: 40, textAlign: 'center', outline: 'none' }} />
                  <label style={{ fontSize: 16, color: '#a1a1aa', fontWeight: 500 }}>시</label>
                </div>

                <div style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>:</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="number" min="0" max="59" value={wakeMinute} onChange={(e) => { const value = parseInt(e.target.value); if (!isNaN(value) && value >= 0 && value <= 59) { setWakeMinute(value) } }} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: 16, fontWeight: 600, width: 40, textAlign: 'center', outline: 'none' }} />
                  <label style={{ fontSize: 16, color: '#a1a1aa', fontWeight: 500 }}>분</label>
                </div>

                <div style={{ marginLeft: 'auto', fontSize: 16, fontWeight: 600, color: '#00d4aa' }}>
                  {wakeHour.toString().padStart(2, '0')}:{wakeMinute.toString().padStart(2, '0')}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { label: '06:00', hour: 6, minute: 0 },
                  { label: '06:30', hour: 6, minute: 30 },
                  { label: '07:00', hour: 7, minute: 0 },
                  { label: '07:30', hour: 7, minute: 30 },
                  { label: '08:00', hour: 8, minute: 0 },
                  { label: '08:30', hour: 8, minute: 30 },
                  { label: '09:00', hour: 9, minute: 0 }
                ].map((preset) => (
                  <button key={preset.label} onClick={() => { setWakeHour(preset.hour); setWakeMinute(preset.minute); }} style={{ backgroundColor: wakeHour === preset.hour && wakeMinute === preset.minute ? '#00d4aa' : 'rgba(42, 42, 46, 0.3)', border: '1px solid #3f3f46', color: wakeHour === preset.hour && wakeMinute === preset.minute ? '#000' : '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', padding: '6px 12px', borderRadius: 6, transition: 'all 0.2s ease' }}>
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button style={{ backgroundColor: 'rgba(42, 42, 46, 0.3)', border: '1px solid #3f3f46', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '8px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                목표 설정 바로가기
                <FaChevronDown size={16} />
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: 24, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <IoWarningOutline color="#a1a1aa" size={20} />
              <span style={{ fontSize: 16, fontWeight: 400, color: '#fff' }}>수면 측정 주의사항</span>
            </div>
            <div style={{ backgroundColor: '#18181b', border: '1px solid #2a2a2a', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <IoCheckmarkCircleOutline color="#a1a1aa" size={16} style={{ marginTop: 2 }} />
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#a1a1aa', margin: '0 0 8px 0' }}>노트북 설정</h3>
                  <ul style={{ fontSize: 14, color: '#a1a1aa', margin: 0, paddingLeft: 16, lineHeight: '20px' }}>
                    <li>노트북을 침대 근처 안정된 곳에 놓아주세요</li>
                    <li>충전 케이블을 연결하여 배터리 부족을 방지하세요</li>
                    <li>노트북 화면이 잠들 때까지 켜져있도록 설정하세요</li>
                    <li>마이크 권한이 허용되어 있는지 확인하세요</li>
                  </ul>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: '#18181b', border: '1px solid #2a2a2a', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <IoCheckmarkCircleOutline color="#a1a1aa" size={16} style={{ marginTop: 2 }} />
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#a1a1aa', margin: '0 0 8px 0' }}>수면 환경</h3>
                  <ul style={{ fontSize: 14, color: '#a1a1aa', margin: 0, paddingLeft: 16, lineHeight: '20px' }}>
                    <li>조용하고 어두운 환경에서 측정하세요</li>
                    <li>측정 중에는 노트북을 끄거나 덮지 마세요</li>
                    <li>침대에서 너무 많이 움직이지 않도록 주의하세요</li>
                    <li>노트북과 침대 사이의 거리는 1-2미터 정도 유지하세요</li>
                  </ul>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: '#18181b', border: '1px solid #2a2a2a', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <IoCheckmarkCircleOutline color="#a1a1aa" size={16} style={{ marginTop: 2 }} />
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#a1a1aa', margin: '0 0 8px 0' }}>측정 정확도 향상 팁</h3>
                  <ul style={{ fontSize: 14, color: '#a1a1aa', margin: 0, paddingLeft: 16, lineHeight: '20px' }}>
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
            <button onClick={handleStartRecording} disabled={isRecording} style={{ backgroundColor: isRecording ? '#3f3f46' : '#00d4aa', border: 'none', color: isRecording ? '#a1a1aa' : '#000', fontSize: 18, fontWeight: 500, cursor: isRecording ? 'not-allowed' : 'pointer', padding: '12px 24px', borderRadius: 8, width: '100%', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s ease' }}>
              <FaPlay size={16} />
              {isRecording ? '측정 중...' : '수면 측정 시작'}
            </button>
          </div>
          <div style={{ height: 48 }}></div>
        </div>
      </Container>
    </div>
  )
}
