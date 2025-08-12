import { cookies } from "next/headers";
import Logout from "./Logout"
import Link from "next/link"

export default async function Navbar(){
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  const isAuthorized = !!token
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center justify-between h-16">
          {/* Left side links */}
          <div className="flex space-x-6">
            <li>
              <Link
                href="/"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            {isAuthorized && (
              <li>
                <Link
                  href="/todos"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Todos
                </Link>
              </li>
            )}
          </div>

          {/* Right side links */}
          <div className="flex space-x-6 items-center">
            {isAuthorized ? (
              <li>
                <Logout />
              </li>
            ) : (
                <>
                  <li>
                    <Link
                      href="/sign-in"
                      className="hover:text-blue-400 transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sign-up"
                      className="hover:text-blue-400 transition-colors duration-200"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
          </div>
        </ul>
      </div>
    </nav>
  );
}
