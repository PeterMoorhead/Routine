import React, { useEffect, useState } from "react";

interface countDownProps {
  time: number;
  task: string;
  pause: (counter: number) => void;
  start: () => void;
  paused: boolean;
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

const Countdown = ({ time, task, paused, pause, start }: countDownProps) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCounter(counter - 1);
    }, 1000);
  }, [paused]);

  useEffect(() => {
    if (paused) {
      setCounter(counter);
      return;
    }
    if (counter === 0) {
      console.log("paused2: ", paused);
      setCounter(time);
    }
    setTimeout(() => {
      console.log("paused3: ", paused);
      setCounter(counter - 1);
    }, 1000);
  }, [counter]);

  return (
    <div>
      {paused && <button onClick={() => start()}>Start</button>}
      {!paused && <button onClick={() => pause(counter)}>Pause</button>}
      <div>Task: {task}</div>
      <div>H: {secondsToTime(counter).h}</div>
      <div>M: {secondsToTime(counter).m}</div>
      <div>S: {secondsToTime(counter).s}</div>
    </div>
  );
};

export default Countdown;
