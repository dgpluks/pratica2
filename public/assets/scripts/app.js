const JSON_SERVER_URL = "http://localhost:3000"
const divTodd = document.querySelector('main section.todos.mt-4 div.row.g-4.pt-2');

function renderMovie(movie) {

    const card = document.createElement('div');
    const cardClicavel = document.createElement('div');
    const link = document.createElement('a');
    const banner = document.createElement('img');
    const title = document.createElement('h3');
    

    card.classList.add('col-6', 'col-md-3', 'col-lg-2');
    cardClicavel.classList.add('card', 'h-100');
    link.classList.add('link');
    banner.classList.add("banner");
    title.classList.add('title');
    

    card.append(cardClicavel);
    cardClicavel.append(link)
    link.append(banner, title);

    link.href = `detalhe.html?id=${movie.id}`;
    link.id="filme";
    
    banner.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    title.innerText = movie.title;
    

    divTodd.appendChild(card);
}



const divDest = document.querySelector('main section.destaques div.row.g-4.pt-2');
function renderDest(filmes) {
    const card = document.createElement('div');
    const cardClicavel = document.createElement('div');
    const link = document.createElement('a');
    const banner = document.createElement('img');
    const title = document.createElement('h3');
    

    card.classList.add('col-6', 'col-md-3', 'col-lg-2');
    cardClicavel.classList.add('card', 'h-100');
    link.classList.add('link');
    banner.classList.add("banner");
    title.classList.add('title');
    

    card.append(cardClicavel);
    cardClicavel.append(link)
    link.append(banner, title);

    link.href = `detalhe.html?id=${filmes.id}`;
    link.id="filme";
    
    banner.src = `https://image.tmdb.org/t/p/w200${filmes.poster_path}`;
    title.innerText = filmes.title;
    

    divDest.appendChild(card);
}



async function load() {
    const response = await fetch('http://localhost:3000/results');
    const movies = await response.json();
    
    const topRated = [...movies]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 6);
    
    topRated.forEach(filme => {
        renderDest(filme);
    });


    for (let i = movies.length-1; i >= 0; i--) {
        renderMovie(movies[i]);
    }
}

document.addEventListener('DOMContentLoaded', () => {
  load();
});
