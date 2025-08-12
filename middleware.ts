import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  if(!token){
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET)

  try {
    const {payload} = await jwtVerify(token, secret)
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-id', payload._id as string)
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }
}

export const config = {
  matcher: ['/todos/:path*', '/api/todos/:path*']
}
