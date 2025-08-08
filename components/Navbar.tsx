import dbConnect from "@/db/connection/dbConnect";
import Session from "@/db/models/Session";
import Link from "next/link";
import { cookies } from "next/headers";
import Logout from "./Logout"; // Make sure this is a client component or server action

export default async function Navbar() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session-id")?.value;

  let isAuthorized = false;

  if (sessionId) {
    await dbConnect();
    const session = await Session.findById(sessionId);
    isAuthorized = !!session;
  }

  return (
    <nav className="flex gap-4 p-4 shadow bg-white">
      <Link href="/">Home</Link>
      <Link href="/todos">Todos</Link>
      {isAuthorized ? (
        <Logout />
      ) : (
        <>
          <Link href="/sign-in">Sign In</Link>
          <Link href="/sign-up">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
