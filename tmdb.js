<script>
const TMDB_KEY="TU_API_KEY_AQUI";
const IMG="https://image.tmdb.org/t/p/original";

async function loadHome(){
  const r=await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_KEY}&language=es-MX`);
  const d=await r.json();
  const g=document.getElementById("grid");

  d.results.forEach(i=>{
    if(!i.poster_path) return;
    const type=i.media_type;
    const link=type==="movie"
      ? `movie.html?id=${i.id}`
      : `serie.html?id=${i.id}`;

    g.innerHTML+=`
    <div class="card" onclick="location.href='${link}'">
      <img src="${IMG+i.poster_path}">
      <h4>${i.title||i.name}</h4>
    </div>`;
  });
}

async function getMovie(id){
  const r=await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=es-MX`);
  return await r.json();
}

async function getSerie(id){
  const r=await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_KEY}&language=es-MX`);
  return await r.json();
}

async function getEpisodes(id,season){
  const r=await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${TMDB_KEY}&language=es-MX`);
  return await r.json();
}
</script>
