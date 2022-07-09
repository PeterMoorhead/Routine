const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

appBegan = false;
paused = false;
bedTime = "07/09/2022 22:45:00";
totalTimeLeft = totalTimeTillFinish(bedTime);
initTasks = [];
currentTask = 0;
baseTasks = [
  { task: "programming", percentage: 0.2 },
  { task: "russian", percentage: 0.2 },
  { task: "self help", percentage: 0.2 },
  { task: "finance", percentage: 0.2 },
  { task: "exercise", percentage: 0.2 },
];

function getStatus() {
  task = newBrowser();
  console.log("getStatus: ", task);
  return { paused: paused, currentTask: task };
}

function totalTimeTillFinish(endtime) {
  endTimeTime = Date.parse(endtime);
  newTime = Date.parse(new Date());
  const total = (endTimeTime - newTime) / 1000;
  return Math.floor(total);
}

function splitTaskTime() {
  timeLeft = totalTimeTillFinish(bedTime);

  loopy = 0;
  baseTasks.forEach((task, index) => {
    if (index === 0) {
      taskStartTime = task.percentage * timeLeft;
      loopy = Math.floor(loopy + taskStartTime);
      initTasks.push({
        task: task.task,
        endTime: 0,
        startTime: Math.floor(taskStartTime) - 1,
      });
    } else if (index === baseTasks.length - 1) {
      taskStartTime = task.percentage * timeLeft;
      initTasks.push({
        task: task.task,
        endTime: loopy,
        startTime: Math.floor(taskStartTime + loopy) + 5,
      });

      loopy = Math.floor(loopy + taskStartTime);
    } else {
      taskStartTime = task.percentage * timeLeft;
      initTasks.push({
        task: task.task,
        endTime: loopy,
        startTime: Math.floor(taskStartTime + loopy) - 1,
      });

      loopy = Math.floor(loopy + taskStartTime);
    }
  });
}

function newBrowser() {
  toReturn = { nothing: 0 };
  currentTimeLeft = totalTimeTillFinish(bedTime);
  initTasks.forEach((task, index) => {
    if (currentTimeLeft < initTasks[index].endTime) {
      initTasks.splice(index, 1);
    }
  });

  initTasks.forEach((task, index) => {
    if (
      currentTimeLeft >= initTasks[index].endTime &&
      currentTimeLeft <= initTasks[index].startTime
    ) {
      taskTime = currentTimeLeft - initTasks[index].endTime;
      taskName = initTasks[index].task;
      toReturn = { task: taskName, time: taskTime };
    }
  });
  return toReturn;
}

app.get("/getRoutine", (req, res) => {
  if (appBegan == false) {
    appBegan = true;
    splitTaskTime();
  }
  x = getStatus();
  res.json({
    paused: x.paused,
    currentTask: x.currentTask,
  });
});

app.get("/start", (req, res) => {
  paused = false;
  splitTaskTime();
  return getStatus();
});

app.get("/pause", (req, res) => {
  cT = newBrowser();

  timeAtPause = totalTimeTillFinish(bedTime);

  taskAtPause = Object.keys(cT)[0];
  timeLeftOfTaskAtPause = Object.values(cT)[0];
  console.log("cT: ", cT);
  console.log("initTasks: ", initTasks);
  console.log("taskAtPause: ", taskAtPause);
  console.log("timeLeftOfTaskAtPause: ", timeLeftOfTaskAtPause);

  x = {};

  initTasks.forEach((task, index) => {
    if (initTasks[index].task === taskAtPause) {
      x = initTasks[index];
    }
  });

  fullTimeAlocated = x.startTime - x.endTime;

  timePassed = x.startTime - (x.endtime + timeLeftOfTaskAtPause);

  taskTimeAlreadyDonePercentage = timePassed / fullTimeAlocated;

  percentageLeftToDo = 1 - taskTimeAlreadyDonePercentage;

  baseTasks.forEach((task, index) => {
    percentToAdd =
      (task.percentage * (task.percentage * taskTimeAlreadyDonePercentage)) /
      100;
    if (index === 0) {
      newPercentAllocation =
        percentToAdd + task.percentage * percentageLeftToDo;
    } else {
      newPercentAllocation = percentToAdd + task.percentage;
    }

    baseTasks[index].percentage = newPercentAllocation;
  });

  paused = true;
  return { paused: true };
});

// starting the server
app.listen(3001, () => {
  console.log("listening on port 3001");
});
