import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/connection/dbConnect";
import Session from "@/db/models/Session";
import Todo from "@/db/models/Todo";

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get("session-id")?.value;

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const session = await Session.findById(sessionId);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.userId;

  try {
    const todos = await Todo.find({ userId });

    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error in reading todos" }, { status: 500 });
  }
}
