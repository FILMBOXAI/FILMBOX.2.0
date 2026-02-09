<script>
const id=new URLSearchParams(location.search).get("id");
const season=1;

(async()=>{
const d=await getSerie(id);
const eps=await getEpisodes(id,season);

let caps="";
eps.episodes.forEach(e=>{
caps+=`<div class="chapter-btn" data-video="https://unlimplay.com/play/embed/tv/${id}/${season}/${e.episode_number}">${e.episode_number}</div>`;
});

document.getElementById("app").innerHTML=`
<div class="container">

<div class="video-container">
<iframe id="player" allowfullscreen></iframe>
</div>

<div class="info-box">
<img src="https://image.tmdb.org/t/p/original${d.poster_path}" class="poster">
<div class="details">
<h2>${d.name}</h2>
<div class="icons">
<span>${d.first_air_date.split("-")[0]}</span>
<span>${d.vote_average}</span>
</div>
</div>
</div>

<div class="chapters-box">
<h3>Capítulos</h3>
<div class="chapters">${caps}</div>
</div>

<div class="synopsis">${d.overview}</div>
</div>`;

const btns=document.querySelectorAll(".chapter-btn");
const p=document.getElementById("player");
if(btns[0]){p.src=btns[0].dataset.video;btns[0].classList.add("active");}

btns.forEach(b=>{
b.onclick=()=>{
p.src=b.dataset.video;
btns.forEach(x=>x.classList.remove("active"));
b.classList.add("active");
};
});
})();
</script>
