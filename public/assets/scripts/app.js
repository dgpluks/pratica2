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
const carouselInner = document.getElementById('carousel-inner');

function renderDest(filme, index) {
    const item = document.createElement('div');
    item.classList.add('carousel-item');
    if (index === 0) item.classList.add('active');

    const link = document.createElement('a');
    link.href = `detalhe.html?id=${filme.id}`;
    link.classList.add('d-block', 'w-100', 'text-center', 'text-decoration-none');

    const image = document.createElement('img');
    image.src = `https://image.tmdb.org/t/p/w780${filme.backdrop_path}`;
    image.classList.add('d-block', 'w-100');
    image.alt = filme.title;

    const caption = document.createElement('div');
    caption.classList.add('carousel-caption', 'd-none', 'd-md-block', 'bg-dark', 'bg-opacity-50', 'rounded');
    caption.innerHTML = `<h5>${filme.title}</h5><p>${filme.overview}</p>`;

    link.appendChild(image);
    link.appendChild(caption);
    item.appendChild(link);
    carouselInner.appendChild(item);
}



async function load() {
    const response = await fetch('http://localhost:3000/results');
    const movies = await response.json();
    
    const topRated = [...movies]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 6);
    
    topRated.forEach((filme, index) => {
        renderDest(filme, index);
    });


    for (let i = movies.length-1; i >= 0; i--) {
        renderMovie(movies[i]);
    }
}

document.addEventListener('DOMContentLoaded', () => {
  load();
});





function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
  
  let allMovies = []; // vai guardar todos os filmes carregados
  const searchInput = document.querySelector('input.search');
  
  function renderMoviesList(movies) {
    divTodd.innerHTML = ''; // limpa os cards
    movies.forEach(renderMovie);
  }
  
  async function load() {
      const response = await fetch('http://localhost:3000/results');
      allMovies = await response.json();
  
      const topRated = [...allMovies]
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 6);
  
      topRated.forEach((filme, index) => {
          renderDest(filme, index);
      });
  
      renderMoviesList(allMovies);
  }
  
  searchInput.addEventListener('input', () => {
    const query = normalizeString(searchInput.value);
    if (!query) {
      renderMoviesList(allMovies);
      return;
    }
    const filtered = allMovies.filter(movie => normalizeString(movie.title).includes(query));
    renderMoviesList(filtered);
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    load();
  });






  document.addEventListener("DOMContentLoaded", () => {
    const btnContainer = document.querySelector('.button-container'); 
  
    function atualizarVisibilidadeAdmin() {
      const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
      if (usuario && usuario.adm) {
        btnContainer.style.display = "block"; 
      } else {
        btnContainer.style.display = "none"; 
      }
    }
  

    atualizarVisibilidadeAdmin();

    window.addEventListener("storage", () => {
      atualizarVisibilidadeAdmin();
    });
    let usuarioAtual = JSON.stringify(JSON.parse(localStorage.getItem("usuarioLogado")));
  
    setInterval(() => {
      const usuarioNovo = JSON.stringify(JSON.parse(localStorage.getItem("usuarioLogado")));
      if (usuarioNovo !== usuarioAtual) {
        usuarioAtual = usuarioNovo;
        atualizarVisibilidadeAdmin();
      }
    }, 1000);
  });
