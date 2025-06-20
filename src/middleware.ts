import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // const token = request.cookies.get('admin_token')?.value;
  // const isLoggedIn = !!token;
  // const pathname = request.nextUrl.pathname;

  // const isLoginPage = pathname === '/administrator';

  // // ✅ This ensures only /admin/** is protected (NOT /administrator)
  // const isAdminRoute =
  //   pathname.startsWith('/admin') && !pathname.startsWith('/administrator');

  // // 🔒 If user is accessing /admin/** without login
  // if (isAdminRoute && !isLoggedIn) {
  //   return NextResponse.redirect(new URL('/administrator', request.url));
  // }

  // // 🔁 If logged-in user tries to access /administrator again
  // if (isLoginPage && isLoggedIn) {
  //   return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  // }

  // return NextResponse.next();
}
