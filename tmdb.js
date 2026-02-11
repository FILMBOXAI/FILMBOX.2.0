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
   CARDS RENDER
================================ */
async function renderItems(items) {
  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  // Mapeamos cada item a una promesa
  const cardsPromises = items.map(async i => {
    // 🔹 Filtrar contenido que todavía no se ha estrenado
    const date = i.release_date || i.first_air_date;

if (!date) return null;

// Comparación real de fechas (más segura)
const releaseDate = new Date(date + "T00:00:00");
const now = new Date();

if (releaseDate > now) return null;

    if (!i.poster_path || !i.media_type) return null;

    // 🔹 Creamos la card
    const card = document.createElement("div");
    card.className = "card movie-card"; // mantiene hover si ya agregaste CSS

    // 🔹 Creamos el link
    let link;
    if (i.media_type === "movie") {
      link = `movie.html?id=${i.id}`;
      card.innerHTML = `<img src="${IMG + i.poster_path}">`;
    } else if (i.media_type === "tv") {
      try {
        const serieData = await getSerie(i.id);
        const lastSeasonNumber = serieData.number_of_seasons;
        link = `serie.html?id=${i.id}&season=${lastSeasonNumber}`; // última temporada

        const lastSeason = serieData.seasons.find(s => s.season_number === lastSeasonNumber);
        if (lastSeason && lastSeason.poster_path) {
          card.innerHTML = `<img src="${IMG + lastSeason.poster_path}">`;
        } else {
          card.innerHTML = `<img src="${IMG + i.poster_path}">`;
        }
      } catch (e) {
        console.error("Error obteniendo última temporada:", e);
        link = `serie.html?id=${i.id}`; // fallback si falla
        card.innerHTML = `<img src="${IMG + i.poster_path}">`;
      }
    }

    // 🔹 Acción al hacer clic
    card.onclick = () => location.href = link;

    return card;
  });

  // Esperamos a que todas las promesas terminen
  const cards = await Promise.all(cardsPromises);

  // Agregamos solo los cards válidos al grid
  cards.forEach(c => {
    if (c) grid.appendChild(c);
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

/* ===============================
   DETALLE PELÍCULA
================================ */
async function getMovie(id){
  const r = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=es-MX`
  );
  return await r.json();
}

/* ===============================
   DETALLE SERIE
================================ */
async function getSerie(id){
  const r = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_KEY}&language=es-MX`
  );
  return await r.json();
}

/* ===============================
   EPISODIOS
================================ */
async function getEpisodes(id, season){
  const r = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${TMDB_KEY}&language=es-MX`
  );
  return await r.json();
}
