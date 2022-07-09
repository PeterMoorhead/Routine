import React, { useEffect, useState } from "react";

// interface TimeState {
//   time: { h: number; m: number; s: number };
//   seconds: number;
// }

interface countDownProps {
  time: number;
  task: string;
}

function secondsToTime(secs: number) {
  console.log("secondsToTime: ", secs);
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

const Countdown = ({ time, task }: countDownProps) => {
  console.log("f time: ", time);
  const [counter, setCounter] = useState(time);
  console.log("counter1: ", counter);
  useEffect(() => {
    if (counter === 0) {
      setCounter(time);
    }
    setTimeout(() => {
      setCounter(counter - 1);
    }, 1000);
  }, [counter]);
  console.log("counter2: ", counter);
  console.log("task: ", task);
  console.log("time: ", time);
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
