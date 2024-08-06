import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const verify = request.cookies.get('adminToken');
  if (!verify) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [],
};
