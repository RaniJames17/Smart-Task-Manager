import React, { useContext, useState } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';
import Timer from './components/Timer';
import { ThemeContext } from './context/ThemeContext';
import { TaskContext } from './context/TaskStatsContext';
import './App.css';
import logo from './assets/logo.png'; 


function App() {
  const { toggleTheme, theme } = useContext(ThemeContext);
  const { filter, setFilter } = useContext(TaskContext);

  // Add sort state
  const [sort, setSort] = useState("newest");

  return (
    <div className="App" style={{ minHeight: "100vh", background: theme.background, color: theme.color }}>
      <header
        style={{
          padding: "1.2rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: theme.dark
            ? "linear-gradient(90deg, #232526 0%, #414345 100%)"
            : "linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)",
          color: theme.color,
          borderBottom: theme.dark ? "2px solid #333" : "2px solid #e0e0e0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          minHeight: 70
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo}
            alt="App Logo"
            style={{
              height: 48,
              marginRight: 20,
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)"
            }}
          />
          <div>
            <h1
              style={{
                fontSize: "2.4rem",
                fontWeight: 900,
                letterSpacing: "1.5px",
                margin: 0,
                color: "#fff",
                textShadow: "0 2px 8px rgba(0,0,0,0.18)"
              }}
            >
              Smart Task Manager
            </h1>
            <div
              style={{
                fontSize: "1.1rem",
                color: "#e0e0e0",
                fontWeight: 400,
                letterSpacing: "0.5px",
                marginTop: 2
              }}
            >
              Dashboard
            </div>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          style={{
            padding: "0.5rem 1.2rem",
            borderRadius: "6px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            cursor: "pointer"
          }}
        >
          Toggle Theme
        </button>
      </header>
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 0" }}>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "flex-start",
            flexWrap: "wrap"
          }}
        >
          {/* Left: Task List */}
          <div style={{ flex: 2, minWidth: 340 }}>
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "1.5rem"
            }}>
              <button
                onClick={() => setFilter("all")}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  fontWeight: 500,
                  background: filter === "all" ? "#007bff" : "#eee",
                  color: filter === "all" ? "#fff" : "#222",
                  border: "none"
                }}
              >
                All
              </button>
              <button
                onClick={() => setFilter("active")}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  fontWeight: 500,
                  background: filter === "active" ? "#007bff" : "#eee",
                  color: filter === "active" ? "#fff" : "#222",
                  border: "none"
                }}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("completed")}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  fontWeight: 500,
                  background: filter === "completed" ? "#007bff" : "#eee",
                  color: filter === "completed" ? "#fff" : "#222",
                  border: "none"
                }}
              >
                Completed
              </button>
              {/* Sort Dropdown */}
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontWeight: 500,
                  background: "#fff",
                  color: "#222"
                }}
                aria-label="Sort tasks"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
            </div>
            <TaskInput />
            <div style={{
  maxHeight: 400,
  overflowY: "auto",
  paddingRight: 8,
  scrollbarWidth: "thin" // For Firefox
}}>
  <TaskList sort={sort} />
</div>
          </div>
          {/* Right: Timer and Stats */}
          <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
           
            <Timer />
            <TaskStats />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
