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

  const pause = (counter: number): void => {
    console.log("I am paused at : ", counter);
    setData({
      paused: true,
      currentTask: { ...data.currentTask },
      loading: false,
    });
  };

  const start = (): void => {
    setData({
      paused: false,
      currentTask: { ...data.currentTask },
      loading: false,
    });
    console.log("Started");
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("/getRoutine");
      const data = await result.json();
      setData({
        paused: data.paused,
        currentTask: data.currentTask,
        loading: false,
      });
    };
    fetchData();
  }, []);

  console.log("data: ", data);
  return (
    <div className="App">
      <header className="App-header">
        {data.loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h3>{data.currentTask.task}</h3>
            <Countdown
              time={data.currentTask.time}
              task={data.currentTask.task}
              pause={pause}
              start={start}
              paused={data.paused}
            />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
