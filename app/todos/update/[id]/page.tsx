"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import useSWR, { mutate as globalMutate } from "swr"

const fetcher = (url: string) =>
  fetch(url, { 
    credentials: "include",
  }).then(res => res.json())

export default function UpdateTodoPage(){
  const router = useRouter()
  const params = useParams();
  const id = params.id as string;

  const { data: todo, error, isLoading } = useSWR(`/api/todos/update/${id}`, fetcher)

  const [task, setTask] = useState("")
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    if (todo) {
      setTask(todo.task)
    }
  }, [todo])

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setFormError("")
    const res = await fetch("/api/todos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({_id: id, task: task}),
      credentials: "include"
    })
    const data = await res.json()
    setLoading(false)
    if(!res.ok){
      setFormError(data.error)
      return
    }
    setTask("")
    globalMutate("/api/todos")
    router.push("/todos")
  }

  if (isLoading) return <p className="text-center text-gray-500">Loading todo...</p>
  if (error) return <p className="text-center text-red-500">Failed to load todo</p>

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Todo</h1>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            required
            value={task}
            onChange={(e) => setTask(e.target.value)}
            disabled={loading}
            placeholder="Enter task"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
          />

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Todo"}
          </button>
        </form>
      </div>
    </div>
  )
}
