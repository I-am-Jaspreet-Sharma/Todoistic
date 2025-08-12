import dbConnect from "@/db/connection/dbConnect"
import User from "@/db/models/User"
import {NextRequest, NextResponse} from "next/server"

export async function POST(req: NextRequest){
  const {email, password} = await req.json()

  if(!email || !password){
    return NextResponse.json(
      {error: "Email and Password are required"},
      {status: 400}
    )
  }

  await dbConnect()
  const existingUser = await User.findOne({email: email})
  if(existingUser){
    return NextResponse.json(
      {error: "User already exists"},
      {status: 400}
    )
  }

  await User.create({email: email, password: password})

  return NextResponse.json(
    {message: "User created successfully"},
    {status: 200}
  )
}
