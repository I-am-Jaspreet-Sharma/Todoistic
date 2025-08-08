"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  _id: string;
  isCompleted: boolean;
  task: string;
}

export default function CheckBox({ userId, _id, task, isCompleted }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleToggle() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/todos/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          _id,
          userId,
          task,
          isCompleted: !isCompleted,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed.");
      }

      router.refresh(); // ✅ No page navigation needed
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <input
        type="checkbox"
        defaultChecked={isCompleted}
        className="w-4 h-4"
        disabled={loading}
        onChange={handleToggle}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </>
  );
}
