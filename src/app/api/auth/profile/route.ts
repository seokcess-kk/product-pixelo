import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * 프로필 생성/수정 스키마
 */
const profileSchema = z.object({
  nickname: z
    .string()
    .min(2, '닉네임은 2자 이상이어야 합니다.')
    .max(20, '닉네임은 20자 이하여야 합니다.')
    .regex(/^[가-힣a-zA-Z0-9_]+$/, '닉네임은 한글, 영문, 숫자, 밑줄(_)만 사용할 수 있습니다.'),
  avatarUrl: z.string().url('올바른 URL 형식이 아닙니다.').optional().nullable(),
})

/**
 * GET /api/auth/profile
 * 현재 사용자의 프로필 조회
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: { code: 'NOT_AUTHENTICATED', message: '로그인이 필요합니다.' } },
        { status: 401 }
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (profileError && profileError.code === 'PGRST116') {
      return NextResponse.json(
        { error: { code: 'PROFILE_NOT_FOUND', message: '프로필을 찾을 수 없습니다.' } },
        { status: 404 }
      )
    }

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { error: { code: 'PROFILE_FETCH_ERROR', message: '프로필 조회에 실패했습니다.' } },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: {
        id: profile.id,
        userId: profile.user_id,
        nickname: profile.nickname,
        avatarUrl: profile.avatar_url,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      },
    })
  } catch (err) {
    console.error('Profile get error:', err)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다.' } },
      { status: 500 }
    )
  }
}

/**
 * POST /api/auth/profile
 * 새 프로필 생성 (온보딩)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: { code: 'NOT_AUTHENTICATED', message: '로그인이 필요합니다.' } },
        { status: 401 }
      )
    }

    // 이미 프로필이 있는지 확인
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existingProfile) {
      return NextResponse.json(
        { error: { code: 'PROFILE_EXISTS', message: '이미 프로필이 존재합니다.' } },
        { status: 409 }
      )
    }

    // 요청 바디 파싱 및 유효성 검사
    const body = await request.json()
    const validationResult = profileSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: validationResult.error.errors[0]?.message ?? '입력값이 올바르지 않습니다.',
            details: validationResult.error.errors,
          },
        },
        { status: 400 }
      )
    }

    const { nickname, avatarUrl } = validationResult.data

    // 닉네임 중복 확인
    const { data: duplicateNickname } = await supabase
      .from('profiles')
      .select('id')
      .eq('nickname', nickname)
      .single()

    if (duplicateNickname) {
      return NextResponse.json(
        { error: { code: 'NICKNAME_DUPLICATE', message: '이미 사용 중인 닉네임입니다.' } },
        { status: 409 }
      )
    }

    // 프로필 생성
    const { data: profile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        nickname,
        avatar_url: avatarUrl ?? null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Profile insert error:', insertError)
      return NextResponse.json(
        { error: { code: 'PROFILE_CREATE_ERROR', message: '프로필 생성에 실패했습니다.' } },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        data: {
          id: profile.id,
          userId: profile.user_id,
          nickname: profile.nickname,
          avatarUrl: profile.avatar_url,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
        },
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('Profile create error:', err)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다.' } },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/auth/profile
 * 프로필 수정
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: { code: 'NOT_AUTHENTICATED', message: '로그인이 필요합니다.' } },
        { status: 401 }
      )
    }

    // 기존 프로필 확인
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (fetchError && fetchError.code === 'PGRST116') {
      return NextResponse.json(
        { error: { code: 'PROFILE_NOT_FOUND', message: '프로필을 찾을 수 없습니다.' } },
        { status: 404 }
      )
    }

    if (fetchError) {
      console.error('Profile fetch error:', fetchError)
      return NextResponse.json(
        { error: { code: 'PROFILE_FETCH_ERROR', message: '프로필 조회에 실패했습니다.' } },
        { status: 500 }
      )
    }

    // 요청 바디 파싱 및 유효성 검사 (부분 업데이트 허용)
    const body = await request.json()
    const validationResult = profileSchema.partial().safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: validationResult.error.errors[0]?.message ?? '입력값이 올바르지 않습니다.',
            details: validationResult.error.errors,
          },
        },
        { status: 400 }
      )
    }

    const { nickname, avatarUrl } = validationResult.data

    // 닉네임 변경 시 중복 확인
    if (nickname && nickname !== existingProfile.nickname) {
      const { data: duplicateNickname } = await supabase
        .from('profiles')
        .select('id')
        .eq('nickname', nickname)
        .single()

      if (duplicateNickname) {
        return NextResponse.json(
          { error: { code: 'NICKNAME_DUPLICATE', message: '이미 사용 중인 닉네임입니다.' } },
          { status: 409 }
        )
      }
    }

    // 업데이트할 필드 구성
    const updateData: Record<string, unknown> = {}
    if (nickname !== undefined) updateData.nickname = nickname
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: { code: 'NO_UPDATE_DATA', message: '수정할 내용이 없습니다.' } },
        { status: 400 }
      )
    }

    // 프로필 업데이트
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Profile update error:', updateError)
      return NextResponse.json(
        { error: { code: 'PROFILE_UPDATE_ERROR', message: '프로필 수정에 실패했습니다.' } },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: {
        id: profile.id,
        userId: profile.user_id,
        nickname: profile.nickname,
        avatarUrl: profile.avatar_url,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      },
    })
  } catch (err) {
    console.error('Profile update error:', err)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다.' } },
      { status: 500 }
    )
  }
}
