import {NextRequest, NextResponse} from "next/server"
import dbConnect from "@/db/connection/dbConnect"
import User from "@/db/models/User"

export async function POST(request: NextRequest){
  const {email, password} = await request.json()
  if(!email || !password){
    return NextResponse.json(
      {error: "Email and password are required"},
      {status: 400}
    )
  }
  await dbConnect()
  const existingUser = await User.findOne({email: email})
  if(existingUser){
    return NextResponse.json(
      {error: "User already exist"},
      {status: 400}
    )
  }
  const user = await User.create({email, password})
  return NextResponse.json(
    {message: "User registered successfully"},
    {status: 200}
  )
}
