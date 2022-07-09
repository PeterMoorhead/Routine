import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Countdown from "./Countdown";

interface Task {
  paused: boolean;
  currentTask: { task: string; time: number };
}

function App() {
  const [data, setData] = useState<Task>({
    paused: false,
    currentTask: { task: "", time: 0 },
  });

  useEffect(() => {
    fetch("/getRoutine")
      .then((res) => res.json())
      .then((datad) => setData(datad));
  }, []);

  console.log("data: ", data);
  return (
    <div className="App">
      <header className="App-header">
        <h3>{data.currentTask.task}</h3>
        <Countdown
          time={data.currentTask.time}
          task={
            data.currentTask.task
          } /*handleChange={this.handleFinishedTask} pause={this.pauseCurrentTask} start={this.startCurrentTask} paused={this.state.paused}*/
        />
      </header>
    </div>
  );
}

export default App;
