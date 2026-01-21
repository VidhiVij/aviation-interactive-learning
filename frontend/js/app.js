const API = "https://aviation-backend-4axd.onrender.com/api";

/* ===============================
   LOGIN
================================ */
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "aircrafts.html";
  } else {
    document.getElementById("msg").innerText = "Invalid Login";
  }
}

/* ===============================
   LOAD ALL AIRCRAFTS
================================ */
async function loadAircrafts() {
  const res = await fetch(API + "/aircrafts");
  const aircrafts = await res.json();

  const list = document.getElementById("aircraft-list");
  list.innerHTML = "";

  aircrafts.forEach(a => {
    const card = document.createElement("div");
    card.className = "card aircraft-card";

    /* ✅ FIXED IMAGE PATH */
    card.style.backgroundImage = `url(${a.image})`;

    card.innerHTML = `
      <div class="card-overlay">
        <h3>${a.name}</h3>
        <p>${a.description.substring(0, 120)}...</p>
        <button class="btn outline">Explore</button>
      </div>
    `;

    card.onclick = () => {
      window.location.href = `aircraft.html?id=${a._id}`;
    };

    list.appendChild(card);
  });
}

/* ===============================
   LOAD SINGLE AIRCRAFT
================================ */
async function loadAircraft() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;

  const res = await fetch(API + "/aircrafts/" + id);
  const aircraft = await res.json();

  /* ✅ FIXED AIRCRAFT IMAGE */
  document.getElementById("aircraft-details").innerHTML = `
    <div class="aircraft-details">
      <h1>${aircraft.name}</h1>
      <img src="${aircraft.image}" class="aircraft-img">
      <p>${aircraft.description}</p>
    </div>
  `;

  const partsDiv = document.getElementById("parts");
  partsDiv.innerHTML = "";

  aircraft.parts.forEach(part => {
    const card = document.createElement("div");
    card.className = "card part-card";

    /* ✅ FIXED PART IMAGE */
    card.innerHTML = `
      <h3>${part.name}</h3>
      <button class="btn">View Info</button>
      <div class="part-desc">
        <p>${part.description}</p>
      </div>
    `;

    card.querySelector("button").onclick = () => {
      card.querySelector(".part-desc").classList.toggle("show");
    };

    partsDiv.appendChild(card);
  });
}

/* ===============================
   SEARCH FILTER
================================ */
function filterAircraft() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.getElementsByClassName("aircraft-card");

  for (let i = 0; i < cards.length; i++) {
    const name = cards[i].innerText.toLowerCase();

    if (name.includes(input)) {
      cards[i].style.display = "block";
    } else {
      cards[i].style.display = "none";
    }
  }
}
