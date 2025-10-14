import React, { useId } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ErrorBoundary from '../ErrorBoundary';

interface SleepTimeChartProps {
  data: Array<{ day?: string; date?: string; hours: number; [key: string]: any }>;
  isWeekly?: boolean;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

const SleepTimeChart: React.FC<SleepTimeChartProps> = ({ 
  data, 
  isWeekly = true, 
  margin = { top: 10, right: 10, left: 30, bottom: 30 }
}) => {
  // 고유한 gradient ID 생성 - 여러 차트 인스턴스에서 ID 충돌 방지
  const gradientId = useId();
  const xAxisConfig = isWeekly 
    ? {
        dataKey: "day" as const,
        axisLine: false,
        tickLine: false,
        height: 30,
        tick: { fontSize: 12, fill: '#a1a1aa' }
      }
    : {
        dataKey: "date" as const,
        axisLine: false,
        tickLine: false,
        height: 30,
        tick: { fontSize: 10, fill: '#a1a1aa' },
        interval: 4,
        tickFormatter: (value: string, index: number) => {
          const day = parseInt(value.replace('일', ''));
          return [1, 6, 11, 16, 21, 26, 31].includes(day) ? value : '';
        }
      };

  const yAxisConfig = {
    domain: [0, 10] as [number, number],
    ticks: isWeekly ? [0, 2, 4, 6, 8, 10] : undefined,
    tickCount: isWeekly ? undefined : 6,
    axisLine: false,
    tickLine: false,
    tick: { fontSize: 12, fill: '#a1a1aa' }
  };

  const tooltipConfig = {
    contentStyle: {
      backgroundColor: '#1a1a1a',
      border: '1px solid #2a2a2a',
      borderRadius: '8px',
      color: '#ffffff'
    },
    labelStyle: { color: '#ffffff' },
    formatter: (value: number) => [`${value}시간`, '수면 시간']
  };

  const barConfig = {
    dataKey: isWeekly ? "hours" : "hours",
    fill: `url(#${gradientId})`,
    radius: (isWeekly ? [4, 4, 0, 0] : [3, 3, 0, 0]) as [number, number, number, number],
    stroke: "#00d4aa",
    strokeWidth: 0.5,
    maxBarSize: isWeekly ? 40 : 6
  };

  return (
    <ErrorBoundary fallback={<div className="text-center py-8 text-[#a1a1aa]">차트를 표시할 수 없습니다</div>}>
      <div className="h-[240px] p-5 rounded-[14px] bg-[#1a1a1a] border border-[#2a2a2a] relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis {...xAxisConfig} />
            <YAxis {...yAxisConfig} />
            <Tooltip {...tooltipConfig} />
            <Bar {...barConfig} />
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d4aa" />
                <stop offset="100%" stopColor="#00b894" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ErrorBoundary>
  );
};

export default SleepTimeChart;
