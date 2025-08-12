"use client"
import {useRouter} from "next/navigation"

export default function Logout(){
  const router = useRouter()
  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    })
    if (!res.ok) {
      const data = await res.json();
      alert(`Logout failed: ${data?.error || res.statusText}`);
      return;
    }

    router.refresh();
  }
  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md text-white font-medium transition-colors duration-200"
    >
      Log Out
    </button>
  );
}
