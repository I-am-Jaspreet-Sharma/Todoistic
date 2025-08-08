"use client";

import { useState } from "react";

export default function CreateTodo() {
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/todos/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔐 Include cookies/session
        body: JSON.stringify({ task }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Failed to create todo.");
      }

      setTask("");
      // Refresh the page to see the new todo
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
      <input
        type="text"
        name="task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a todo task"
        className="flex-grow px-3 py-2 border rounded"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add"}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </form>
  );
}
