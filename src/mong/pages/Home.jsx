import React from 'react'
import Container from '../components/Container.jsx'

export default function Home() {
  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      <Container>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingTop: 48, paddingBottom: 48 }}>
          <div style={{ width: 80, height: 80, borderRadius: 9999, backgroundColor: 'rgba(0, 212, 170, 0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 40, height: 40, backgroundColor: '#00d4aa', borderRadius: 8 }} />
          </div>
          <h1 style={{ fontSize: 48, lineHeight: '48px', margin: 0, fontFamily: 'Righteous, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', textAlign: 'center' }}>mong</h1>
          <p style={{ fontSize: 20, lineHeight: '28px', color: '#a1a1aa', margin: 0, textAlign: 'center' }}>
            꿈처럼 달콤한 수면 여행
            <br />
            mong과 함께 완벽한 잠을 찾아보세요
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, width: '100%', marginTop: 24 }}>
            {[{
              title: '스마트 수면 측정',
              desc: '정확한 수면 단계 분석으로 수면의 질을 측\n정합니다',
            }, {
              title: '상세한 통계',
              desc: '개인 맞춤 수면 패턴 분석과 개선 제안을 제\n공합니다',
            }, {
              title: '건강 관리',
              desc: '수면을 통한 전체적인 건강 상태 모니터링',
            }].map((card, idx) => (
              <div key={idx} style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 8 }}>
                <div style={{ width: 48, height: 48, borderRadius: 9999, backgroundColor: 'rgba(0, 212, 170, 0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
                  <div style={{ width: 24, height: 24, backgroundColor: '#00d4aa', borderRadius: 6 }} />
                </div>
                <div style={{ fontSize: 18, lineHeight: '28px' }}>{card.title}</div>
                <div style={{ fontSize: 14, lineHeight: '22.75px', color: '#a1a1aa', textAlign: 'center', whiteSpace: 'pre-line' }}>{card.desc}</div>
              </div>
            ))}
          </div>

          <button style={{ backgroundColor: '#00d4aa', color: '#000', border: 'none', borderRadius: 8, height: 48, padding: '0 24px', marginTop: 24, cursor: 'pointer', fontSize: 18, fontWeight: 500 }}>
            mong과 함께 시작하기
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{ color: '#a1a1aa', fontSize: 14 }}>이미 계정이 있으신가요?</span>
            <a href="/login" style={{ color: '#00d4aa', fontSize: 16, fontWeight: 500, textDecoration: 'none' }}>로그인</a>
          </div>

          <div style={{ width: 448, maxWidth: '100%', marginTop: 24 }}>
            <p style={{ color: '#a1a1aa', fontSize: 14, textAlign: 'center', margin: 0 }}>
              mong은 과학적인 방법으로 수면을 분석하여 더 나은 수면 습관을 만드는 데 도움
              을 드립니다.
            </p>
            <p style={{ color: '#a1a1aa', fontSize: 14, textAlign: 'center', marginTop: 8 }}>
              무료로 시작하고, 언제든지 설정을 변경할 수 있습니다.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}


