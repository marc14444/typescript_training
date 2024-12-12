"use strict";
/**
 * Fetch all tasks from localStorage
 */
function getTasks() {
    const tasksJSON = localStorage.getItem("tasks");
    return tasksJSON ? JSON.parse(tasksJSON) : [];
}
/**
 * Save all tasks to localStorage
 */
function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
/**
 * Add a new task
 */
function addTask(title) {
    const tasks = getTasks();
    const newTask = {
        id: generateId(),
        title,
        completed: false,
    };
    tasks.push(newTask);
    saveTasks(tasks);
    return newTask;
}
/**
 * Generate a unique ID for each task
 */
function generateId() {
    return Date.now().toString(); // Simple ID generation based on timestamp
}
/**
 * Render a single task in the DOM
 */
function renderTask(task) {
    const taskList = document.getElementById("task-list");
    if (!taskList)
        return;
    const li = document.createElement("li");
    li.className = "flex items-center justify-between bg-gray-100 p-3 rounded-lg";
    li.dataset.id = task.id;
    li.innerHTML = `
      <div class="task-content">
        <span class="task-title text-gray-700">${task.title}</span>
        <input type="text" class="edit-input hidden px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value="${task.title}" />
      </div>
      <div>
        <button class="edit-btn text-yellow-500 hover:text-yellow-600 mr-2">Edit</button>
        <button class="delete-btn text-red-500 hover:text-red-600">Delete</button>
      </div>
    `;
    // Attach event listeners for Edit and Delete buttons
    const editButton = li.querySelector(".edit-btn");
    const deleteButton = li.querySelector(".delete-btn");
    const editInput = li.querySelector(".edit-input");
    const taskTitle = li.querySelector(".task-title");
    // Edit button event
    editButton === null || editButton === void 0 ? void 0 : editButton.addEventListener("click", () => {
        // Toggle visibility of edit input and title
        editInput.classList.toggle("hidden");
        taskTitle.classList.toggle("hidden");
        // Focus the input for editing
        if (!editInput.classList.contains("hidden")) {
            editInput.focus();
        }
    });
    // Save the task when input loses focus or Enter is pressed
    editInput === null || editInput === void 0 ? void 0 : editInput.addEventListener("blur", () => saveEdit(task.id, editInput, taskTitle));
    editInput === null || editInput === void 0 ? void 0 : editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            saveEdit(task.id, editInput, taskTitle);
        }
    });
    // Delete button event
    deleteButton === null || deleteButton === void 0 ? void 0 : deleteButton.addEventListener("click", () => deleteTask(task.id, li));
    taskList.appendChild(li);
}
/**
 * Save the edited task
 */
function saveEdit(taskId, editInput, taskTitle) {
    const tasks = getTasks();
    const task = tasks.find((task) => task.id === taskId);
    if (!task)
        return;
    // Update the task with new title
    task.title = editInput.value.trim();
    saveTasks(tasks);
    // Update the DOM to reflect the change
    taskTitle.textContent = task.title;
    // Hide the input and show the task title
    editInput.classList.add("hidden");
    taskTitle.classList.remove("hidden");
}
/**
 * Delete a task
 */
function deleteTask(taskId, taskElement) {
    const tasks = getTasks();
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    saveTasks(updatedTasks);
    taskElement.remove(); // Remove from DOM
}
/**
 * Render all tasks from localStorage
 */
function renderAllTasks() {
    const tasks = getTasks();
    tasks.forEach(renderTask);
}
// DOM Interactions
document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    if (!taskInput || !addTaskBtn) {
        console.error("Input field or button not found in the DOM.");
        return;
    }
    // Load tasks on page load
    renderAllTasks();
    // Add task on button click
    addTaskBtn.addEventListener("click", () => {
        const title = taskInput.value.trim();
        if (title === "") {
            alert("Please enter a task!");
            return;
        }
        const newTask = addTask(title);
        renderTask(newTask);
        taskInput.value = ""; // Clear input field
    });
});
