const apiBaseUrl = "/api";

const apiStatus = document.querySelector("#apiStatus");
const taskForm = document.querySelector("#taskForm");
const taskTitle = document.querySelector("#taskTitle");
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const refreshButton = document.querySelector("#refreshButton");

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function setStatus(online) {
  apiStatus.textContent = online ? "API online" : "API offline";
  apiStatus.classList.toggle("online", online);
  apiStatus.classList.toggle("offline", !online);
}

function renderTasks(tasks) {
  taskList.innerHTML = "";
  emptyState.hidden = tasks.length > 0;

  for (const task of tasks) {
    const item = document.createElement("li");
    item.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", async () => {
      await request(`/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: checkbox.checked }),
      });
      await loadTasks();
    });

    const title = document.createElement("span");
    title.className = `task-title${task.completed ? " done" : ""}`;
    title.textContent = task.title;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      await request(`/tasks/${task.id}`, { method: "DELETE" });
      await loadTasks();
    });

    item.append(checkbox, title, deleteButton);
    taskList.append(item);
  }
}

async function loadTasks() {
  try {
    const tasks = await request("/tasks");
    renderTasks(tasks);
    setStatus(true);
  } catch (error) {
    setStatus(false);
    emptyState.hidden = false;
    emptyState.textContent = error.message;
  }
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = taskTitle.value.trim();

  if (!title) {
    return;
  }

  await request("/tasks", {
    method: "POST",
    body: JSON.stringify({ title }),
  });

  taskTitle.value = "";
  taskTitle.focus();
  await loadTasks();
});

refreshButton.addEventListener("click", loadTasks);

loadTasks();
