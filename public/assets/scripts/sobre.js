document.addEventListener('DOMContentLoaded', async () => {
   const response = await fetch('http://localhost:3000/results');
  const movies = await response.json();

  const generos = {
    28: 'Ação',
    12: 'Aventura',
    16: 'Animação',
    35: 'Comédia',
    80: 'Crime',
    99: 'Documentário',
    18: 'Drama',
    10751: 'Família',
    14: 'Fantasia',
    36: 'História',
    27: 'Terror',
    10402: 'Música',
    9648: 'Mistério',
    10749: 'Romance',
    878: 'Ficção Científica',
    10770: 'Filme de TV',
    53: 'Thriller',
    10752: 'Guerra',
    37: 'Faroeste'
  };
  const contadorGeneros = {};
  Object.values(generos).forEach(nome => contadorGeneros[nome] = 0);
  movies.forEach(movie => {
    movie.genre_ids.forEach(id => {
      const nome = generos[id];
      if (nome) contadorGeneros[nome]++;
    });
  });

  const nomesComFilmes = [];
  const quantidadeFilmes = [];

  for (const [nome, qtd] of Object.entries(contadorGeneros)) {
    if (qtd > 0) {
      nomesComFilmes.push(nome);
      quantidadeFilmes.push(qtd);
    }
  }

  const ctx = document.getElementById('graficoAvaliacao').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: nomesComFilmes,
      datasets: [{
        label: 'Quantidade de Filmes por Gênero',
        data: quantidadeFilmes,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#66FF66', '#FF6666', '#66FFFF', '#FFCC99',
          '#99CCFF', '#FF99CC', '#CCCCCC', '#99FFCC', '#FF9966',
          '#6699FF', '#CC6699', '#999999', '#66CC66'
        ],
        borderWidth: 1,
        borderColor: '#fff',
        hoverOffset: 30
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 20,
            padding: 15
          }
        },
        tooltip: {
          enabled: true
        }
      }
    }
  });
});




// id	nome
// 28	Ação
// 12	Aventura
// 16	Animação
// 35	Comédia
// 80	Crime
// 99	Documentário
// 18	Drama
// 10751	Família
// 14	Fantasia
// 36	História
// 27	Terror
// 10402	Música
// 9648	Mistério
// 10749	Romance
// 878	Ficção Científica
// 10770	Filme de TV
// 53	Thriller
// 10752	Guerra
// 37	Faroeste
