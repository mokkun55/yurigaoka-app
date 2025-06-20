import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 認証していないユーザー向け
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/create-user") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/api") &&
    // TODO 開発用なので後で消す
    !request.nextUrl.pathname.startsWith("/develop")
  ) {
    console.log("[middleware] 未認証のため /login へリダイレクト");
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 認証しているユーザー向け
  if (user && request.nextUrl.pathname.startsWith("/login")) {
    console.log(
      "[middleware] 認証済みユーザーが /login にアクセスしたため / へリダイレクト"
    );
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 初回登録が完了していないユーザーはリダイレクトさせる（cookieでキャッシュ）
  if (
    user &&
    !request.nextUrl.pathname.startsWith("/create-user") &&
    !request.nextUrl.pathname.startsWith("/register") &&
    !request.nextUrl.pathname.startsWith("/api") &&
    !request.nextUrl.pathname.startsWith("/develop")
  ) {
    // まずcookieを参照
    const isRegisteredCookie = request.cookies.get("is_registered")?.value;

    if (isRegisteredCookie === "false") {
      console.log(
        "[middleware] is_registered cookieがfalseのため /create-user へリダイレクト"
      );
      // 未登録ならリダイレクト
      const url = request.nextUrl.clone();
      url.pathname = "/create-user";
      return NextResponse.redirect(url);
    }

    if (!isRegisteredCookie) {
      // cookieがなければDBアクセス
      // first_nameが空の場合は初回登録とみなす
      const { data: userData, error } = await supabase
        .from("users")
        .select("first_name")
        .eq("id", user.id)
        .single();
      // console.log("userData", userData);

      const isRegistered = !error && userData && userData.first_name;
      // cookieに保存
      supabaseResponse.cookies.set(
        "is_registered",
        isRegistered ? "true" : "false",
        { path: "/" }
      );

      if (!isRegistered) {
        console.log(
          "[middleware] DB確認で未登録のため /create-user へリダイレクト"
        );
        const url = request.nextUrl.clone();
        url.pathname = "/create-user";
        return NextResponse.redirect(url);
      }
    }
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

  return supabaseResponse;
}
