const TMDB_KEY = "38e497c6c1a043d1341416e80915669f";
const IMG = "https://image.tmdb.org/t/p/original";

const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");

let page = 1;
let loading = false;
let mode = "home"; // home | search
let query = "";

/* ===============================
   CARGA PRINCIPAL (HOME)
================================ */
async function loadHome(reset = false) {
  if (loading) return;
  loading = true;

  if (reset) {
    page = 1;
    grid.innerHTML = "";
  }

  const r = await fetch(
    `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_KEY}&language=es-MX&page=${page}`
  );
  const d = await r.json();

  renderItems(d.results);

  page++;
  loading = false;
}

/* ===============================
   BUSCADOR
================================ */
async function searchTMDB(reset = false) {
  if (loading || !query) return;
  loading = true;

  if (reset) {
    page = 1;
    grid.innerHTML = "";
  }

  const r = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&language=es-MX&query=${encodeURIComponent(query)}&page=${page}`
  );
  const d = await r.json();

  renderItems(d.results);

  page++;
  loading = false;
}

/* ===============================
   RENDER DE CARDS
================================ */
function renderItems(items) {
  items.forEach(i => {
    if (!i.poster_path || !i.media_type) return;

    const link =
      i.media_type === "movie"
        ? `movie.html?id=${i.id}`
        : i.media_type === "tv"
        ? `serie.html?id=${i.id}`
        : null;

    if (!link) return;

    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => location.href = link;

    card.innerHTML = `
      <img src="${IMG + i.poster_path}">
      <h4>${i.title || i.name}</h4>
    `;

    grid.appendChild(card);
  });
}

/* ===============================
   SCROLL INFINITO
================================ */
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 600
  ) {
    if (mode === "home") {
      loadHome();
    } else {
      searchTMDB();
    }
  }
});

/* ===============================
   EVENTO BUSCADOR
================================ */
if (searchInput) {
  searchInput.addEventListener("input", e => {
    query = e.target.value.trim();

    if (query.length === 0) {
      mode = "home";
      loadHome(true);
    } else {
      mode = "search";
      searchTMDB(true);
    }
  });
}

/* ===============================
   INICIO
================================ */
document.addEventListener("DOMContentLoaded", () => {
  loadHome(true);
});
