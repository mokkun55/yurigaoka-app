import { type NextRequest, NextResponse } from 'next/server'

/**
 * セッションCookieを検証してカスタムクレームを取得
 */
async function verifySession(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('__session')?.value

    if (!sessionCookie) {
      return null
    }

    // 絶対URLを構築（ミドルウェアでは相対URLは使えない）
    const url = new URL('/api/auth/verify-token', request.url)
    const response = await fetch(url, {
      headers: {
        cookie: request.headers.get('cookie') ?? '',
      },
    })
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    return {
      role: data.role,
      isRegistered: data.isRegistered,
    }
  } catch (error) {
    console.error('セッション検証エラー:', error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 保護しないパス（認証チェックをスキップ）
  const ignoreUrls = ['/api', '/auth', '/develop', '/error', '/logout']
  if (ignoreUrls.some((url) => pathname.startsWith(url))) {
    return NextResponse.next()
  }

  // セッションを検証
  const session = await verifySession(request)

  // 教員のアクセスを拒否（どのページでも）
  if (session?.role === 'teacher') {
    return NextResponse.redirect(new URL('/error/teacher-access-denied', request.url))
  }

  // 公開ページ（認証不要だが、認証済みユーザーは別ページへリダイレクト）
  const publicUrls = ['/login']
  if (publicUrls.some((url) => pathname.startsWith(url))) {
    // 既にログイン済みの場合はホームへリダイレクト
    if (session?.isRegistered) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // 未登録の場合は登録ページへリダイレクト
    if (session && !session.isRegistered) {
      return NextResponse.redirect(new URL('/create-user', request.url))
    }
    return NextResponse.next()
  }

  // 登録ページ（認証済みかつ未登録のみアクセス可能）
  const registrationUrls = ['/create-user']
  if (registrationUrls.some((url) => pathname.startsWith(url))) {
    // 未ログインの場合はログインページへリダイレクト
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // 既に登録済みの場合はホームへリダイレクト
    if (session.isRegistered) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // その他の保護されたページ（ホーム、欠席届、履歴、設定など）
  // 未ログインの場合はログインページへリダイレクト
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 未登録の場合は登録ページへリダイレクト
  if (!session.isRegistered) {
    return NextResponse.redirect(new URL('/create-user', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
