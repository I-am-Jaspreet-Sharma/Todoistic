"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  id: string;
}

export default function UpdateTodo({ userId, id }: Props) {
  const [task, setTask] = useState("");
  const router = useRouter();

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (!task.trim()) {
      alert("Task cannot be empty.");
      return;
    }

    try {
      const res = await fetch("/api/todos/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Ensures session is passed
        body: JSON.stringify({ _id: id, userId, task }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed.");
      }

      router.push("/todos");
      router.refresh();
    } catch (err) {
      alert("Error updating todo: " + err.message);
    }
  }

  return (
    <form onSubmit={handleUpdate} className="flex gap-2">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="px-2 py-1 border rounded"
      />
      <button
        type="submit"
        className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500"
      >
        Update
      </button>
    </form>
  );
}
