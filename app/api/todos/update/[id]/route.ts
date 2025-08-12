import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/db/connection/dbConnect";
import Todo from "@/db/models/Todo";
interface Context {
  params: {
    id: string;
  };
}
export async function GET(req: NextRequest, context: unknown) {
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    // If middleware didn't attach userId, the request is unauthorized
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = (context as Context).params;
  try {
    await dbConnect()
    const todo = await Todo.findOne({_id: id, userId: userId})
    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 })
    }
    return NextResponse.json(
      todo,
      {status: 200}
    )
  } catch (error) {
    console.error("Error fetching todo:", error);
    return NextResponse.json({ error: "Internal Server error" }, { status: 500 })
  }
}
