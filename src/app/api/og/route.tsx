/**
 * OG (Open Graph) 이미지 동적 생성 API
 *
 * Next.js의 ImageResponse를 사용하여 동적 OG 이미지를 생성합니다.
 * 카카오톡, 트위터, 페이스북 등 SNS 공유시 미리보기 이미지로 사용됩니다.
 *
 * 사용법:
 * GET /api/og?userId=xxx&seasonId=yyy
 */

import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

// =============================================================================
// 설정
// =============================================================================

export const runtime = 'edge'

// OG 이미지 크기 (1200x630은 표준 OG 이미지 크기)
const OG_WIDTH = 1200
const OG_HEIGHT = 630

// 축별 색상
const AXIS_COLORS: Record<string, string> = {
  energy: '#FF6B6B',
  lifestyle: '#FFB347',
  emotion: '#FF85A2',
  aesthetic: '#55EFC4',
  social: '#74B9FF',
  challenge: '#A855F7',
  relationship: '#FDCB6E',
}

// 축별 이름
const AXIS_NAMES: Record<string, { low: string; high: string }> = {
  energy: { low: '내향', high: '외향' },
  lifestyle: { low: '루틴', high: '즉흥' },
  emotion: { low: '이성', high: '감성' },
  aesthetic: { low: '미니멀', high: '맥시멀' },
  social: { low: '개인', high: '협력' },
  challenge: { low: '안정', high: '모험' },
  relationship: { low: '깊은관계', high: '넓은관계' },
}

// =============================================================================
// 타입
// =============================================================================

interface UserData {
  nickname: string
  seasonName: string
  seasonNumber?: number
}

interface AxisScore {
  axisCode: string
  averageScore: number
}

// =============================================================================
// Mock 데이터 (실제 구현시 Supabase에서 가져옴)
// =============================================================================

async function fetchUserData(userId: string, seasonId?: string): Promise<UserData> {
  // TODO: Supabase에서 실제 데이터 가져오기
  return {
    nickname: '픽셀러버',
    seasonName: '봄의 시작',
    seasonNumber: 1,
  }
}

async function fetchAxisScores(userId: string, seasonId?: string): Promise<AxisScore[]> {
  // TODO: Supabase에서 실제 데이터 가져오기
  return [
    { axisCode: 'energy', averageScore: 3.6 },
    { axisCode: 'lifestyle', averageScore: 2.4 },
    { axisCode: 'emotion', averageScore: 4.0 },
    { axisCode: 'aesthetic', averageScore: 3.0 },
    { axisCode: 'social', averageScore: 4.4 },
    { axisCode: 'challenge', averageScore: 2.0 },
    { axisCode: 'relationship', averageScore: 3.4 },
  ]
}

// =============================================================================
// 점수 바 컴포넌트
// =============================================================================

function ScoreBar({
  axisCode,
  score,
  width,
}: {
  axisCode: string
  score: number
  width: number
}) {
  const names = AXIS_NAMES[axisCode] ?? { low: '?', high: '?' }
  const color = AXIS_COLORS[axisCode] ?? '#888888'
  const percentage = ((score - 1) / 4) * 100

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
      }}
    >
      <span
        style={{
          width: '60px',
          textAlign: 'right',
          fontSize: '14px',
          color: '#424242',
        }}
      >
        {names.low}
      </span>
      <div
        style={{
          display: 'flex',
          flex: 1,
          height: '12px',
          backgroundColor: '#E0E0E0',
          borderRadius: '6px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '6px',
          }}
        />
        {/* 점수 마커 */}
        <div
          style={{
            position: 'absolute',
            left: `${percentage}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '16px',
            height: '16px',
            backgroundColor: color,
            borderRadius: '50%',
            border: '2px solid white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      <span
        style={{
          width: '60px',
          fontSize: '14px',
          color: '#424242',
        }}
      >
        {names.high}
      </span>
    </div>
  )
}

// =============================================================================
// API Handler
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') ?? 'demo'
    const seasonId = searchParams.get('seasonId') ?? undefined

    // 데이터 가져오기
    const [userData, axisScores] = await Promise.all([
      fetchUserData(userId, seasonId),
      fetchAxisScores(userId, seasonId),
    ])

    // OG 이미지 생성
    return new ImageResponse(
      (
        <div
          style={{
            width: OG_WIDTH,
            height: OG_HEIGHT,
            display: 'flex',
            flexDirection: 'row',
            background: 'linear-gradient(135deg, #F0F4FF 0%, #FFFFFF 100%)',
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* 왼쪽: 공간 미리보기 영역 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '400px',
              marginRight: '40px',
            }}
          >
            {/* 아바타 & 닉네임 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#DFE7FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  color: '#4D6FFF',
                  fontWeight: 'bold',
                }}
              >
                {userData.nickname.slice(0, 1)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#212121',
                  }}
                >
                  {userData.nickname}
                </span>
                <span style={{ fontSize: '16px', color: '#757575' }}>
                  {userData.seasonNumber ? `Season ${userData.seasonNumber}` : ''}{' '}
                  {userData.seasonName}
                </span>
              </div>
            </div>

            {/* 공간 미리보기 박스 */}
            <div
              style={{
                width: '280px',
                height: '280px',
                backgroundColor: '#F5F5F5',
                borderRadius: '16px',
                border: '2px solid rgba(26, 26, 46, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* 픽셀 그리드 패턴 */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `
                    linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '28px 28px',
                  borderRadius: '14px',
                }}
              />
              <span style={{ color: '#9E9E9E', fontSize: '14px' }}>
                나만의 픽셀 공간
              </span>
            </div>
          </div>

          {/* 오른쪽: 성향 프로필 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#212121',
                marginBottom: '20px',
              }}
            >
              나의 성향 프로필
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {axisScores.map((score) => (
                <ScoreBar
                  key={score.axisCode}
                  axisCode={score.axisCode}
                  score={score.averageScore}
                  width={400}
                />
              ))}
            </div>

            {/* PIXELO 브랜딩 */}
            <div
              style={{
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#4D6FFF',
                letterSpacing: '2px',
              }}
            >
              PIXELO
            </div>
          </div>
        </div>
      ),
      {
        width: OG_WIDTH,
        height: OG_HEIGHT,
      }
    )
  } catch (error) {
    console.error('OG image generation failed:', error)

    // 에러시 기본 이미지 반환
    return new ImageResponse(
      (
        <div
          style={{
            width: OG_WIDTH,
            height: OG_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #F0F4FF 0%, #FFFFFF 100%)',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#4D6FFF',
                letterSpacing: '4px',
              }}
            >
              PIXELO
            </span>
            <span style={{ fontSize: '20px', color: '#757575' }}>
              픽셀로 만나는 나의 세계
            </span>
          </div>
        </div>
      ),
      {
        width: OG_WIDTH,
        height: OG_HEIGHT,
      }
    )
  }
}
