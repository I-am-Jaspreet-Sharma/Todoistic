import {NextRequest, NextResponse} from "next/server"

export async function POST(req:NextRequest){
  const token = req.cookies.get("token")?.value
  if(!token){
    return NextResponse.json(
      {error: "Unauthorized"},
      {status: 401}
    )
  }
  const res = NextResponse.json(
    {message: "User logged out successfully"},
    {status: 200}
  )
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    maxAge: 0,
    path: '/' // Available on all routes
  })

  return res
}
