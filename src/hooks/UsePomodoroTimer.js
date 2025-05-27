import { useReducer, useRef, useEffect, useCallback } from "react";

const initialState = {
  seconds: 0,
  running: false,
  mode: "work", // "work" or "break"
};

function reducer(state, action) {
  switch (action.type) {
    case "START":
      return { ...state, running: true };
    case "STOP":
      return { ...state, running: false };
    case "RESET":
      return { ...initialState };
    case "TICK":
      return { ...state, seconds: state.seconds + 1 };
    case "SWITCH_MODE":
      return { ...state, mode: state.mode === "work" ? "break" : "work", seconds: 0 };
    default:
      return state;
  }
}

export default function usePomodoroTimer(workDuration = 1500, breakDuration = 300) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const intervalRef = useRef(null);

  const start = useCallback(() => dispatch({ type: "START" }), []);
  const stop = useCallback(() => dispatch({ type: "STOP" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const switchMode = useCallback(() => dispatch({ type: "SWITCH_MODE" }), []);

  useEffect(() => {
    if (state.running) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [state.running]);

  useEffect(() => {
    if (state.mode === "work" && state.seconds >= workDuration) {
      switchMode();
    }
    if (state.mode === "break" && state.seconds >= breakDuration) {
      switchMode();
    }
  }, [state.seconds, state.mode, workDuration, breakDuration, switchMode]);

  return {
    seconds: state.seconds,
    running: state.running,
    mode: state.mode,
    start,
    stop,
    reset,
  };
}