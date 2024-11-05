import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

interface Tododata {
  _id: string;
  title: string;
  description: string;
  markedAsCompleted: boolean;
}

interface TodoResponse {
  message: string;
}

export const Todo = () => {
  const [todos, setTodos] = useState<Tododata[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  axios.defaults.baseURL = "http://localhost:3100";

  const fetchTodos = async () => {
    try {
      const response = await axios.get<
        TodoResponse & { usertodos: Tododata[] }
      >("/api/v1/todos/", { withCredentials: true });
      setTodos(response.data.usertodos);
      setMessage("");
    } catch (error) {
      const err = error as AxiosError<TodoResponse>;
      setMessage(err.response?.data?.message || "Error fetching todos");
    }
  };

  const addTodo = async () => {
    const data = { title, description, markedAsCompleted: false };
    try {
      const response = await axios.post<TodoResponse>("/api/v1/todos/", data, {
        withCredentials: true,
      });
      setMessage(response.data.message || "Todo added successfully");
      setTitle("");
      setDescription("");
      fetchTodos();
    } catch (error) {
      const err = error as AxiosError<TodoResponse>;
      setMessage(err.response?.data?.message || "Todo addition failed");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await axios.delete<TodoResponse>(`/api/v1/todos/${id}`, {
        withCredentials: true,
      });
      setMessage(response.data.message || "Todo deleted successfully");
      fetchTodos();
    } catch (error) {
      const err = error as AxiosError<TodoResponse>;
      setMessage(err.response?.data?.message || "Error deleting todo");
    }
  };

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
        {
          withCredentials: true,
        }
      );

      setMessage(response.data.message || "Todo updated successfully");
    } catch (error) {
      const err = error as AxiosError<TodoResponse>;
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, markedAsCompleted: currentStatus } : todo
        )
      );
      setMessage(err.response?.data?.message || "Error updating todo");
    }
  };

  const editTodo = async (id: string) => {
    const updatedTitle = prompt("Enter new title:");
    const updatedDescription = prompt("Enter new description:");

    if (!updatedTitle || !updatedDescription) {
      setMessage("Title and description are required");
      return;
    }

    const data = {
      newTitle: updatedTitle,
      newDescription: updatedDescription,
    };

    try {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id
            ? { ...todo, title: updatedTitle, description: updatedDescription }
            : todo
        )
      );

      const response = await axios.patch<TodoResponse>(
        `/api/v1/todos/${id}`,
        data,
        {
          withCredentials: true,
        }
      );

      setMessage(response.data.message || "Todo updated successfully");
    } catch (error) {
      const err = error as AxiosError<TodoResponse>;
      setMessage(err.response?.data?.message || "Error updating todo");
      fetchTodos();
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <h3>Todo List</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <ul>
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo._id}>
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
              <p>
                Status: {todo.markedAsCompleted ? "Completed" : "Incomplete"}
              </p>
              <button onClick={() => deleteTodo(todo._id)}>Delete</button>
              <button
                onClick={() => toggleTodo(todo._id, todo.markedAsCompleted)}
              >
                {todo.markedAsCompleted
                  ? "Mark as Incomplete"
                  : "Mark as Completed"}
              </button>
              <button onClick={() => editTodo(todo._id)}>Edit Todo</button>
            </li>
          ))
        ) : (
          <li>No todos available</li>
        )}
      </ul>
    </div>
  );
};
