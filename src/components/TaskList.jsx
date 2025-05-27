import React, { useContext, useMemo, useCallback, useLayoutEffect, useRef } from "react";
import { TaskContext } from "../context/TaskStatsContext";
import { ThemeContext } from "../context/ThemeContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const TaskList = ({ sort }) => {
  const { tasks, toggleTask, deleteTask, filter, dispatch } = useContext(TaskContext);
  const { theme } = useContext(ThemeContext);
  const endOfListRef = useRef(null);

  // Memoize filtered tasks
  const filteredTasks = useMemo(() => {
    if (filter === "completed") return tasks.filter((t) => t.completed);
    if (filter === "active") return tasks.filter((t) => !t.completed);
    return tasks;
  }, [tasks, filter]);

  // Sort tasks before rendering
  const sortedTasks = useMemo(() => {
    let tasksToSort = [...filteredTasks];
    if (sort === "newest") tasksToSort.sort((a, b) => b.id - a.id);
    if (sort === "oldest") tasksToSort.sort((a, b) => a.id - b.id);
    if (sort === "az") tasksToSort.sort((a, b) => a.text.localeCompare(b.text));
    if (sort === "za") tasksToSort.sort((a, b) => b.text.localeCompare(a.text));
    return tasksToSort;
  }, [filteredTasks, sort]);

  // Scroll to latest task when list changes
  useLayoutEffect(() => {
    if (endOfListRef.current) {
      endOfListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sortedTasks.length]);

  // Drag end handler
  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (filter !== "all") return;
    const reordered = Array.from(tasks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    dispatch({ type: "REORDER_TASKS", tasks: reordered });
  };

  const handleToggle = useCallback(
    (id) => toggleTask(id),
    [toggleTask]
  );

  const handleDelete = useCallback(
    (id) => deleteTask(id),
    [deleteTask]
  );

  return (
    <div
      style={{
        background: "#fff",
        color: theme.color || "#222",
        borderRadius: "18px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        padding: "2rem 2rem 1.5rem 2rem",
        marginTop: "2rem",
        transition: "background 0.3s, color 0.3s",
        maxWidth: 700,
        marginLeft: "auto",
        marginRight: "auto"
      }}
    >
      {/* Dashboard Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "1.5rem",
        borderBottom: "1px solid #eee",
        paddingBottom: "0.75rem"
      }}>
        <span style={{
          fontSize: "2rem",
          marginRight: "0.75rem"
        }}>📋</span>
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          margin: 0,
          flex: 1,
          color: "#222"
        }}>
          Tasks <span style={{
            fontSize: "1rem",
            color: "#888",
            fontWeight: 400
          }}>({sortedTasks.length})</span>
        </h2>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              style={{
                maxHeight: "340px",
                overflowY: "auto",
                padding: 0,
                margin: 0,
                listStyle: "none"
              }}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {sortedTasks.length === 0 && (
                <li style={{
                  textAlign: "center",
                  color: "#aaa",
                  padding: "2rem 0",
                  fontSize: "1.1rem"
                }}>
                  <span role="img" aria-label="empty">🗒️</span> No tasks to show.
                </li>
              )}
              {sortedTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: snapshot.isDragging ? "#e6f0ff" : "#f9f9f9",
                        borderRadius: "10px",
                        padding: "0.85rem 1.1rem",
                        marginBottom: "0.85rem",
                        boxShadow: snapshot.isDragging
                          ? "0 0 0 2px #007bff"
                          : "0 1px 4px rgba(0,0,0,0.04)",
                        transform: snapshot.isDragging ? "scale(1.03)" : "none",
                        transition: "background 0.2s, box-shadow 0.2s, transform 0.2s",
                        ...provided.draggableProps.style
                      }}
                    >
                      {/* Drag handle */}
                      <span
                        {...provided.dragHandleProps}
                        style={{
                          marginRight: "1rem",
                          cursor: "grab",
                          fontSize: "1.3rem",
                          color: "#bbb",
                          userSelect: "none"
                        }}
                        title="Drag to reorder"
                      >
                        <span role="img" aria-label="Drag handle">🟰</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggle(task.id)}
                        style={{
                          marginRight: "1rem",
                          width: "1.2rem",
                          height: "1.2rem",
                          accentColor: "#007bff"
                        }}
                        aria-label={task.completed ? "Mark as active" : "Mark as completed"}
                      />
                      <span
                        style={{
                          flex: 1,
                          fontSize: "1.13rem",
                          textDecoration: task.completed ? "line-through" : "none",
                          color: task.completed ? "#aaa" : "#222",
                          opacity: task.completed ? 0.7 : 1,
                          transition: "color 0.2s, opacity 0.2s"
                        }}
                      >
                        {task.text}
                      </span>
                      <button
                        onClick={() => handleDelete(task.id)}
                        style={{
                          marginLeft: "1rem",
                          padding: "0.4rem 0.8rem",
                          background: "#ff4d4f",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "1.1rem",
                          display: "flex",
                          alignItems: "center",
                          transition: "background 0.2s"
                        }}
                        title="Delete"
                        aria-label="Delete"
                      >
                        <span role="img" aria-label="Delete">🗑️</span>
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              <div ref={endOfListRef} />
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskList;