const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const toggleThemeBtn = document.getElementById("toggleThemeBtn");

// 🆕 MODAL do potwierdzenia usuwania
const confirmModal = document.getElementById("confirmModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

let pendingDelete = null; // obiekt: { li, taskText }

// 🧠 Wczytaj zapisane zadania po załadowaniu strony
window.addEventListener("load", function () {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => {
    addTaskToDOM(task);
  });
});

// ➕ Funkcja: dodaj zadanie do DOM
function addTaskToDOM(taskText) {
  const li = document.createElement("li");
  li.textContent = taskText;

  // 🗑️ Tworzenie przycisku "Usuń"
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.style.backgroundColor = "#ff4d4d";
  deleteBtn.style.color = "white";
  deleteBtn.style.border = "none";
  deleteBtn.style.borderRadius = "3px";
  deleteBtn.style.cursor = "pointer";

  // 🧼 Zamiast confirm – pokazujemy MODAL
  deleteBtn.addEventListener("click", function () {
    pendingDelete = { li, taskText };
    confirmModal.classList.remove("hidden");
  });

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// 💾 Zapisz nowe zadanie do localStorage
function saveTaskToStorage(taskText) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ❌ Usuń zadanie z localStorage
function removeTaskFromStorage(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ▶️ Obsługa kliknięcia "Dodaj"
button.addEventListener("click", function () {
  const taskText = input.value.trim();

  if (taskText !== "") {
    addTaskToDOM(taskText);
    saveTaskToStorage(taskText);
    input.value = "";
  }
});

// ⌨️ Obsługa Enter w polu input
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    button.click();
  }
});

// 🌙 Przełącznik trybu ciemnego
toggleThemeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    toggleThemeBtn.textContent = "☀️ Tryb jasny";
  } else {
    toggleThemeBtn.textContent = "🌙 Tryb ciemny";
  }
});

// ✅ Potwierdzenie w popupie – "Tak"
confirmYes.addEventListener("click", function () {
  if (pendingDelete) {
    taskList.removeChild(pendingDelete.li);
    removeTaskFromStorage(pendingDelete.taskText);
    pendingDelete = null;
  }
  confirmModal.classList.add("hidden");
});

// 🚫 Potwierdzenie w popupie – "Anuluj"
confirmNo.addEventListener("click", function () {
  pendingDelete = null;
  confirmModal.classList.add("hidden");
});
