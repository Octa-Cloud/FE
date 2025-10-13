import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { BrainwaveAnalysis } from '../../types/sleepData';
import { BRAINWAVE_LEVEL_MAP, CHART_CONFIG } from '../../constants/sleep';

interface BrainwaveChartProps {
  brainwaveAnalysis: BrainwaveAnalysis;
  height?: number;
}

/**
 * 뇌파 분석 차트 컴포넌트
 * Recharts AreaChart를 사용하여 뇌파 등급(A~E)을 시각화합니다.
 */
const BrainwaveChart: React.FC<BrainwaveChartProps> = React.memo(({ 
  brainwaveAnalysis,
  height = CHART_CONFIG.BRAINWAVE_HEIGHT 
}) => {
  // 차트 데이터 메모이제이션
  const chartData = useMemo(() => {
    if (!brainwaveAnalysis?.dataPoints) return [];
    
    return brainwaveAnalysis.dataPoints.map((point) => ({
      time: point.time,
      level: point.level,
      intensity: point.intensity,
      yValue: BRAINWAVE_LEVEL_MAP[point.level]
    }));
  }, [brainwaveAnalysis?.dataPoints]);

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.5" className="mb-3 opacity-50">
          <path d="M12 18V5"/>
          <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/>
        </svg>
        <p className="text-sm text-[#a1a1aa]">뇌파 데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="recharts-responsive-container" style={{ width: '100%', height: `${height}px`, minWidth: '0px' }}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart 
          data={chartData}
          margin={CHART_CONFIG.MARGIN}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={CHART_CONFIG.GRID_STROKE} 
          />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: CHART_CONFIG.AXIS_COLOR }}
          />
          <YAxis
            domain={[0, 4]}
            ticks={[0, 1, 2, 3, 4]}
            tickFormatter={(value) => ['A', 'B', 'C', 'D', 'E'][value]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: CHART_CONFIG.AXIS_COLOR }}
            label={{ 
              value: '뇌파 등급', 
              angle: -90, 
              position: 'insideLeft', 
              style: { textAnchor: 'middle', fill: '#808080' } 
            }}
          />
          <defs>
            <linearGradient id="brainwaveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e40af" stopOpacity={0.8} />
              <stop offset="25%" stopColor="#3b82f6" stopOpacity={0.6} />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity={0.4} />
              <stop offset="75%" stopColor="#93c5fd" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#dbeafe" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="yValue"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#brainwaveGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

BrainwaveChart.displayName = 'BrainwaveChart';

export default BrainwaveChart;

