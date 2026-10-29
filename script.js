
const input = document.getElementById("habitInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("habitList");

// Load saved habits from the browser, or start with an empty list
let habits = JSON.parse(localStorage.getItem("habits")) || [];

// Save habits to the browser
function save() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// Draw the list on the page
function render() {
  list.innerHTML = "";

  habits.forEach(function (habit, index) {
    const li = document.createElement("li");
    if (habit.done) li.classList.add("done");

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.done;
    checkbox.addEventListener("change", function () {
      habits[index].done = checkbox.checked;
      save();
      render();
    });

    // Habit name
    const name = document.createElement("span");
    name.textContent = habit.name;

    // Delete button
    const del = document.createElement("button");
    del.textContent = "Delete";
    del.classList.add("delete-btn");
    del.addEventListener("click", function () {
      habits.splice(index, 1);
      save();
      render();
    });

    li.appendChild(checkbox);
    li.appendChild(name);
    li.appendChild(del);
    list.appendChild(li);
  });
}

// Add a new habit
function addHabit() {
  const text = input.value.trim();
  if (text === "") return;

  habits.push({ name: text, done: false });
  input.value = "";
  save();
  render();
}

addBtn.addEventListener("click", addHabit);
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") addHabit();
});

// Show the list when the page first opens
render();
