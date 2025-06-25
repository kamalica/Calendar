let currentDate = new Date();
let events = [];

document.addEventListener("DOMContentLoaded", () => {
  initDropdowns();

  // Fetch events from events.json dynamically
  loadEvents().then(() => {
    renderCalendar();
  });

  document.getElementById("prevBtn").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  document.getElementById("monthSelect").addEventListener("change", (e) => {
    currentDate.setMonth(parseInt(e.target.value));
    renderCalendar();
  });

  document.getElementById("yearSelect").addEventListener("change", (e) => {
    currentDate.setFullYear(parseInt(e.target.value));
    renderCalendar();
  });

  document.getElementById("createEventForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newEvent = {
      date: document.getElementById("eventDate").value,
      startTime: document.getElementById("startTime").value,
      endTime: document.getElementById("endTime").value,
      title: document.getElementById("title").value,
      color: document.getElementById("color").value
    };
    events.push(newEvent);
    renderCalendar(); // Update view
    e.target.reset();
  });
});

// Load events from events.json
async function loadEvents() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) throw new Error("Failed to load events.json");
    events = await response.json();
  } catch (error) {
    console.error("Error loading events.json:", error);
  }
}

function initDropdowns() {
  const monthSelect = document.getElementById("monthSelect");
  const yearSelect = document.getElementById("yearSelect");

  const currentYear = new Date().getFullYear();

  for (let i = 0; i < 12; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.text = new Date(0, i).toLocaleString("default", { month: "long" });
    if (i === currentDate.getMonth()) opt.selected = true;
    monthSelect.appendChild(opt);
  }

  for (let y = currentYear - 5; y <= currentYear + 5; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.text = y;
    if (y === currentDate.getFullYear()) opt.selected = true;
    yearSelect.appendChild(opt);
  }
}

function renderCalendar() {
  const calendarGrid = document.getElementById("calendarGrid");
  calendarGrid.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthLabel = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });
  document.getElementById("monthLabel").innerText = monthLabel;

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("empty");
    calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.classList.add("day");

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const dateLabel = document.createElement("span");
    dateLabel.classList.add("date-number");
    dateLabel.innerText = day;
    cell.appendChild(dateLabel);

    const dayEvents = events.filter(event => event.date === dateStr);

    dayEvents.forEach(ev => {
      const evDiv = document.createElement("div");
      evDiv.className = "event";
      evDiv.title = ev.title;
      evDiv.style.backgroundColor = ev.color;
      evDiv.innerHTML = `<strong>${ev.title}</strong><br><small>${ev.startTime} - ${ev.endTime}</small>`;
      cell.appendChild(evDiv);
    });

    calendarGrid.appendChild(cell);
  }
}
