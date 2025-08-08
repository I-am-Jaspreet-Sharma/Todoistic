import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/connection/dbConnect";
import Session from "@/db/models/Session";
import Todo from "@/db/models/Todo";

export async function POST(request: NextRequest) {
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
    const { _id } = await request.json();

    if (!_id) {
      return NextResponse.json({ error: "Todo ID is required" }, { status: 400 });
    }

    const deleted = await Todo.findOneAndDelete({ _id, userId });

    if (!deleted) {
      return NextResponse.json({ error: "Todo not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo deleted successfully" }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json({ error: "Error in deleting todo" }, err, { status: 500 });
  }
}
