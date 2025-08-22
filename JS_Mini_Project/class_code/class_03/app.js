let __id = 1;
function makeId(prefix) {
  return `${prefix}_${__id++}`;
}

// model
class Member {
  constructor(name, role = "member") {
    this.id = makeId("m");
    this.name = name;
    this.role = role;
  }
}

class EventItem {
  constructor(title,dateStr, description = "") {
    this.id = makeId("e");
    this.title = title;
    this.description = description;
    this.date = new Date(dateStr);
    this.capacity = capacity
    this.rsvps = new Set();
  }
  toggleRsvp(memberId){
    if (this.rsvps.has(memberId)){
      this.rsvps.delete(memberId);
    } else if (this.rsvps.size < this.capacity){
      this.rsvps.add(memberId);
    }
  }
}

class Club {
  constructor(name, capacity = 1) {
    this.id = makeId("c");
    this.name = name;
    this.capacity = capacity;
    this.members = []; // Member[]
    this.events = [];  // EventItem[]
  }
  get current() { return this.members.length; }
  get seatsLeft() { return Math.max(0, this.capacity - this.current); }
  get percentFull() { return this.capacity > 0 ? Math.round((this.current / this.capacity) * 100) : 0; }

  addMember(name, role = "member") {
    if (!name || typeof name !== "string") return { ok: false, reason: "invalid-name" };
    if (this.seatsLeft <= 0)              return { ok: false, reason: "full" };
    if (this.members.some(m => m.name.toLowerCase() === name.toLowerCase())) {
      return { ok: false, reason: "duplicate" };
    }
    const m = new Member(name, role);
    this.members.push(m);
    return { ok: true, member: m };
  }
  }
}


// Seed data from previous class
let clubs = [
  { name: "Coding Club", current: 12, capacity: 25 },
  { name: "Art Club", current: 8, capacity: 15 },
];

// Utility: compute seats left
function seatsLeft(club) {
  return club.capacity - club.current;
}

// Utility: compute percent full (rounded)
function percentFull(club) {
  if (club.capacity <= 0) return 0;
  return Math.round((club.current / club.capacity) * 100);
}

// Render all clubs
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = ""; // clear

  // Empty state
  if (clubs.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No clubs yet. Add one above to get started.";
    container.appendChild(p);
    return;
  }

  clubs.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";

    const msg = `${club.name}: ${club.current}/${club.capacity} seats filled (${seatsLeft(club)} left, ${percentFull(club)}% full)`;
    card.textContent = msg;
    container.appendChild(card);
  });
}

// Add a new club and re-render
function addClub(name, capacity) {
  clubs.push({ name, current: 0, capacity });
  renderClubs();
}

// Handle Create Club form submit
document.getElementById("club-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nameInput = document.getElementById("club-name");
  const capacityInput = document.getElementById("club-capacity");
  const errorMessage = document.getElementById("error-message");

  const name = nameInput.value.trim();
  const capacity = parseInt(capacityInput.value, 10);

  // Basic validation
  if (name === "" || isNaN(capacity) || capacity <= 0) {
    errorMessage.textContent = "Please enter a valid club name and capacity (min 1).";
    return;
  }

  // Duplicate check (case-insensitive)
  const exists = clubs.some(c => c.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    errorMessage.textContent = "A club with this name already exists.";
    return;
  }

  // Clear error and add
  errorMessage.textContent = "";
  addClub(name, capacity);

  // Reset form and focus name for faster entry
  nameInput.value = "";
  capacityInput.value = "";
  nameInput.focus();
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Initial paint
renderClubs();
