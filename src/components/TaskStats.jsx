import React, { useContext, useMemo, useCallback } from "react";
import { TaskContext } from "../context/TaskStatsContext";
import { ThemeContext } from "../context/ThemeContext";

const TaskStats = () => {
  const { tasks, filter, clearFiltered } = useContext(TaskContext);
  const { theme } = useContext(ThemeContext);

  // Memoize stats
  const { total, completed, active } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [tasks]);

  // Memoize button label
  const getButtonLabel = useCallback(() => {
    if (filter === "completed") return "Clear Completed Tasks";
    if (filter === "active") return "Clear Active Tasks";
    return "Clear All Tasks";
  }, [filter]);

  return (
    <div
      style={{
        background: theme.background,
        color: theme.color,
        padding: "1rem",
        borderRadius: "8px",
        marginTop: "1rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          fontSize: "1.3rem",
          fontWeight: 700,
          letterSpacing: "0.5px",
          marginBottom: "0.8rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span role="img" aria-label="Stats" style={{ fontSize: "1.4rem" }}>
          📊
        </span>
        Task Stats
      </div>
      <div>Total Tasks: {total}</div>
      <div>Completed: {completed}</div>
      <div>Active: {active}</div>
      <button
        onClick={() => clearFiltered(filter)}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1.2rem",
          borderRadius: "6px",
          background: "#ff4d4f",
          color: "#fff",
          border: "none",
          fontWeight: 600,
          fontSize: "1rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span
          role="img"
          aria-label="Delete"
          style={{ fontSize: "1.2rem" }}
        >
          🗑️
        </span>
        {getButtonLabel()}
      </button>
    </div>
  );
};

export default TaskStats;