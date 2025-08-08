import { cookies } from "next/headers";
import dbConnect from "@/db/connection/dbConnect";
import Session from "@/db/models/Session";
import Todo from "@/db/models/Todo";
import CreateTodo from "@/components/CreateTodo"
import DeleteTodo from "@/components/DeleteTodo"
import CheckBox from "@/components/CheckBox"
import Link from "next/link"

export default async function TodosPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session-id")?.value;
  let isAuthorized = false;
  let todos = [];
  let userId

  if (sessionId) {
    await dbConnect();
    const session = await Session.findById(sessionId);
    isAuthorized = !!session;

    if (isAuthorized) {
      todos = await Todo.find({ userId: session.userId }).lean();
      userId = session.userId
    }
  }

  if (!isAuthorized) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">Unauthorized</h2>
        <p>Please <a href="/sign-in" className="underline text-blue-600">sign in</a> to access your todos.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <CreateTodo/>

      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo._id.toString()}
            className="flex justify-between items-center border px-3 py-2 rounded"
          >
            <div className="flex items-center gap-2">
              <CheckBox _id={todo._id.toString()} userId={todo.userId.toString()} task={todo.task} isCompleted={todo.isCompleted}/>
              <span
                className={todo.isCompleted ? "line-through text-gray-500" : ""}
              >
                {todo.task}
              </span>
            </div>

            <div className="flex gap-2">
              <Link href={`/todos/update/${todo._id.toString()}`}>
                Update
              </Link>
              <DeleteTodo
                userId={userId.toString()}
                id={todo._id.toString()}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
