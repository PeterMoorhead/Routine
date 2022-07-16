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

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();

today = mm + "/" + dd + "/" + yyyy;

appBegan = false;
paused = false;
bedTime = today + " 19:25:00";
totalTimeLeft = totalTimeTillFinish(bedTime);
initTasks = [];
currentTask = 0;
baseTasks = [
  { task: "programming", percentage: 0.25 },
  { task: "russian", percentage: 0.25 },
  { task: "self help", percentage: 0.1 },
  { task: "finance", percentage: 0.1 },
  { task: "exercise", percentage: 0.3 },
];

function getStatus() {
  task = newBrowser();
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
      console.log("task.percentage 1: ", task.percentage);
      console.log("timeLeft 1: ", timeLeft);
      console.log("taskStartTime 1: ", taskStartTime);
      loopy = Math.floor(loopy + taskStartTime);
      initTasks.push({
        task: task.task,
        endTime: 0,
        startTime: Math.floor(taskStartTime),
      });
    } else if (index === baseTasks.length - 1) {
      taskStartTime = task.percentage * timeLeft;
      console.log("taskStartTime 3: ", taskStartTime);
      console.log("task.percentage 3: ", task.percentage);
      console.log("timeLeft 3: ", timeLeft);
      initTasks.push({
        task: task.task,
        endTime: loopy,
        startTime: Math.floor(taskStartTime + loopy) + 5,
      });

      loopy = Math.floor(loopy + taskStartTime);
    } else {
      taskStartTime = task.percentage * timeLeft;
      console.log("taskStartTime 2: ", taskStartTime);
      console.log("task.percentage 2: ", task.percentage);
      console.log("timeLeft 2: ", timeLeft);
      initTasks.push({
        task: task.task,
        endTime: loopy,
        startTime: Math.floor(taskStartTime + loopy),
      });

      loopy = Math.floor(loopy + taskStartTime);
    }
  });

  console.log("Start initTasks: ", initTasks);
  console.log("Start baseTasks: ", baseTasks);
}

function newBrowser() {
  toReturn = { nothing: 0 };
  currentTimeLeft = totalTimeTillFinish(bedTime);

  initTasks.forEach((task, index) => {
    if (
      currentTimeLeft > initTasks[index].endTime &&
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
  if (paused) {
    paused = false;
    splitTaskTime();
    x = getStatus();
    console.log("x: ", x);
    res.json({
      paused: x.paused,
      currentTask: x.currentTask,
    });
  }
});

app.get("/pause", (req, res) => {
  cT = newBrowser();

  timeAtPause = totalTimeTillFinish(bedTime);

  taskAtPause = cT.task;
  timeLeftOfTaskAtPause = cT.time; //currently time lfet to go, 200

  x = {};

  initTasks.forEach((task, index) => {
    if (initTasks[index].task === taskAtPause) {
      x = initTasks[index];
    }
  });

  initTasks.forEach((task, index) => {
    if (timeAtPause < initTasks[index].endTime) {
      baseTasks.splice(index, 1);
    }
  });

  l = 0;
  baseTasks.forEach((task) => {
    l = l + task.percentage;
  });
  split = 1 - l;
  test = split / baseTasks.length;
  baseTasks.forEach((task) => {
    task.percentage = task.percentage + test;
  });

  fullTimeAllocated = x.startTime - x.endTime; //300
  console.log("fullTimeAllocated", fullTimeAllocated);

  timePassed = fullTimeAllocated - timeLeftOfTaskAtPause; //
  console.log("timePassed", timePassed);

  taskTimeAlreadyDonePercentage = timePassed / fullTimeAllocated; // 1/100
  console.log("taskTimeAlreadyDonePercentage", taskTimeAlreadyDonePercentage);

  // A : B = C : D
  // C = D * (A/B)
  // 0.01 : 0.1 = C : 0.25
  // C = 0.25 * (0.01/0.1)
  // A : B = 0.025 : 0.25

  // taskTimeAlreadyDonePercentage : 100 = C : task.percentage
  // C = task.percentage * (taskTimeAlreadyDonePercentage/100)
  D = 0;
  baseTasks.forEach((task, index) => {
    if (task.task == taskAtPause) {
      D = baseTasks[index].percentage; //0.25
    }
  });
  // C = 0.25 * (taskTimeAlreadyDonePercentage / 0.1);
  C = D * (taskTimeAlreadyDonePercentage / 1);
  //C = 11.5
  percentageLeftToDo = D - C;
  //percentageLeftToDo = 13.5

  // percentageLeftToDo = 1 - taskTimeAlreadyDonePercentage; //99/100
  console.log("percentageLeftToDo", percentageLeftToDo); // 13.5
  p = 0;

  baseTasks.forEach((task, index) => {
    //you need to get the percentage of the task done of the total percentage of the task allocated, e.g ive done 23% of 25%

    console.log("task.percentagehere", task.percentage);
    console.log("taskTimeAlreadyDonePercentage", taskTimeAlreadyDonePercentage);

    if (taskAtPause === task.task) {
      // //this isnt workjng correctly
      percentToAdd = D * C; //2%
      console.log("percentToAdd", percentToAdd);

      newPercentAllocation = percentageLeftToDo + percentToAdd; //16.375
      console.log("xnewPercentAllocation", newPercentAllocation);
    } else {
      percentToAdd = task.percentage * C; // 0.02875 = 0.25 * 0.115
      newPercentAllocation = percentToAdd + task.percentage;
      console.log("newPercentAllocation", newPercentAllocation);
      p = p + newPercentAllocation;
    }
    //when its negative number, if you add them all together they still equal 1, just one of the tasks has negative time left
    baseTasks[index].percentage = newPercentAllocation;
  });
  initTasks = [];

  console.log("Pause baseTasks: ", baseTasks);
  paused = true;
  res.json({ paused: paused });
});

// starting the server
app.listen(3001, () => {
  console.log("listening on port 3001");
});
