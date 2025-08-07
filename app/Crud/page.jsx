"use client";
import { useState, useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null); // Task being edited
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const { data } = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
        }),
      });
      const { success, data } = await res.json();
      if (success) {
        setTasks([...tasks, data]);
        setNewTaskTitle("");
        setNewTaskDescription("");
      } else {
        console.error("Failed to add task:", data);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      const { success } = await res.json();
      if (success) {
        setTasks(tasks.filter((task) => task._id !== id));
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const handleUpdateTask = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });
      const { success, data } = await res.json();
      if (success) {
        setTasks(tasks.map((task) => (task._id === id ? data : task)));
        setEditingTask(null); // Exit edit mode
        setEditTitle("");
        setEditDescription("");
      } else {
        console.error("Failed to update task:", data);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !task.completed }),
      });
      const { success, data } = await res.json();
      if (success) {
        setTasks(tasks.map((t) => (t._id === task._id ? data : t)));
      } else {
        console.error("Failed to toggle complete status:", data);
      }
    } catch (error) {
      console.error("Error toggling complete status:", error);
    }
  };

  return (
    <div className="font-sans max-w-6xl mx-auto my-5 p-5 border border-gray-300 rounded-lg shadow-md">
      <Head>
        <title>Next.js Fullstack Task Manager</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">
        Task Manager
      </h1>

      <form
        onSubmit={handleAddTask}
        className="flex flex-col gap-3 mb-8 p-4 border border-gray-200 rounded-md shadow-sm"
      >
        <input
          type="text"
          placeholder="Task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Task description (optional)"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          rows="3"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Add Task
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length === 0 ? (
          <p className="col-span-full text-center text-gray-600 text-lg">
            No tasks found. Add one above!
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className={`border border-gray-200 w-[40rem] p-4 rounded-lg shadow-sm flex flex-col justify-between ${
                task.completed ? "bg-green-50" : "bg-white"
              }`}
            >
              {editingTask === task._id ? (
                <div className="flex flex-col bg gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows="2"
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                  ></textarea>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateTask(task._id)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTask(null)}
                      className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                <div className="">
                  <h3
                    className={`text-xl font-semibold text-gray-700 mb-2 ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p
                      className={`text-sm text-gray-600 mb-4 ${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className={`flex-1 px-3 py-2 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 transition-colors duration-200
                        ${
                          task.completed
                            ? "bg-red-500 hover:bg-red-600 focus:ring-red-400"
                            : "bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500"
                        }
                      `}
                    >
                      {task.completed ? "Mark Incomplete" : "Mark Complete"}
                    </button>
                    <button
                      onClick={() => handleEditClick(task)}
                      className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
