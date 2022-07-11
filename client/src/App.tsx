import React, { useEffect, useState } from "react";
import "./App.css";
import Countdown from "./Countdown";

interface Task {
  paused: boolean;
  currentTask: { task: string; time: number };
  loading: boolean;
}

function App() {
  const [data, setData] = useState<Task>({
    paused: false,
    currentTask: { task: "", time: 0 },
    loading: true,
  });

  const fetchData = async () => {
    const result = await fetch("/getRoutine");
    const data = await result.json();
    setData({
      paused: data.paused,
      currentTask: data.currentTask,
      loading: false,
    });
  };

  const pauseData = async () => {
    const result = await fetch("/pause");
    const json = await result.json();
    setData({ ...data, paused: json.paused });
  };

  const startData = async () => {
    const result = await fetch("/start");
    const json = await result.json();
    setData({
      paused: json.paused,
      currentTask: json.currentTask,
      loading: false,
    });
  };

  const pause = (): void => {
    setData({
      paused: true,
      currentTask: { ...data.currentTask },
      loading: false,
    });
    pauseData();
  };

  const start = (): void => {
    setData({
      paused: false,
      currentTask: { ...data.currentTask },
      loading: false,
    });
    startData();
  };

  const taskFinished = (): void => {
    console.log("Task finished");
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  // console.log("data: ", data);
  return (
    <div className="App">
      <header className="App-header">
        {data.loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {data.paused && <button onClick={() => start()}>Start</button>}
            {!data.paused && <button onClick={() => pause()}>Pause</button>}
            <h3>{data.currentTask.task}</h3>
            {data.paused ? (
              <p>Paused</p>
            ) : (
              <Countdown
                time={data.currentTask.time}
                task={data.currentTask.task}
                taskFinished={taskFinished}
              />
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
