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
bedTime = today + " 16:30:15";
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
  console.log("timeLeft", timeLeft);
  loopy = 0;
  baseTasks.forEach((task, index) => {
    console.log("task", task);
    if (index === 0) {
      taskStartTime = task.percentage * timeLeft;
      console.log("taskStartTime", taskStartTime);
      loopy = Math.floor(loopy + taskStartTime);
      initTasks.push({
        task: task.task,
        endTime: 0,
        startTime: Math.floor(taskStartTime),
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
        startTime: Math.floor(taskStartTime + loopy),
      });

      loopy = Math.floor(loopy + taskStartTime);
    }
  });
}

function newBrowser() {
  toReturn = { nothing: 0 };
  currentTimeLeft = totalTimeTillFinish(bedTime);
  console.log("currentTimeLeft: ", currentTimeLeft);
  initTasks.forEach((task, index) => {
    if (currentTimeLeft < initTasks[index].endTime) {
      //cant do this because tasks recalculate
      initTasks.splice(index, 1);
      // baseTasks.splice(index, 1);
    }
  });
  console.log("inittasks: ", initTasks);
  console.log("baseTasks: ", baseTasks);

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
  console.log("inittasks2: ", initTasks);

  console.log("toReturn: ", toReturn);
  return toReturn;
}

app.get("/getRoutine", (req, res) => {
  console.log("Appbegun? ", appBegan);
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
    console.log("start ");
    splitTaskTime();
    x = getStatus();
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
  console.log("cT: ", cT);
  console.log("initTasks: ", initTasks);
  console.log("taskAtPause: ", taskAtPause);

  x = {};

  initTasks.forEach((task, index) => {
    if (initTasks[index].task === taskAtPause) {
      x = initTasks[index];
    }
  });

  //x.startTime = 500
  //x.endTime = 200
  console.log("x", x);
  fullTimeAllocated = x.startTime - x.endTime; //300
  console.log("fullTimeAllocated", fullTimeAllocated);

  console.log("x.startTime: ", x.startTime);
  console.log("x.endTime: ", x.endTime);
  console.log("timeLeftOfTaskAtPause: ", timeLeftOfTaskAtPause);
  timePassed = fullTimeAllocated - timeLeftOfTaskAtPause;
  console.log("timePassed", timePassed);

  taskTimeAlreadyDonePercentage = timePassed / fullTimeAllocated;
  console.log("taskTimeAlreadyDonePercentage", taskTimeAlreadyDonePercentage); //11.5

  percentageLeftToDo = 1 - taskTimeAlreadyDonePercentage;

  console.log("percentageLeftToDo", percentageLeftToDo); //13.5
  p = 0;

  baseTasks.forEach((task, index) => {
    console.log("task.percentage", task.percentage);
    //you need to get the percentage of the task done of the total percentage of the task allocated, e.g ive done 23% of 25%
    percentToAdd = task.percentage * taskTimeAlreadyDonePercentage; //2.875
    console.log("percentToAdd", percentToAdd);

    console.log("taskAtPause:", taskAtPause);
    console.log("task.task:", task.task);
    if (taskAtPause === task.task) {
      // //this isnt workjng correctly
      // y = percentageLeftToDo * task.percentage;
      // console.log("y:", y);
      // newPercentAllocation = percentToAdd + y; //16.375
      // console.log("newPercentAllocation", newPercentAllocation);
    } else {
      newPercentAllocation = percentToAdd + task.percentage;
      p = p + newPercentAllocation;
    }

    initTasks = [];
    baseTasks[index].percentage = newPercentAllocation;
  });

  baseTasks.forEach((task, index) => {
    if (task.task == taskAtPause) {
      baseTasks[index].percentage = 1 - p;
    }
  });

  console.log("baseTasks at pause: ", baseTasks);
  paused = true;
  res.json({ paused: paused });
});

// starting the server
app.listen(3001, () => {
  console.log("listening on port 3001");
});
