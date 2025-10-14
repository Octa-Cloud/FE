import React, { useId } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ErrorBoundary from '../ErrorBoundary';

interface SleepScoreChartProps {
  data: Array<{ day?: string; date?: string; score: number; [key: string]: any }>;
  isWeekly?: boolean;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  yAxisConfig?: {
    domain: [number, number];
    ticks?: number[];
    tickCount?: number;
  };
}

const SleepScoreChart: React.FC<SleepScoreChartProps> = ({ 
  data, 
  isWeekly = true, 
  margin = { top: 10, right: 30, left: 30, bottom: 30 },
  yAxisConfig: customYAxisConfig
}) => {
  // 고유한 gradient ID 생성 - 여러 차트 인스턴스에서 ID 충돌 방지
  const gradientId = useId();
  const xAxisConfig = isWeekly 
    ? {
        dataKey: "day" as const,
        axisLine: false,
        tickLine: false,
        height: 30,
        tick: { fontSize: window.innerWidth < 640 ? 10 : 12, fill: '#a1a1aa' }
      }
    : {
        dataKey: "date" as const,
        axisLine: false,
        tickLine: false,
        height: 30,
        tick: { fontSize: window.innerWidth < 640 ? 9 : 10, fill: '#a1a1aa' },
        interval: 4,
        tickFormatter: (value: string, index: number) => {
          const day = parseInt(value.replace('일', ''));
          return [1, 6, 11, 16, 21, 26, 31].includes(day) ? value : '';
        }
      };

  const defaultYAxisConfig = {
    domain: [0, 100] as [number, number],
    ticks: undefined as number[] | undefined,
    tickCount: 6
  };

  const yAxisConfig = {
    ...defaultYAxisConfig,
    ...customYAxisConfig,
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
    formatter: (value: number) => [`${value}점`, '수면 점수']
  };

  const barConfig = {
    dataKey: "score" as const,
    fill: `url(#${gradientId})`,
    radius: (isWeekly ? [4, 4, 0, 0] : [3, 3, 0, 0]) as [number, number, number, number],
    stroke: "#3b82f6",
    strokeWidth: 0.5,
    maxBarSize: isWeekly ? 30 : 5
  };

  return (
    <ErrorBoundary fallback={<div className="text-center py-8 text-[#a1a1aa]">차트를 표시할 수 없습니다</div>}>
      <div className="h-[200px] md:h-[240px] rounded-[14px] bg-[#1a1a1a] border border-[#2a2a2a] relative flex items-center justify-center p-4">
        <div className="flex items-center justify-center w-full h-full">
          <BarChart 
            width={isWeekly ? 280 : 360} 
            height={isWeekly ? 160 : 200} 
            data={data} 
            margin={margin}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis {...xAxisConfig} />
            <YAxis {...yAxisConfig} />
            <Tooltip {...tooltipConfig} />
            <Bar {...barConfig} />
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </BarChart>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SleepScoreChart;
