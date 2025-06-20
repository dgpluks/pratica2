const main = document.querySelector('main.container-fluid.mt-3.pb-5 ');
const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

async function load() {
    const id = new URLSearchParams(window.location.search).get("id");

    if (id === null || id.length === 0 || isNaN(parseInt(id))) {
        window.location.href = `./index.html`;
    }

    const response = await fetch('http://localhost:3000/results');
    const data = await response.json();
    const movie = data.find(m => String(m.id) === id);



    const parte_esquerda = document.createElement('div');
    const capa_do_filme = document.createElement('img');
    const trailer = document.createElement('img');
    const parte_direita = document.createElement('div');
    const titulo = document.createElement('h1');
    const data_lancamento = document.createElement('p');
    const descricao = document.createElement('p');
    const divisao = document.createElement('div');
    const avaliacoes = document.createElement('div');
    const nota = document.createElement('p');
    const estrela_aval = document.createElement('img');
    const favorite = document.createElement('button');
    favorite.type = "button";
    const estrela_fav = document.createElement('img');


    parte_esquerda.classList.add('parte_esquerda');
    capa_do_filme.classList.add('capa_do_filme');
    trailer.classList.add('trailer');
    parte_direita.classList.add('parte_direita');
    titulo.classList.add('titulo');
    data_lancamento.classList.add('data_lancamento');
    descricao.classList.add('descricao');
    divisao.classList.add('divisao');
    avaliacoes.classList.add('avaliacoes');
    nota.classList.add('nota');
    estrela_aval.classList.add('estrela_aval');
    favorite.classList.add('favorite');
    estrela_fav.classList.add('estrela_fav');



    parte_esquerda.append(capa_do_filme, trailer);
    parte_direita.append(titulo, data_lancamento, descricao, divisao);
    divisao.append(avaliacoes, favorite);
    avaliacoes.append(nota, estrela_aval);
    favorite.append(estrela_fav);




    capa_do_filme.src = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;
    trailer.src = `assets/imagens/erro.png`;
    titulo.innerText = movie.title;
    data_lancamento.textContent = "Data de lançamento: " + movie.release_date;
    descricao.innerText = movie.overview;
    nota.innerText = Number(movie.vote_average).toFixed(1) + "/10";
    estrela_aval.src = `assets/imagens/star.png`;
    estrela_fav.src = `assets/imagens/favorit-clicked.png`;


    main.append(parte_esquerda, parte_direita);




  favorite.addEventListener("click", async () => {
  if (!usuario) {
    alert("Você precisa estar logado para favoritar um filme.");
    return;
  }

  try {
    const usuarioId = usuario.id;
    const response = await fetch(`http://localhost:3000/users/${usuarioId}`);
    const usuarioAtualizado = await response.json();

    if (!Array.isArray(usuarioAtualizado.favoritos)) {
      alert("Conta inválida para favoritar. Tente recriar sua conta.");
      return;
    }

    const favoritos = usuarioAtualizado.favoritos;

    const index = favoritos.indexOf(movie.id);
    const estaFavorito = index !== -1;

    if (estaFavorito) {
      favoritos.splice(index, 1);
      estrela_fav.src = "assets/imagens/favorit-unclicked.png";
    } else {
      favoritos.push(movie.id);
      estrela_fav.src = "assets/imagens/favorit-clicked.png";
    }

    await fetch(`http://localhost:3000/users/${usuarioId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ favoritos })
    });

    usuario.favoritos = favoritos;
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
  } catch (error) {
    console.error("Erro ao atualizar favoritos:", error);
    alert("Erro ao atualizar favoritos.");
  }
});
}

load();
