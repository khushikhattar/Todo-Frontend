import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

// Todo Data and Response Interfaces
interface Tododata {
  _id: string;
  title: string;
  description: string;
  markedAsCompleted: boolean;
}

interface TodoResponse {
  message: string;
}

// Main Todo Component
export const Todo = () => {
  const [todos, setTodos] = useState<Tododata[]>([]);
  const [message, setMessage] = useState<string>("");
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [Title, setTitle] = useState<string>("");
  const [Description, setDescription] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");

  axios.defaults.baseURL = "http://localhost:3100";

  // Fetch Todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get<{
        message: string;
        usertodos: Tododata[];
      }>("/api/v1/todos/", { withCredentials: true });
      setTodos(response.data.usertodos);
      setMessage(""); // Clear message after fetching todos
    } catch (error) {
      const err = error as AxiosError<TodoResponse>;
      setMessage(err.response?.data?.message || "Error fetching todos");
    }
  };

  // Add Todo
  const addTodo = async () => {
    const data = {
      title: Title,
      description: Description,
      markedAsCompleted: false,
    };
    try {
      const response = await axios.post<TodoResponse>("/api/v1/todos/", data, {
        withCredentials: true,
      });
      setMessage(response.data.message || "Todo added successfully");
      fetchTodos();
      setTitle("");
      setDescription("");
    } catch (error) {
      const err = error as AxiosError<TodoResponse>;
      setMessage(err.response?.data?.message || "Error adding todo");
    }
  };

  // Delete Todo
  const deleteTodo = (id: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this todo?"
    );
    if (isConfirmed) {
      axios
        .delete<TodoResponse>(`/api/v1/todos/${id}`, { withCredentials: true })
        .then((response) => {
          setMessage(response.data.message || "Todo deleted successfully");
          fetchTodos();
        })
        .catch((error) => {
          const err = error as AxiosError<TodoResponse>;
          setMessage(err.response?.data?.message || "Error deleting todo");
        });
    }
  };

  // Toggle Todo Status
  const toggleTodo = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const data = { markedAsCompleted: newStatus };
    try {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, markedAsCompleted: newStatus } : todo
        )
      );
      const response = await axios.patch<TodoResponse>(
        `/api/v1/todos/${id}`,
        data,
        { withCredentials: true }
      );
      setMessage(response.data.message || "Todo status updated successfully");
    } catch (error) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, markedAsCompleted: currentStatus } : todo
        )
      );
      const err = error as AxiosError<TodoResponse>;
      setMessage(err.response?.data?.message || "Error updating todo status");
    }
  };

  const showAlert = () => {
    if (message) {
      alert(message);
    }
  };
  // Edit Todo
  const editTodo = async (id: string) => {
    if (!newTitle && !newDescription) {
      setMessage("At least one field should be updated");
      return;
    }

    const data = {
      title: newTitle || undefined,
      description: newDescription || undefined,
    };

    try {
      const response = await axios.patch<TodoResponse>(
        `/api/v1/todos/${id}`,
        data,
        { withCredentials: true }
      );

      setMessage(response.data.message || "Todo updated successfully");
      showAlert();
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id
            ? {
                ...todo,
                title: newTitle || todo.title,
                description: newDescription || todo.description,
              }
            : todo
        )
      );

      setEditingTodo(null);
      setNewTitle("");
      setNewDescription("");
    } catch (error) {
      const err = error as AxiosError<TodoResponse>;
      setMessage(err.response?.data?.message || "Error updating todo");
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <h3>Todos</h3>
      {editingTodo === null && (
        <div>
          <input
            value={Title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Title"
          />
          <input
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            placeholder="Description"
          />
          <button onClick={addTodo}>Add Todo</button>
        </div>
      )}
      <ul>
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo._id}>
              {editingTodo === todo._id ? (
                <>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    type="text"
                    placeholder="Title"
                  />
                  <input
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    type="text"
                    placeholder="Description"
                  />
                  <button onClick={() => editTodo(todo._id)}>Save</button>
                  <button onClick={() => setEditingTodo(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <h3>{todo.title}</h3>
                  <p>{todo.description}</p>
                  <p>
                    Status:{" "}
                    {todo.markedAsCompleted ? "Completed" : "Incomplete"}
                  </p>
                  <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                  <button
                    onClick={() => toggleTodo(todo._id, todo.markedAsCompleted)}
                  >
                    {todo.markedAsCompleted
                      ? "Mark as Incomplete"
                      : "Mark as Completed"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingTodo(todo._id);
                      setNewTitle(todo.title);
                      setNewDescription(todo.description);
                    }}
                  >
                    Edit Todo
                  </button>
                </>
              )}
            </li>
          ))
        ) : (
          <li>No todos available</li>
        )}
      </ul>
    </div>
  );
};
