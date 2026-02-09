<script>
const id=new URLSearchParams(location.search).get("id");

(async()=>{
const d=await getMovie(id);

document.getElementById("app").innerHTML=`
<div class="container">

<div class="video-container">
<iframe src="https://unlimplay.com/play/embed/movie/${id}" allowfullscreen></iframe>
</div>

<div class="info-box">
<img src="https://image.tmdb.org/t/p/original${d.poster_path}" class="poster">
<div class="details">
<h2>${d.title}</h2>
<div class="icons">
<span>${d.release_date.split("-")[0]}</span>
<span>${d.runtime} min</span>
<span>${d.vote_average}</span>
</div>
</div>
</div>

<div class="synopsis">${d.overview}</div>

</div>`;
})();
</script>
