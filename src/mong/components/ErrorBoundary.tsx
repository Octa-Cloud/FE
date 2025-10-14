import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * 에러 바운더리 컴포넌트
 * 차트 렌더링 오류 등을 잡아서 앱 전체가 크래시되는 것을 방지합니다.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 커스텀 에러 핸들러 호출
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      // 커스텀 fallback이 제공되면 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // 기본 에러 UI
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#fb2c36" 
            strokeWidth="2"
            className="mb-4"
          >
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h3 className="text-lg font-semibold text-white mb-2">
            데이터를 표시할 수 없습니다
          </h3>
          <p className="text-sm text-[#a1a1aa] mb-4">
            {this.state.error?.message || '알 수 없는 오류가 발생했습니다.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00b894] transition-colors"
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

