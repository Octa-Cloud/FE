import React, { useState } from 'react';

// BarChart에 전달될 데이터 항목의 타입을 정의합니다.
interface BarChartItem {
    value: number;
    label: string;
    day: string;
    unit?: string;
    displayValue?: string;
}

// BarChart 컴포넌트의 props 타입을 정의합니다.
interface BarChartProps {
    data: BarChartItem[];
    maxValue: number;
    color?: string;
    height?: number;
    showTooltip?: boolean;
}

// BarChart 컴포넌트
export const BarChart: React.FC<BarChartProps> = ({ data, maxValue, color = '#00d4aa', height = 120, showTooltip = false }) => {
    const maxBarHeight = height - 20;
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            height: height,
            padding: '10px 0',
            gap: 4,
            position: 'relative'
        }}>
            {data.map((item, index) => {
                const barHeight = maxValue > 0 ? (item.value / maxValue) * maxBarHeight : 0;
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

// Chart 컴포넌트에 전달될 데이터의 타입을 정의합니다.
interface ChartData {
    day: string;
    dayOfWeekLabel: string;
}

interface SleepHoursData extends ChartData {
    hours: number;
    sleepHours: number;
    sleepMinutes: number;
}

interface SleepScoreData extends ChartData {
    score: number;
}

// SleepHoursChart 컴포넌트의 props 타입을 정의합니다.
interface SleepHoursChartProps {
    data: SleepHoursData[];
}

// 수면 시간 차트 컴포넌트
export const SleepHoursChart: React.FC<SleepHoursChartProps> = ({ data }) => {
    const maxHours = Math.max(...data.map(item => item.hours), 1);

    return (
        <div style={{
            backgroundColor: '#2a2a2a',
            borderRadius: 8,
            padding: 16,
            height: 180,
            display: 'flex'
        }}>
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

// SleepScoreChart 컴포넌트의 props 타입을 정의합니다.
interface SleepScoreChartProps {
    data: SleepScoreData[];
}

// 수면 점수 차트 컴포넌트
export const SleepScoreChart: React.FC<SleepScoreChartProps> = ({ data }) => {
    const maxScore = Math.max(...data.map(item => item.score), 10);

    return (
        <div style={{
            backgroundColor: '#2a2a2a',
            borderRadius: 8,
            padding: 16,
            height: 180,
            display: 'flex'
        }}>
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
