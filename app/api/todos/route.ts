import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/db/connection/dbConnect";
import Todo from "@/db/models/Todo";

export async function POST(req: NextRequest) {
  // Get userId from secure, server-side header set by middleware
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    // If middleware didn't attach userId, the request is unauthorized
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { task, isCompleted = false } = await req.json()

  if (!task || task.trim().length === 0) {
    return NextResponse.json(
      { error: "Task cannot be empty" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const newTodo = await Todo.create({ userId, task, isCompleted });

    return NextResponse.json(
      { message: "Todo created successfully", todo: newTodo },
      { status: 201 } // Use 201 Created for a new resource
    );
  } catch (error) {
    console.error("Failed to create todo:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest){
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    // If middleware didn't attach userId, the request is unauthorized
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect()
  const todos = await Todo.find({ userId })
    .select('_id task isCompleted')
    .lean();
  return NextResponse.json(
    todos,
    {status: 200}
  )
}

export async function PUT(req: NextRequest){
  // Get userId from secure, server-side header set by middleware
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    // If middleware didn't attach userId, the request is unauthorized
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const {_id, task, isCompleted = false} = await req.json()

  if (!task || task.trim().length === 0) {
    return NextResponse.json(
      { error: "Task cannot be empty" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const updatedTodo = await Todo.findOneAndUpdate({_id: _id, userId: userId},{ task, isCompleted },{new: true}).select('_id task isCompleted').lean()

    if (!updatedTodo) {
      return NextResponse.json(
        { error: "Todo not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Todo updated successfully", todo: updatedTodo },
      { status: 200 } 
    );
  } catch (error) {
    console.error("Failed to update todo:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest){
  // Get userId from secure, server-side header set by middleware
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    // If middleware didn't attach userId, the request is unauthorized
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  const {_id} = await req.json()

  try {
    await dbConnect();
    const deletedTodo = await Todo.findOneAndDelete({_id: _id, userId: userId}).select('_id task isCompleted').lean()

    return NextResponse.json(
      { message: "Todo deleted successfully", todo: deletedTodo },
      { status: 200 } 
    );
  } catch (error) {
    console.error("Failed to delete todo:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
