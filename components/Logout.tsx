"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function Logout() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // ✅ Required to send cookies (session-id)
      });

      if (!res.ok) {
        throw new Error("Failed to log out");
      }

      startTransition(() => {
        router.push("/");
        router.refresh()
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className={`px-4 py-2 rounded-md text-white font-medium transition duration-200 ${
        isPending
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700"
      }`}
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
