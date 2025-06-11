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
let clearCompleted = document.getElementById('clearCompleted');

// on click add the task

form.addEventListener("submit", (event) => {
  event.preventDefault();

  // adding event
  addTask.addEventListener("click", () => {
    if (todoName.value === "" && dueDate.value === '' && reminderTime.value === '') {
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

      listItem.setAttribute("task-completed", "false");
      listItem.setAttribute("data-due-date", dueDate.value);
      listItem.setAttribute('draggable', 'true');
      listItem.id = `task-${Date.now()}`; // Assign a unique ID based on the current timestamp


      let taskDiv = document.createElement("div");
      taskDiv.classList.add("flex", "flex-col");

      let taskName = document.createElement("input");
      taskName.id = "editTodo";
      taskName.classList.add("text-lg", "font-[500]", "overflow-ellipsis");
      taskName.value = todoName.value;

      let dueBox = document.createElement("p");
      dueBox.classList.add("text-sm");
      dueBox.innerText = `Due Date : `;

      let dueDateDisplay = document.createElement("p");
      dueDateDisplay.classList.add("text-sm");
      dueDateDisplay.innerText = dueDate.value;
      dueDateDisplay.id = "due";

      let dueDiv = document.createElement("div");
      dueDiv.classList.add("flex", "flex-row", "gap-2");
      dueDiv.append(dueBox, dueDateDisplay);

      let reminderBox = document.createElement("p");
      reminderBox.classList.add("text-sm");
      reminderBox.innerText = `Reminder : `;

      let reminderDisplay = document.createElement("p");
      reminderDisplay.classList.add("text-sm");
      reminderDisplay.innerText = reminderTime.value;
      reminderDisplay.id = "reminder";

      let reminderDiv = document.createElement("div");
      reminderDiv.classList.add("flex", "flex-row", "gap-2");
      reminderDiv.append(reminderBox, reminderDisplay);

      taskDiv.append(taskName, dueDiv, reminderDiv);

      let buttonDiv = document.createElement("div");
      buttonDiv.classList.add(
        "flex",
        "flex-row",
        "md:gap-2",
        "gap-1",
        "justify-center",
        "items-center"
      );

      let completedTask = document.createElement("button");
      completedTask.id = "complete";
      completedTask.classList.add("notCompleted");

      let editTask = document.createElement("button");
      editTask.id = "edit";
      editTask.innerText = "✏️";

      let deleteTask = document.createElement("button");
      deleteTask.id = "delete";
      deleteTask.innerText = "🗑️";

      buttonDiv.append(completedTask, editTask, deleteTask);

      listItem.append(taskDiv, buttonDiv);

      taskDisplay.appendChild(listItem);
      addDragAndDropListeners(listItem);

      reminderCall(reminderTime.value, todoName.value);

      // Clear inputs
      todoName.value = "";
      dueDate.value = "";
      reminderTime.value = "";

      saveData();
    }
  });
});

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
clearCompleted.addEventListener('click',function(){
  let tasks = document.querySelectorAll('#taskDisplay li');
  tasks.forEach((task) => {
      if(task.getAttribute("task-completed") === "true"){
        task.remove();
      }
  })
  saveData();
})

// storing todos in localStorage
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

function toggleClearCompletedButton() {
  const hasCompletedTasks = Array.from(document.querySelectorAll('#taskDisplay li'))
    .some(task => task.getAttribute('task-completed') === 'true');
  
  clearCompleted.style.display = hasCompletedTasks ? 'block' : 'none';
}

toggleClearCompletedButton() 

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

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("flex", "flex-col");

    const taskName = document.createElement("input");
    taskName.id = "editTodo";
    taskName.classList.add("text-lg", "font-[500]", "overflow-ellipsis");
    taskName.value = task.name;
    if (task.completed) {
      taskName.classList.add("taskCompleted");
    }

    let dueBox = document.createElement("p");
    dueBox.classList.add("text-sm");
    dueBox.innerText = `Due Date : `;

    let dueDateDisplay = document.createElement("p");
    dueDateDisplay.classList.add("text-sm");
    dueDateDisplay.innerText = task.dueTime;
    dueDateDisplay.id = "due";

    let dueDiv = document.createElement("div");
    dueDiv.classList.add("flex", "flex-row", "gap-2");
    dueDiv.append(dueBox, dueDateDisplay);

    let reminderBox = document.createElement("p");
    reminderBox.classList.add("text-sm");
    reminderBox.innerText = `Reminder : `;

    let reminderDisplay = document.createElement("p");
    reminderDisplay.classList.add("text-sm");
    reminderDisplay.innerText = task.reminder;
    reminderDisplay.id = "reminder";

    let reminderDiv = document.createElement("div");
    reminderDiv.classList.add("flex", "flex-row", "gap-2");
    reminderDiv.append(reminderBox,reminderDisplay);

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

  });
}


document.addEventListener("DOMContentLoaded", displayData);


// adding reminder notification functionality
if(Notification.permission !== 'granted'){
  Notification.requestPermission();
}

function reminderCall(reminderTime, todoName){
   let now = new Date();
   let reminderDate= new Date(reminderTime);

   if(reminderDate > now){
    let delay = reminderDate - now;
   

   setTimeout(() => {
    new Notification("Call Reminder⏱️",{
      body : `Time to complete : ${todoName}`,
    })
   },delay);
  }
}


function addDragAndDropListeners(listItem) {
  listItem.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", listItem.id);
    listItem.classList.add("dragging");
  });

  listItem.addEventListener("dragend", () => {
    listItem.classList.remove("dragging");
    saveData();
  });

  listItem.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.clientY);
    const draggingOverItem = afterElement === null ? listItem : afterElement;
    draggingOverItem.classList.add("drag-over");
  });

  listItem.addEventListener("dragleave", () => {
    listItem.classList.remove("drag-over");
  });

  listItem.addEventListener("drop", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.clientY);
    const draggingOverItem = afterElement === null ? listItem : afterElement;
    taskDisplay.insertBefore(listItem, draggingOverItem);
    listItem.classList.remove("drag-over");
    saveData();
  });
}

// Get the element to place the dragged item after
function getDragAfterElement(clientY) {
  const draggableElements = [...taskDisplay.querySelectorAll('.task-item:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = clientY - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}