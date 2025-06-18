document.addEventListener("DOMContentLoaded", () => {
  const btnEntrar = document.getElementById("btn-entrar");
  const btnCriar = document.getElementById("btn-criar");
  const btnSair = document.getElementById("btn-sair");
  const btnApagar = document.getElementById("btn-apagar");
  const authButtons = document.getElementById("auth-buttons");
  const userButtons = document.getElementById("user-buttons");

  function mostrarBotoesLogado() {
    authButtons.classList.add("d-none");
    userButtons.classList.remove("d-none");
  }

  function mostrarBotoesDeslogado() {
    userButtons.classList.add("d-none");
    authButtons.classList.remove("d-none");
  }

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (usuario) {
    mostrarBotoesLogado();
  } else {
    mostrarBotoesDeslogado();
  }


  btnEntrar.addEventListener("click", async () => {
    const email = prompt("Digite seu e-mail:");
    const senha = prompt("Digite sua senha:");

    if (!email || !senha) {
      alert("Preencha os campos corretamente.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/users?email=${email}&senha=${senha}`);
      const users = await response.json();

      if (users.length > 0) {
        localStorage.setItem("usuarioLogado", JSON.stringify(users[0]));
        alert("Login realizado com sucesso!");
        mostrarBotoesLogado();
      } else {
        alert("Usuário ou senha incorretos.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
      console.error(error);
    }
  });


  btnSair.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    alert("Você saiu da conta.");
    mostrarBotoesDeslogado();
  });


  btnApagar.addEventListener("click", async () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario) return;

    const confirmar = confirm("Tem certeza que deseja apagar sua conta?");
    if (!confirmar) return;

    try {
      await fetch(`http://localhost:3000/users/${usuario.id}`, {
        method: "DELETE",
      });

      localStorage.removeItem("usuarioLogado");
      alert("Conta apagada com sucesso.");
      mostrarBotoesDeslogado();
    } catch (error) {
      alert("Erro ao apagar conta.");
      console.error(error);
    }
  });


  btnCriar.addEventListener("click", async () => {
    const nome = prompt("Digite seu nome:");
    const email = prompt("Digite seu e-mail:");
    const senha = prompt("Digite sua senha:");

    if (!nome || !email || !senha) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/users?email=${email}`);
      const existing = await res.json();
      if (existing.length > 0) {
        alert("Já existe uma conta com este e-mail.");
        return;
      }

      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const newUser = await response.json();
      localStorage.setItem("usuarioLogado", JSON.stringify(newUser));
      alert("Conta criada com sucesso!");
      mostrarBotoesLogado();
    } catch (error) {
      alert("Erro ao criar conta.");
      console.error(error);
    }
  });
});

