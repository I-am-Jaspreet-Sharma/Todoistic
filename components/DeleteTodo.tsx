"use client";

interface Props {
  userId: string;
  id: string;
}

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export default function DeleteTodo({ userId, id }: Props) {
  async function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this todo?");
    if (!confirmed) return;

    try {
      const res = await fetch("/api/todos/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Important for session
        body: JSON.stringify({ _id: id, userId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete todo.");
      }

      window.location.reload(); // 🔄 Refresh page to reflect deletion
    } catch (err) {
      alert("Error updating todo: " + getErrorMessage(err));
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Delete
    </button>
  );
}
