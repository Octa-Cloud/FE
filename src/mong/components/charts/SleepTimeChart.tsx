import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { BarChart as SimpleBarChart } from '../Charts';

interface SleepTimeChartProps {
  data: Array<{ day?: string; date?: string; hours: number; [key: string]: any }>;
  isWeekly?: boolean;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const SleepTimeChart: React.FC<SleepTimeChartProps> = ({ data, isWeekly = true }) => {
  const maxHours = Math.max(...data.map(item => item.hours), 1);
  // Charts.tsx의 BarChart 포맷으로 매핑
  const mapped = data.map(item => {
    const labelText = '수면 시간';
    const dayLabel = (item.day || item.date || '').toString();
    // 분 표시용 디스플레이 값 구성 (주간 데이터에 한해 가독성 향상)
    const whole = Math.floor(item.hours);
    const mins = Math.round((item.hours - whole) * 60);
    return {
      value: item.hours,
      label: labelText,
      day: dayLabel,
      unit: '',
      displayValue: `${whole}시간 ${mins}분`
    };
  });

  return (
    <ErrorBoundary fallback={<div className="text-center py-8 text-[#a1a1aa]">차트를 표시할 수 없습니다</div>}>
      <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: 16, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', height: 120, fontSize: 11, color: '#a1a1aa', marginRight: 8, minWidth: 30 }}>
          <span style={{ position: 'absolute', top: 10, right: 0, transform: 'translateY(-50%)' }}>{maxHours.toFixed(1)}h</span>
          <span style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}>{(maxHours * 0.5).toFixed(1)}h</span>
          <span style={{ position: 'absolute', bottom: 10, right: 0, transform: 'translateY(50%)' }}>0h</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <SimpleBarChart data={mapped} maxValue={maxHours} color="#00D4AA" height={120} showTooltip={true} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: '#a1a1aa', paddingLeft: 8, paddingRight: 8 }}>
            {isWeekly ? (
              <>
                <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
              </>
            ) : (
              // 월간: 실제 데이터에 맞는 날짜 라벨 생성
              (() => {
                const maxDay = Math.max(...data.map(d => parseInt((d.date || '0').toString().replace('일','')) || 0), 0);
                if (maxDay === 0) return [];
                
                // 5일 간격으로 라벨 생성 (최대 7개)
                const interval = Math.max(1, Math.floor(maxDay / 7));
                const labels = [];
                for (let i = 1; i <= maxDay; i += interval) {
                  labels.push(i);
                }
                // 마지막 날짜가 포함되지 않았다면 추가
                if (labels[labels.length - 1] !== maxDay) {
                  labels.push(maxDay);
                }
                return labels.map((n, i) => <span key={i}>{`${n}일`}</span>);
              })()
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SleepTimeChart;
