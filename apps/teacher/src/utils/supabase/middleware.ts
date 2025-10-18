import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// 開発用ミドルウェア無効化モード
const devMode = false

// 未ログインでもアクセス可能なページ
const publicPages = ['/login', '/access-denied']

export async function updateSession(request: NextRequest) {
  if (devMode) {
    console.log('[middleware] 開発用ミドルウェア無効化モード')
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const canAccess = async () => {
    if (!user) {
      return false
    }
    if (!user.email) {
      return false
    }
    const { data, error } = await supabase
      .from('whitelist')
      .select('*')
      .eq('email', user.email.replace('@ktc.ac.jp', ''))
      .maybeSingle()
    if (error) {
      console.error('[middleware] 教師権限チェックエラー:', error)
      return false
    }
    const hasAccess = data !== null
    console.log('[middleware] 教師権限チェック結果:', hasAccess)

    return hasAccess
  }

  // 認証コールバック処理中は認証チェックをスキップ
  if (request.nextUrl.pathname.startsWith('/api/auth/callback')) {
    console.log('[middleware] 認証コールバック処理中、認証チェックをスキップ')
    return supabaseResponse
  }

  // 認証していないユーザー向け
  if (!user && !publicPages.includes(request.nextUrl.pathname)) {
    console.log('[middleware] 未認証のため /access-denied へリダイレクト')
    const url = request.nextUrl.clone()
    url.pathname = '/access-denied'
    return NextResponse.redirect(url)
  }

  // 教師権限チェック（認証済みユーザーのみ）
  if (user && !(await canAccess())) {
    // 既に /access-denied にいる場合はリダイレクトしない
    if (request.nextUrl.pathname === '/access-denied') {
      console.log('[middleware] 教師権限なしユーザーが /access-denied にいるため、そのまま通す')
      return supabaseResponse
    }
    console.log('[middleware] 教師権限がないため /access-denied へリダイレクト')
    const url = request.nextUrl.clone()
    url.pathname = '/access-denied'
    return NextResponse.redirect(url)
  }

  // 認証しているユーザー向け（教師権限がある場合のみ）
  if (user && publicPages.includes(request.nextUrl.pathname)) {
    console.log('[middleware] 認証済みユーザーが公開ページにアクセスしたため /home へリダイレクト')
    const url = request.nextUrl.clone()
    url.pathname = '/home'
    return NextResponse.redirect(url)
  }

  // ルートパス（/）へのアクセスを /home にリダイレクト
  if (request.nextUrl.pathname === '/') {
    console.log('[middleware] ルートパス（/）へのアクセスのため /home へリダイレクト')
    const url = request.nextUrl.clone()
    url.pathname = '/home'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
