import { NextResponse, type NextRequest } from 'next/server'

const publicPaths = [
  '/',
  '/about-school',
  '/signin',
  '/signup',
  '/forgot-password',
  '/verify-alumni',
]
const publicPathsStartWith = ['/news', '/events', '/hof']

const adminPathsStartWith = [
  '/admin/users/',
  '/admin/roles/create',
  '/admin/roles/',
  '/admin/alumni-verification/',
  '/admin/news/create',
  '/admin/news/',
  '/admin/events/create',
  '/admin/events/',
  '/admin/hof/create',
  '/admin/hof/',
]
const adminPermissionMapUrl = {
  'User.Edit': '/admin/users/',
  'User.Role.Create': '/admin/roles/create',
  'User.Role.Edit': '/admin/roles/',
  'AlumniVerify.Read': '/admin/alumni-verification/',
  'News.Create': '/admin/news/create',
  'News.Edit': '/admin/news/',
  'Event.Create': '/admin/events/create',
  'Event.Edit': '/admin/events/',
  'Hof.Create': '/admin/hof/create',
  'Hof.Edit': '/admin/hof/',
}

function getRequiredPermissionForUrl(url) {
  for (const [permission, path] of Object.entries(adminPermissionMapUrl)) {
    if (url.startsWith(path)) {
      return permission
    }
  }
  return null
}

export function middleware(request: NextRequest) {
  const jwt = request.cookies.get('jwt')?.value

  // Đã đăng nhập
  if (jwt && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/home-page', request.url))
  }

  // Không cần đăng nhập
  const isPublic = publicPaths.includes(request.nextUrl.pathname)
  const isPublicStartWith =
    isPublic ||
    publicPathsStartWith.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    )
  if (isPublic || isPublicStartWith) {
    return NextResponse.next()
  }

  // Cần đăng nhập
  if (!jwt) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  const permissions = request.cookies.get('permissions')?.value

  // // Admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const requiredPermission = getRequiredPermissionForUrl(
      request.nextUrl.pathname
    )
    if (!requiredPermission || permissions.includes(requiredPermission)) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL('/home-page', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
