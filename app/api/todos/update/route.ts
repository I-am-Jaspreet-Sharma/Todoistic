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
    const { _id, task, isCompleted = false } = await request.json();

    if (!task || task.trim() === "") {
      return NextResponse.json(
        { error: "Cannot update to an empty todo" },
        { status: 400 }
      );
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id, userId },
      { task, isCompleted },
      { new: true }
    );

    if (!updatedTodo) {
      return NextResponse.json({ error: "Todo not found or not yours" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Todo updated successfully", todo: updatedTodo },
      { status: 200 }
    );
  } catch () {
    return NextResponse.json(
      { error: "Error in updating todo" },
      { status: 500 }
    );
  }
}
