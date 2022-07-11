import React, { useEffect, useState } from "react";

interface countDownProps {
  time: number;
  task: string;
  taskFinished: () => void;
}

function secondsToTime(secs: number) {
  let hours = Math.floor(secs / (60 * 60));

  let divisor_for_minutes = secs % (60 * 60);
  let minutes = Math.floor(divisor_for_minutes / 60);

  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);

  let obj = {
    h: hours,
    m: minutes,
    s: seconds,
  };
  return obj;
}

const Countdown = ({ time, task, taskFinished }: countDownProps) => {
  const [counter, setCounter] = useState(time);

  useEffect(() => {
    console.log("counter: ", counter);
    console.log("Time: ", time);
    if (counter === 0) {
      taskFinished();
    } else {
      setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
    }
  }, [counter]);

  useEffect(() => {
    setCounter(time);
  }, [task]);

  return (
    <div>
      <div>Task: {task}</div>
      <div>H: {secondsToTime(counter).h}</div>
      <div>M: {secondsToTime(counter).m}</div>
      <div>S: {secondsToTime(counter).s}</div>
    </div>
  );
};

export default Countdown;
