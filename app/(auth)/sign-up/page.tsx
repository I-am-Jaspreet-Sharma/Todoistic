"use client"
import {useRouter} from "next/navigation"
import {useState} from "react"
export default function SignUpPage(){
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email: email.trim(), password: password})
    })
    const data = await res.json();
    setLoading(false)
    if (!res.ok) {
      setError(data.error || "Failed to register");
      return;
    }
    setEmail("")
    setPassword("")
    router.push("/sign-in")
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Create an Account
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <input
          type="email"
          autoComplete="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
        />

        <input
          type="password"
          autoComplete="current-password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-400 transition-colors"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <a href="/sign-in" className="text-indigo-500 hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
