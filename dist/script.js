// taking all the necessary elements

// FUNCTIONALITY 1 : DARK MODE TOGGLE

let darkModeToggle = document.getElementById("darkMode");

// Check for saved theme in localStorage
let savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.classList.add(savedTheme);
}

// Toggle theme on button click
darkModeToggle.addEventListener("click", () => {
  let isDarkMode = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});

// FUNCTIONALITY 2 : ADD/EDIT/DELETE TASK
let form = document.querySelector("form");
let addTask = document.getElementById("addTask");
let todoName = document.getElementById("todoName");
let dueDate = document.getElementById("dueDate");
let reminderTime = document.getElementById("reminderTime");
let taskDisplay = document.getElementById("taskDisplay");
let clearCompleted = document.getElementById("clearCompleted");

// on click add the task

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addNewTask(); // custom function
  });
  
  function addNewTask(){
    if (
      todoName.value === "" &&
      dueDate.value === "" &&
      reminderTime.value === ""
    ) {
      alert("Enter todo..");
    } else {
      let listItem = document.createElement("li");
      listItem.classList.add(
        "dark:bg-[#2e2e2e]",
        "dark:border-0",
        "flex",
        "flex-row",
        "justify-between",
        "items-center",
        "hover:bg-[#fff7f2]",
        "bg-white",
        "border-2",
        "border-orange-700",
        "px-3",
        "py-1.5",
        "rounded-xl",
        "mb-4",
        "w-full"
      );

      listItem.setAttribute("task-completed", "false");
      listItem.setAttribute("data-due-date", dueDate.value);
      listItem.setAttribute("draggable", "true");
      listItem.id = `task-${Date.now()}`; // Assign a unique ID based on the current timestamp

      // div for storinf the taskname,duedate and reminder
      let taskDiv = document.createElement("div");
      taskDiv.classList.add("flex", "flex-col");

      let taskName = document.createElement("input");
      taskName.id = "editTodo";
      taskName.classList.add("text-lg", "font-[500]", "overflow-ellipsis");
      taskName.value = todoName.value;

      let dueBox = document.createElement("p");
      dueBox.classList.add("md:text-sm", "text-[12px]");
      dueBox.innerText = `Due Date : `;

      let dueDateDisplay = document.createElement("p");
      dueDateDisplay.classList.add("md:text-sm", "text-[12px]");
      dueDateDisplay.innerText = dueDate.value;
      dueDateDisplay.id = "due";

      let dueDiv = document.createElement("div");
      dueDiv.classList.add("flex", "flex-row", "gap-2");
      dueDiv.append(dueBox, dueDateDisplay);

      let reminderBox = document.createElement("p");
      reminderBox.classList.add("md:text-sm", "text-[12px]");
      reminderBox.innerText = `Reminder : `;

      let reminderDisplay = document.createElement("p");
      reminderDisplay.classList.add("md:text-sm", "text-[12px]");
      reminderDisplay.innerText = reminderTime.value;
      reminderDisplay.id = "reminder";

      let reminderDiv = document.createElement("div");
      reminderDiv.classList.add("flex", "flex-row", "gap-2");
      reminderDiv.append(reminderBox, reminderDisplay);

      taskDiv.append(taskName, dueDiv, reminderDiv);

      // div for storing all the buttons(edit,delete,complete)
      let buttonDiv = document.createElement("div");
      buttonDiv.classList.add(
        "flex",
        "flex-row",
        "md:gap-2",
        "gap-1",
        "justify-center",
        "items-center"
      );

      // complete button
      let completedTask = document.createElement("button");
      completedTask.id = "complete";
      completedTask.classList.add("notCompleted");

      // edit button
      let editTask = document.createElement("button");
      editTask.id = "edit";
      editTask.innerText = "✏️";

      // delete button
      let deleteTask = document.createElement("button");
      deleteTask.id = "delete";
      deleteTask.innerText = "🗑️";

      buttonDiv.append(completedTask, editTask, deleteTask);

      listItem.append(taskDiv, buttonDiv);

      taskDisplay.appendChild(listItem);
      addDragAndDropListeners();

      showTime();
      // Clear inputs
      todoName.value = "";
      dueDate.value = "";
      reminderTime.value = "";

      saveData();
    }
  };

// marking task as complete
taskDisplay.addEventListener("click", (event) => {
  if (event.target.id === "complete") {
    const listItem = event.target.closest("li");
    const taskNameInput = listItem.querySelector("input");
    const isCompleted = event.target.classList.contains("completed");

    // Toggle completion status
    event.target.classList.toggle("notCompleted");
    event.target.classList.toggle("completed", !isCompleted);
    taskNameInput.classList.toggle("taskCompleted", !isCompleted);

    listItem.setAttribute("task-completed", !isCompleted ? "true" : "false");
    saveData();
    toggleClearCompletedButton();
  }
});

// delete Task
taskDisplay.addEventListener("click", function (event) {
  if (event.target.id === "delete") {
    let deleteItem = event.target.closest("li");
    if (deleteItem) {
      deleteItem.remove();
      saveData();
      toggleClearCompletedButton();
    }
  }
});

// edit functionality
taskDisplay.addEventListener("click", (event) => {
  if (event.target.id === "edit") {
    const listItem = event.target.closest("li");
    const taskNameInput = listItem.querySelector("input");
    taskNameInput.removeAttribute("readonly");
    taskNameInput.focus();

    taskNameInput.addEventListener("blur", () => {
      taskNameInput.setAttribute("readonly", true);
      saveData();
      toggleClearCompletedButton();
    });
  }
});

// adding filter functinality
let statusFilter = document.getElementById("filterStatus");
let arrangement = document.getElementById("order");

// filter on the basis of task status(completed,pending,all)
statusFilter.addEventListener("change", (e) => {
  filterTasks(e.target.value);
});

function filterTasks(filter) {
  let tasks = document.querySelectorAll("#taskDisplay li");
  tasks.forEach((task) => {
    let isCompleted =
      task.getAttribute("task-completed") === "true" ? true : false;

    switch (filter) {
      case "Pending":
        task.style.display = isCompleted ? "none" : "flex";
        break;

      case "Completed":
        task.style.display = isCompleted ? "flex" : "none";
        break;

      default:
        task.style.display = "flex";
        break;
    }
  });
}

// sort task based on due date status
arrangement.addEventListener("change", (e) => {
  sortTasks(e.target.value);
});

function sortTasks(dueTask) {
  let tasks = document.querySelectorAll("#taskDisplay li");

  let today = new Date().toLocaleDateString("en-GB"); // DD-MM-YYYY format

  let afterSevenDays = new Date();
  afterSevenDays.setDate(afterSevenDays.getDate() + 7);

  tasks.forEach((task) => {
    // Date format is : YYYY-MM-DD
    let taskDueDate = task.querySelector("#due").innerText;

    // converting the string into date object
    let taskDate = new Date(taskDueDate);

    // Formatting taskDate to 'DD-MM-YYYY' for comparison
    let formattedTaskDate = taskDate.toLocaleDateString("en-GB");

    switch (dueTask) {
      case "today":
        task.style.display = formattedTaskDate === today ? "flex" : "none";

        break;

      case "week":
        task.style.display =
          taskDate >= new Date() && taskDate <= afterSevenDays
            ? "flex"
            : "none";
        break;

      case "overdue":
        task.style.display = taskDueDate < new Date() ? "flex" : "none";
        break;

      default:
        task.style.display = "flex";
        break;
    }
  });
}

// adding clear completed task functionality
clearCompleted.addEventListener("click", function () {
  let tasks = document.querySelectorAll("#taskDisplay li");
  tasks.forEach((task) => {
    if (task.getAttribute("task-completed") === "true") {
      task.remove();
    }
  });
  saveData();
});

document.addEventListener("DOMContentLoaded", displayData);

// adding reminder notification functionality just after dom is loaded

function showTime() {
  let tasks = document.querySelectorAll("#taskDisplay li");
  let now = new Date();

  tasks.forEach((task) => {
    let taskDue = task.querySelector("input").value;
    let reminderCall = task.querySelector("#reminder").innerText.trim();
    let [hours, minutes] = reminderCall.split(":").map(Number);

    let reminderDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0
    );

    if (reminderDate < now) {
      let delay = reminderDate - now;

      setTimeout(() => {
        new Notification("Due Task", {
          body: `${taskDue} is due`,
          icon: "./assets/clock.png",
        });
      }, delay);
    }
  });
}

setTimeout(() => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        showTime();
      } else {
        console.log("Notification permission not granted.");
      }
    });
  } else {
    showTime();
  }
}, 100); // Delay ensures tasks are in DOM before scanning

// storing todos in localStorage in form of array of strings
function saveData() {
  let tasks = [];
  document.querySelectorAll("#taskDisplay li").forEach((item) => {
    let task = {
      name: item.querySelector("input").value,
      dueTime: item.querySelector("#due")?.textContent,
      completed: item
        .querySelector("#complete")
        .classList.contains("completed"),
      taskCompleted: item.getAttribute("task-completed") === "true",
      reminder: item.querySelector("#reminder")?.textContent,
    };
    tasks.push(task);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// clear complete button display on load if there is completed task present
function toggleClearCompletedButton() {
  const hasCompletedTasks = Array.from(
    document.querySelectorAll("#taskDisplay li")
  ).some((task) => task.getAttribute("task-completed") === "true");

  clearCompleted.style.display = hasCompletedTasks ? "block" : "none";
}

toggleClearCompletedButton();

// displaying the data from localStorage
function displayData() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.classList.add(
      "dark:bg-[#2e2e2e]",
      "dark:border-0",
      "flex",
      "flex-row",
      "justify-between",
      "items-center",
      "hover:bg-[#fff7f0]",
      "bg-white",
      "border-2",
      "border-orange-700",
      "px-3",
      "py-1.5",
      "rounded-xl",
      "mb-4",
      "w-full"
    );
    listItem.setAttribute("task-completed", task.completed ? "true" : "false");
    listItem.setAttribute("draggable", "true");

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("flex", "flex-col");

    const taskName = document.createElement("input");
    taskName.id = "editTodo";
    taskName.classList.add("text-lg", "font-[500]", "overflow-ellipsis");
    taskName.value = task.name;
    if (task.completed) {
      taskName.classList.add("taskCompleted");
      clearCompleted.style.display = "block";
    }

    let dueBox = document.createElement("p");
    dueBox.classList.add("md:text-sm", "text-[12px]");
    dueBox.innerText = `Due Date:`;

    let dueDateDisplay = document.createElement("p");
    dueDateDisplay.classList.add("md:text-sm", "text-[12px]");
    dueDateDisplay.innerText = task.dueTime;
    dueDateDisplay.id = "due";

    let dueDiv = document.createElement("div");
    dueDiv.classList.add("flex", "flex-row", "gap-2");
    dueDiv.append(dueBox, dueDateDisplay);

    let reminderBox = document.createElement("p");
    reminderBox.classList.add("md:text-sm", "text-[12px]");
    reminderBox.innerText = `Reminder : `;

    let reminderDisplay = document.createElement("p");
    reminderDisplay.classList.add("md:text-sm", "text-[12px]");
    reminderDisplay.innerText = task.reminder;
    reminderDisplay.id = "reminder";

    let reminderDiv = document.createElement("div");
    reminderDiv.classList.add("flex", "flex-row", "gap-2");
    reminderDiv.append(reminderBox, reminderDisplay);

    taskDiv.append(taskName, dueDiv, reminderDiv);

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add(
      "flex",
      "flex-row",
      "md:gap-2",
      "gap-1",
      "justify-center",
      "items-center"
    );

    const completedTask = document.createElement("button");
    completedTask.id = "complete";
    completedTask.classList.add("notCompleted");

    if (task.completed) {
      completedTask.classList.remove("notCompleted");
      completedTask.classList.add("completed");
    }

    const editTask = document.createElement("button");
    editTask.id = "edit";
    editTask.innerText = "✏️";

    const deleteTask = document.createElement("button");
    deleteTask.id = "delete";
    deleteTask.innerText = "🗑️";

    buttonDiv.append(completedTask, editTask, deleteTask);

    listItem.append(taskDiv, buttonDiv);

    taskDisplay.appendChild(listItem);
    addDragAndDropListeners();
  });
}

// adding drag and drop functionality

function addDragAndDropListeners() {
  let tasks = document.querySelectorAll("#taskDisplay li");

  tasks.forEach((task) => {
    task.addEventListener("dragstart", (e) => {
      task.classList.add("dragging");
    });

    task.addEventListener("dragend", () => {
      task.classList.remove("dragging");
      saveData();
    });

    taskDisplay.addEventListener("dragover", (e) => {
      e.preventDefault();
      let afterElement = getDragAfterElement(e.clientY);
      let draggedItem = document.querySelector(".dragging");

      if (!afterElement) {
        taskDisplay.appendChild(draggedItem);
      } else {
        taskDisplay.insertBefore(draggedItem, afterElement);
      }
    });

    task.addEventListener("dragleave", () => {
      task.classList.remove("drag-over");
    });

    taskDisplay.addEventListener("drop", (e) => {
      e.preventDefault();
      let draggedItem = document.querySelector(".dragging");
      if (draggedItem) {
        draggedItem.classList.remove("dragging");
        saveData();
      }
    });
  });
}

// Get the element to place the dragged item after
function getDragAfterElement(y) {
  let draggableElements = [
    ...taskDisplay.querySelectorAll("li:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      let box = child.getBoundingClientRect();
      let offset = y - box.top - box.height / 2; // use midpoint
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

document.addEventListener("DOMContentLoaded", () => {
  addDragAndDropListeners();
});
