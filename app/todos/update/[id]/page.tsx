import { cookies } from "next/headers";
import dbConnect from "@/db/connection/dbConnect";
import Session from "@/db/models/Session";
import UpdateTodo from "@/components/UpdateTodo";

export default async function UpdateTodoPage({ params }) {
  const id = params.id; // ✅ dynamic segment [id]
  const cookieStore = cookies();
  const sessionId = cookieStore.get("session-id")?.value;

  let isAuthorized = false;
  let userId;

  if (sessionId) {
    await dbConnect();
    const session = await Session.findById(sessionId);
    isAuthorized = !!session;

    if (isAuthorized) {
      userId = session.userId;
    }
  }

  if (!isAuthorized) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">Unauthorized</h2>
        <p>
          Please{" "}
          <a href="/sign-in" className="underline text-blue-600">
            sign in
          </a>{" "}
          to update your todo.
        </p>
      </div>
    );
  }

  return <UpdateTodo id={id} userId={userId.toString()} />;
}
