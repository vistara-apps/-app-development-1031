import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const PROTECTED_PATHS = [
  '/dashboard',
  '/dashboard/profile',
  '/dashboard/tiers',
  '/dashboard/content',
  '/dashboard/analytics',
  '/dashboard/subscriptions',
  '/subscriptions',
  '/settings',
];

// Paths that are only accessible to creators
const CREATOR_ONLY_PATHS = [
  '/dashboard/profile',
  '/dashboard/tiers',
  '/dashboard/content',
  '/dashboard/analytics',
];

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;
  
  // Check if the path is protected
  const isProtectedPath = PROTECTED_PATHS.some(protectedPath => 
    path === protectedPath || path.startsWith(`${protectedPath}/`)
  );
  
  // Check if the path is creator-only
  const isCreatorOnlyPath = CREATOR_ONLY_PATHS.some(creatorPath => 
    path === creatorPath || path.startsWith(`${creatorPath}/`)
  );
  
  // Get authentication status from cookies
  const authToken = request.cookies.get('privy-token');
  const userRole = request.cookies.get('fanspark_user_role')?.value || 'fan';
  
  // If the path is protected and the user is not authenticated, redirect to login
  if (isProtectedPath && !authToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If the path is creator-only and the user is not a creator, redirect to dashboard
  if (isCreatorOnlyPath && userRole !== 'creator') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/subscriptions/:path*',
    '/settings/:path*',
  ],
};

