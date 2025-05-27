import React, { useState, useRef, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { TaskContext } from "../context/TaskStatsContext";

const TaskInput = () => {
  const [task, setTask] = useState("");
  const inputRef = useRef(null);
  const { theme } = useContext(ThemeContext) || {};
  const { addTask } = useContext(TaskContext) || {};

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim() && typeof addTask === "function") {
      addTask(task.trim());
      setTask("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: theme?.background || "#fff",
        color: theme?.color || "#222",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a new task..."
        style={{
          padding: "0.5rem",
          flex: 1,
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          background: "#007bff",
          color: "#fff",
          border: "none",
        }}
      >
        Add
      </button>
    </form>
  );
};

export default TaskInput;