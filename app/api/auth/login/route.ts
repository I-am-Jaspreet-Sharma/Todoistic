import dbConnect from "@/db/connection/dbConnect"
import User from "@/db/models/User"
import {NextRequest, NextResponse} from "next/server"
import { SignJWT } from 'jose'
import bcrypt from "bcryptjs"
import mongoose from "mongoose"

interface UserLean {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
}

export async function POST(req: NextRequest){
  const {email, password} = await req.json()

  if(!email || !password){
    return NextResponse.json(
      {error: "Email and Password are required"},
      {status: 400}
    )
  }

  await dbConnect()
  const user = await User.findOne({ email: email }).select('_id email password').lean<UserLean>()

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
      {status: 401}
    )
  }

  if (!process.env.JWT_SECRET) {
    return NextResponse.json(
      {error: "Server configuration error"},
      {status: 500}
    )
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const token = await new SignJWT({ 
    _id: user._id.toString()
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setSubject(user._id.toString()) // Added for JWT best practices
    .setExpirationTime('15m')
    .sign(secret)
  const res = NextResponse.json(
    {message: "User signed in successfully"},
    {status: 200}
  )
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    maxAge: 15 * 60, // 15 minutes (matches JWT expiration)
    path: '/' // Available on all routes
  })

  return res
}
