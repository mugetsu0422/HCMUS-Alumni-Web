import { NextResponse, type NextRequest } from 'next/server'

const paths = [
  '/signin',
  '/signup',
  '/verify-alumni',
]
const excludedPathsRegex = new RegExp('\/((signin|signup|verify-alumni))')

export function middleware(request: NextRequest) {
  // Không cần đăng nhập
  // if (
  //   excludedPathsRegex.test(request.nextUrl.pathname)
  // ) {
  //   return NextResponse.next()
  // }

  // const jwt = request.cookies.get('jwt')?.value
  // const roles = request.cookies.get('roles')?.value
  
  // Cần đăng nhập
  // if (!jwt || !roles) {
  //   return NextResponse.redirect(new URL('/signin', request.url))
  // }
  // // // Đã đăng nhập
  // if (request.nextUrl.pathname === '/') { 
  //   return NextResponse.redirect(new URL('/home-page', request.url))
  // }

  // // Admin
  // if (!roles?.includes('Admin') && request.nextUrl.pathname.startsWith('/admin')) {
  //   return NextResponse.redirect(new URL('/signin', request.url))
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
