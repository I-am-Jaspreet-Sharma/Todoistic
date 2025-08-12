"use client"
import useSWR from "swr"
import Link from "next/link"
import {useState} from "react"
import {ITodo} from "@/db/models/Todo"

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then(res => res.json())

export default function TodosPage(){
  const { data: todos, mutate, error } = useSWR("/api/todos", fetcher)
  const [task, setTask] = useState("")
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("")
    setLoading(true)
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({task: task}),
      credentials: "include"
    })
    const data = await res.json()
    setLoading(false)
    if(!res.ok){
      setFormError(data.error)
      return;
    }
    setTask("")
    mutate() // re-fetch todos instantly
  }

  const handleToggle = async (todo: ITodo) => {
    const res = await fetch("/api/todos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({_id: todo._id!.toString(), task: todo.task, isCompleted: !todo.isCompleted}),
      credentials: "include"
    })
    if (!res.ok) {
      const data = await res.json();
      alert(`Toggle failed: ${data?.error || res.statusText}`);
      return;
    }
    mutate()
  }

  const handleDelete = async (todo: ITodo) => {
    const res = await fetch("/api/todos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({_id: todo._id!.toString()}),
      credentials: "include"
    })
    if (!res.ok) {
      const data = await res.json();
      alert(`Task deletion failed: ${data?.error || res.statusText}`);
      return;
    }
    mutate()
  }

  if (error) return <p className="text-red-500 text-center">Failed to load todos</p>
  if (!todos) return <p className="text-gray-500 text-center">Loading...</p>

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Todo List</h1>

      {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          required
          value={task}
          disabled={loading}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <ul className="space-y-3">
        {todos.map((todo: ITodo) => (
          <li
            key={todo._id!.toString()}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => handleToggle(todo)}
                className="h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
              />
              <span className={`${todo.isCompleted ? "line-through text-gray-400" : "text-gray-800"}`}>
                {todo.task}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/todos/update/${todo._id!.toString()}`}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Update
              </Link>
              <button
                onClick={() => handleDelete(todo)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
