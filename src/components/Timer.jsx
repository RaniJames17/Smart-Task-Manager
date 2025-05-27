import React, { useContext } from "react";
import usePomodoroTimer from "../hooks/UsePomodoroTimer";
import { ThemeContext } from "../context/ThemeContext";

const WORK_DURATION = 1500; // 25 min
const BREAK_DURATION = 300; // 5 min

const Timer = () => {
  const { seconds, running, mode, start, stop, reset } = usePomodoroTimer(WORK_DURATION, BREAK_DURATION);
  const { theme } = useContext(ThemeContext);

  // Total duration for current mode
  const total = mode === "work" ? WORK_DURATION : BREAK_DURATION;
  const progress = seconds / total;
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - progress * circumference;

  // Format seconds as mm:ss
  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div style={{
      background: theme.background,
      color: theme.color,
      padding: "2rem 1rem",
      borderRadius: "16px",
      marginTop: "1rem",
      textAlign: "center",
      boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
      minWidth: 260
    }}>
      <div style={{ marginBottom: "1rem" }}>
        <svg width={radius * 2} height={radius * 2}>
          <circle
            stroke="#eee"
            fill="none"
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            strokeWidth={stroke}
          />
          <circle
            stroke={mode === "work" ? "#007bff" : "#28a745"}
            fill="none"
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
          <text
            x="50%"
            y="54%"
            textAnchor="middle"
            dy=".3em"
            fontSize="1.6rem"
            fill={theme.color}
            fontWeight="bold"
          >
            {formatTime(seconds)}
          </text>
        </svg>
      </div>
      <h3 style={{ margin: "0.5rem 0" }}>
        <span role="img" aria-label="Timer" style={{ fontSize: "1.5rem" }}>⏰</span> Timer
      </h3>
      <div style={{ marginBottom: "1rem" }}>
        Mode: <b>{mode === "work" ? "Work" : "Break"}</b>
      </div>
      <button onClick={start} disabled={running} style={{ margin: "0 0.5rem" }}>Start</button>
      <button onClick={stop} disabled={!running} style={{ margin: "0 0.5rem" }}>Stop</button>
      <button onClick={reset} style={{ margin: "0 0.5rem" }}>Reset</button>
    </div>
  );
};

export default Timer;