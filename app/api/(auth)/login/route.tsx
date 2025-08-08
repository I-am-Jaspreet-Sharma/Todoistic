import {NextRequest, NextResponse} from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/db/connection/dbConnect"
import User from "@/db/models/User"
import Session from "@/db/models/Session"

export async function POST(request: NextRequest){
  const {email, password} = await request.json()
  if(!email || !password){
    return NextResponse.json(
      {error: "Email and password are required"},
      {status: 400}
    )
  }
  await dbConnect()
  const user = await User.findOne({email: email})
  if(!user){
    return NextResponse.json(
      {error: "User does not exist"},
      {status: 400}
    )
  }
  const isVerified = await bcrypt.compare(password, user.password)
  if(!isVerified){
    return NextResponse.json(
      {error: "Invalid password"},
      {status: 400}
    )
  }
  const session = await Session.create({userId: user._id})
  const response = NextResponse.json(
    {message: "User logged in successfully"},
    {status: 200}
  )
  response.cookies.set("session-id", session._id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 // 7 days
  })
  return response
}
