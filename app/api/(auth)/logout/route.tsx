import dbConnect from "@/db/connection/dbConnect";
import Session from "@/db/models/Session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get("session-id")?.value;

  if (!sessionId) {
    return NextResponse.json(
      { error: "No session ID found" },
      { status: 400 }
    );
  }

  await dbConnect();
  await Session.deleteOne({ _id: sessionId });

  const response = NextResponse.json(
    { message: "User logged out successfully" },
    { status: 200 }
  );

  // Clear the cookie by setting it to empty + expired
  response.cookies.set("session-id", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0) // expired in the past
  });

  return response;
}
