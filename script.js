// Get the things we need from the page
const input = document.getElementById("habitInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("habitList");

// Load saved habits (and fix up older ones that don't have streak info yet)
let saved = JSON.parse(localStorage.getItem("habits")) || [];
let habits = saved.map(function (h) {
  return {
    name: h.name,
    streak: h.streak || 0,
    best: h.best || 0,
    lastDone: h.lastDone || null
  };
});

// Save habits to the browser
function save() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// Gives a date like "2026-10-29". daysAgo = 0 is today, 1 is yesterday
function dateString(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// The streak only counts if the habit was done today or yesterday
function currentStreak(habit) {
  if (habit.lastDone === dateString(0) || habit.lastDone === dateString(1)) {
    return habit.streak;
  }
  return 0;
}

// Draw the list on the page
function render() {
  list.innerHTML = "";
  const today = dateString(0);

  habits.forEach(function (habit, index) {
    const li = document.createElement("li");
    const doneToday = habit.lastDone === today;
    if (doneToday) li.classList.add("done");

    // Checkbox (ticked only if done TODAY, so it clears itself each new day)
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = doneToday;
    checkbox.addEventListener("change", function () {
      const h = habits[index];
      const yesterday = dateString(1);

      if (checkbox.checked) {
        // Done yesterday too? Streak grows. Otherwise start again at 1.
        h.streak = (h.lastDone === yesterday) ? h.streak + 1 : 1;
        if (h.streak > h.best) h.best = h.streak;
        h.lastDone = today;
      } else {
        // Un-ticked by mistake: undo today
        h.streak = Math.max(0, h.streak - 1);
        h.lastDone = h.streak > 0 ? yesterday : null;
      }

      save();
      render();
    });

    // Habit name
    const name = document.createElement("span");
    name.textContent = habit.name;

    // Streak badge
    const streak = currentStreak(habit);
    const badge = document.createElement("small");
    badge.textContent = streak > 0 ? "🔥 " + streak + (streak === 1 ? " day" : " days") : "No streak yet";
    badge.title = "Best streak: " + habit.best;
    badge.style.cssText = "font-size:13px; color:#888; white-space:nowrap;";

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
    li.appendChild(badge);
    li.appendChild(del);
    list.appendChild(li);
  });
}

// Add a new habit
function addHabit() {
  const text = input.value.trim();
  if (text === "") return;

  habits.push({ name: text, streak: 0, best: 0, lastDone: null });
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
