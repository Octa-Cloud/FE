import React from 'react';

interface EmptyStateProps {
  type?: 'weekly' | 'monthly';
  onStartSleepRecord?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  type = 'weekly', 
  onStartSleepRecord 
}) => {
  const message = type === 'weekly' 
    ? '이번 주는 아직 수면 기록이 없습니다'
    : '이번 달은 아직 수면 기록이 없습니다';

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      {/* Sleep Icon */}
      <div className="mb-6">
        <svg 
          width="80" 
          height="80" 
          viewBox="0 0 80 80" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#a1a1aa]"
        >
          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="2" opacity="0.2" />
          <path 
            d="M25 35C25 30.5817 28.5817 27 33 27H47C51.4183 27 55 30.5817 55 35V45C55 49.4183 51.4183 53 47 53H33C28.5817 53 25 49.4183 25 45V35Z" 
            stroke="currentColor" 
            strokeWidth="2"
            fill="none"
          />
          <circle cx="35" cy="38" r="2" fill="currentColor" />
          <circle cx="45" cy="38" r="2" fill="currentColor" />
          <path 
            d="M32 45C32 45 35 48 40 48C45 48 48 45 48 45" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Z symbols for sleep */}
          <text x="58" y="25" fill="currentColor" fontSize="12" fontWeight="bold">Z</text>
          <text x="63" y="20" fill="currentColor" fontSize="10" fontWeight="bold" opacity="0.7">Z</text>
          <text x="67" y="16" fill="currentColor" fontSize="8" fontWeight="bold" opacity="0.5">Z</text>
        </svg>
      </div>

      {/* Message */}
      <h3 className="text-xl font-semibold text-white mb-2 text-center">
        {message}
      </h3>
      <p className="text-[#a1a1aa] text-center mb-8 max-w-md">
        첫 번째 수면을 기록하고 패턴을 분석해보세요. 
        수면의 질을 개선하는 첫걸음입니다.
      </p>

      {/* Action Button */}
      {onStartSleepRecord && (
        <button
          onClick={onStartSleepRecord}
          className="px-6 py-3 bg-[#00d4aa] text-black font-medium rounded-lg hover:bg-[#00b894] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:ring-offset-2 focus:ring-offset-black"
          aria-label="수면 기록 시작하기"
        >
          수면 기록 시작하기
        </button>
      )}
    </div>
  );
};

export default EmptyState;

