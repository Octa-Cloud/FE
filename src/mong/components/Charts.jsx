import React, { useState } from 'react'

// BarChart 컴포넌트는 수정할 필요 없이 그대로 사용합니다.
export const BarChart = ({ data, maxValue, color = '#00d4aa', height = 120, showTooltip = false }) => {
  const maxBarHeight = height - 20
  const [hoveredIndex, setHoveredIndex] = useState(null)
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'end', 
      justifyContent: 'space-between',
      height: height,
      padding: '10px 0',
      gap: 4,
      position: 'relative'
    }}>
      {data.map((item, index) => {
        const barHeight = maxValue > 0 ? (item.value / maxValue) * maxBarHeight : 0
        return (
          <div key={index} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            flex: 1,
            position: 'relative'
          }}>
            <div 
              style={{
                width: '100%',
                height: barHeight,
                backgroundColor: color,
                borderRadius: '2px 2px 0 0',
                minHeight: barHeight > 0 ? 2 : 0,
                transition: 'height 0.3s ease',
                cursor: showTooltip ? 'pointer' : 'default'
              }}
              onMouseEnter={() => showTooltip && setHoveredIndex(index)}
              onMouseLeave={() => showTooltip && setHoveredIndex(null)}
            />
            {showTooltip && hoveredIndex === index && item.value > 0 && (
              <div style={{
                position: 'absolute',
                bottom: barHeight + 10,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                color: '#fff',
                whiteSpace: 'nowrap',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}>
                <div style={{ fontWeight: 500, marginBottom: 2 }}>{item.day}</div>
                <div style={{ color: '#a1a1aa' }}>
                  {item.label}: {item.displayValue || (typeof item.value === 'number' && item.value % 1 !== 0 ? item.value.toFixed(2) : item.value)}{item.unit || ''}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// 수면 시간 차트 컴포넌트
export const SleepHoursChart = ({ data }) => {
  const maxHours = Math.max(...data.map(item => item.hours), 1)
  
  return (
    <div style={{ 
      backgroundColor: '#2a2a2a', 
      borderRadius: 8, 
      padding: 16, 
      height: 180,
      display: 'flex'
    }}>
      {/* 👇 Y축 라벨 정렬을 위해 position: absolute로 수정 */}
      <div style={{ 
        position: 'relative',
        height: 120,
        fontSize: 11,
        color: '#a1a1aa',
        marginRight: 8,
        minWidth: 30
      }}>
        <span style={{ position: 'absolute', top: 10, right: 0, transform: 'translateY(-50%)' }}>{maxHours.toFixed(1)}h</span>
        <span style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}>{(maxHours * 0.5).toFixed(1)}h</span>
        <span style={{ position: 'absolute', bottom: 10, right: 0, transform: 'translateY(50%)' }}>0h</span>
      </div>
      
      {/* 차트 영역 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <BarChart 
          data={data.map(item => ({ 
            value: item.hours, 
            label: '수면 시간',
            day: item.day,
            unit: '',
            displayValue: `${item.sleepHours}시간 ${item.sleepMinutes}분`
          }))}
          maxValue={maxHours}
          color="#00d4aa"
          height={120}
          showTooltip={true}
        />
        
        {/* X축 라벨 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: 4,
          fontSize: 11,
          color: '#a1a1aa',
          paddingLeft: 8,
          paddingRight: 8
        }}>
          <span>일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span>토</span>
        </div>
      </div>
    </div>
  )
}

// 수면 점수 차트 컴포넌트
export const SleepScoreChart = ({ data }) => {
  const maxScore = Math.max(...data.map(item => item.score), 10)
  
  return (
    <div style={{ 
      backgroundColor: '#2a2a2a', 
      borderRadius: 8, 
      padding: 16, 
      height: 180,
      display: 'flex'
    }}>
      {/* 👇 Y축 라벨 정렬을 위해 position: absolute로 수정 */}
      <div style={{ 
        position: 'relative',
        height: 120,
        fontSize: 11,
        color: '#a1a1aa',
        marginRight: 8,
        minWidth: 30
      }}>
        <span style={{ position: 'absolute', top: 10, right: 0, transform: 'translateY(-50%)' }}>{maxScore}점</span>
        <span style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}>{Math.round(maxScore * 0.5)}점</span>
        <span style={{ position: 'absolute', bottom: 10, right: 0, transform: 'translateY(50%)' }}>0점</span>
      </div>
      
      {/* 차트 영역 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <BarChart 
          data={data.map(item => ({ 
            value: item.score, 
            label: '수면 점수',
            day: item.day,
            unit: '점'
          }))}
          maxValue={maxScore}
          color="#22c55e"
          height={120}
          showTooltip={true}
        />
        
        {/* X축 라벨 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: 4,
          fontSize: 11,
          color: '#a1a1aa',
          paddingLeft: 8,
          paddingRight: 8
        }}>
          <span>일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span>토</span>
        </div>
      </div>
    </div>
  )
}
