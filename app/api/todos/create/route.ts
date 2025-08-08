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
    const { task, isCompleted = false } = await request.json();

    if (!task || task.trim() === "") {
      return NextResponse.json(
        { error: "Cannot create an empty todo" },
        { status: 400 }
      );
    }

    await Todo.create({ userId, task, isCompleted });

    return NextResponse.json(
      { message: "Todo created successfully" },
      { status: 200 }
    );
  } catch () {
    return NextResponse.json(
      { error: "Error in creating todo" },
      { status: 500 }
    );
  }
}
