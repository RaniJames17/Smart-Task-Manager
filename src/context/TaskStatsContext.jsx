import React, { createContext, useReducer, useEffect, useCallback } from "react";
import useLocalStorage from "../hooks/UseLocalStorage";

export const TaskContext = createContext();

const initialState = {
  tasks: [],
  filter: "all",
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.task] };
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, completed: !t.completed } : t
        ),
      };
    case "DELETE_TASK":
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };
    case "CLEAR_COMPLETED":
      return { ...state, tasks: state.tasks.filter((t) => !t.completed) };
    case "SET_FILTER":
      return { ...state, filter: action.filter };
    case "SET_TASKS":
      return { ...state, tasks: action.tasks };
    case "REORDER_TASKS":
      return { ...state, tasks: action.tasks };
    case "CLEAR_FILTERED":
      if (action.filter === "completed") {
        return { ...state, tasks: state.tasks.filter((t) => !t.completed) };
      }
      if (action.filter === "active") {
        return { ...state, tasks: state.tasks.filter((t) => t.completed) };
      }
      // If "all", clear all tasks
      return { ...state, tasks: [] };
    default:
      return state;
  }
}

export const TaskProvider = ({ children }) => {
  // Load tasks from localStorage on mount
  const [persistedTasks, setPersistedTasks] = useLocalStorage("tasks", []);
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    tasks: persistedTasks,
  });

  // Sync tasks to localStorage whenever they change
  useEffect(() => {
    setPersistedTasks(state.tasks);
  }, [state.tasks, setPersistedTasks]);

  // Actions
  const addTask = useCallback((text) => {
    dispatch({
      type: "ADD_TASK",
      task: { id: Date.now(), text, completed: false },
    });
  }, []);

  const toggleTask = useCallback((id) => {
    dispatch({ type: "TOGGLE_TASK", id });
  }, []);

  const deleteTask = useCallback((id) => {
    dispatch({ type: "DELETE_TASK", id });
  }, []);

  const clearCompleted = useCallback(() => {
    dispatch({ type: "CLEAR_COMPLETED" });
  }, []);

  const setFilter = useCallback((filter) => {
    dispatch({ type: "SET_FILTER", filter });
  }, []);

  const clearFiltered = useCallback((filter) => {
    dispatch({ type: "CLEAR_FILTERED", filter });
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        filter: state.filter,
        addTask,
        toggleTask,
        deleteTask,
        clearCompleted,
        setFilter,
        clearFiltered,
        dispatch, // <-- Expose dispatch for drag-and-drop
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};