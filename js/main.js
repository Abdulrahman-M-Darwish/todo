const form = document.querySelector("form");
const tasks = localStorage.getItem("tasks")
  ? JSON.parse(localStorage.getItem("tasks"))
  : [];
const itemsLeft = document.querySelector(".left-items");
const options = document.querySelectorAll(".filters button");
const clearButton = document.querySelector(".dashboard > button");
const themeButton = document.querySelector(".header img");
let taskPreant = document.querySelector(".tasks");
let filterList = document.querySelectorAll(".tasks > div");
let filterType = document.querySelector(".filters > .active").textContent;

// for updadating the values
const updateDashboard = () => {
  itemsLeft.textContent =
    tasks.filter((task) => !task.cheked).length + " items left";
};

options.forEach((ele) => {
  ele.addEventListener("click", (e) => {
    options.forEach((ele) => {
      ele.classList.remove("active");
    });
    e.target.classList.add("active");
    filterType = e.target.textContent;
    updateDashboard();
    filters();
  });
});

const themeSwitcher = (e) => {
  if (e.target.getAttribute("src") === "./images/icon-sun.svg") {
    e.target.setAttribute("src", "./images/icon-moon.svg");
    document.body.className = "light";
  } else {
    e.target.setAttribute("src", "./images/icon-sun.svg");
    document.body.className = "dark";
  }
};

const filters = () => {
  for (let i = 0; i < filterList.length; i++) {
    switch (filterType) {
      case "Active":
        if (filterList[i].classList.contains("active")) {
          filterList[i].style.display = "none";
        } else {
          filterList[i].style.display = "flex";
        }
        break;
      case "Completed":
        if (!filterList[i].classList.contains("active")) {
          filterList[i].style.display = "none";
        } else {
          filterList[i].style.display = "flex";
        }
        break;
      default:
        filterList[i].style.display = "flex";
        break;
    }
  }
};

const addToLocalStorage = (item) => {
  localStorage.setItem("tasks", JSON.stringify(item));
  updateDashboard();
};

const removeCompleted = () => {
  for (let i = 0; i < tasks.length; i++) {
    const currentTask = document.querySelectorAll(".tasks > div")[i];
    for (let y = 0; y < tasks.length; y++) {
      if (tasks[y].cheked) {
        tasks.splice(y, 1);
      }
    }
    const newTasks = tasks
      .filter((task) => !task.cheked)
      .map((task, i) => ({ ...task, key: i }));
    addToLocalStorage(newTasks);
    displayTasks(newTasks);
  }
};

const toggleState = (index) => {
  tasks[index].cheked = !tasks[index].cheked;
  const currentTask = document.querySelectorAll(".tasks > div")[index];
  currentTask.classList.toggle("active");
  const newTasks = tasks.map((task, i) => ({ ...task, key: i }));
  addToLocalStorage(newTasks);
};

const removeTask = (index) => {
  const currentTask = document.querySelectorAll(".tasks > div")[index];
  currentTask.classList.add("close");
  tasks.splice(index, 1);
  const newTasks = tasks.map((task, i) => ({ ...task, key: i }));
  addToLocalStorage(newTasks);
  currentTask.addEventListener("webkitTransitionEnd", () => {
    displayTasks(newTasks);
  });
};

const displayTasks = (tasks = []) => {
  taskPreant.innerHTML = "";
  tasks.forEach((task) => {
    taskPreant.innerHTML += `
    <div class="task flex justify-between items-center ${
      task.cheked ? "active" : ""
    }">
      <div onclick="toggleState(${
        task.key
      })" class="check flex justify-center items-center">
        <img src="./images/icon-check.svg" alt="check" />
      </div>
      <p>${task.value}</p>
      <div onclick="removeTask(${task.key})" class="close">
        <img src="./images/icon-cross.svg" alt="remove task" />
      </div>
    </div>
    `;
  });
  updateDashboard();
};

const addTask = (e) => {
  e.preventDefault();
  const inputValue = document.querySelector("input");
  const key = tasks.length;
  const cheked = false;
  tasks.push({ value: inputValue.value, cheked, key });
  inputValue.value = "";
  addToLocalStorage(tasks);
  displayTasks(tasks);
  updateDashboard();
};

addEventListener("load", () => displayTasks(tasks));
form.addEventListener("submit", addTask);
clearButton.addEventListener("click", removeCompleted);
themeButton.addEventListener("click", themeSwitcher);
