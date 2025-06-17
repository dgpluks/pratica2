const JSON_SERVER_URL = "http://localhost:3000"
const inputs = [
    "backdrop_path",
    "id",
    "overview",
    "popularity",
    "poster_path",
    "release_date",
    "title",
    "vote_average",
    "vote_count"
];

const adicionar = document.getElementById("adicionar");
adicionar.onclick = async (e) => {
    e.preventDefault();

    const data = {};
    for (const id of inputs) {
        const input = document.getElementById(id);
        if (!input || !input.value.trim()) {
            alert(`Por favor, preencha o campo ${id}`);
            return;
        }

        const valor = input.value.trim();

        // Validação para os campos que só aceitam números, ponto e vírgula
        if (["id", "popularity", "vote_average", "vote_count"].includes(id)) {
            if (!validarNumeroFormatado(valor)) {
                alert(`Digite apenas números, ponto (.) e vírgula (,) no campo ${id}`);
                return;
            }
        }

        data[id === "id" ? "id" : id] = valor;
    }

    try {
        await criarCard(data);
        alert("Card criado com sucesso!");
        limparCampos();
    } catch (err) {
        alert(err.message);
    }

    return false;
};

async function criarCard(data) {
    if (await existe(data.id)) {
        throw new Error("Filme já existe");
    } else {
        await adiciona(data);
        return true;
    }
}

async function adiciona(data) {
    await fetch(`${JSON_SERVER_URL}/results`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    atualizarSidebar();
}

async function existe(id) {
    const response = await fetch(`${JSON_SERVER_URL}/results?id=${id}`);
    const data = await response.json();
    return data.length > 0;
}







const apagar = document.getElementById("apagar");
apagar.onclick = async (e) => {
    e.preventDefault();

    const idInput = document.getElementById("id");
    if (!idInput || !idInput.value.trim()) {
        alert("Por favor, preencha o campo id para deletar");
        return false;
    }

    const id = idInput.value.trim();
    //   ========------
    try {
        if (await existe(id)) {
            await removerCard(id);
            alert(`Card com id ${id} deletado com sucesso!`);
            limparCampos();
        } else {
            alert("Não existe card com esse id.");
        }
    } catch (err) {
        alert(`Erro ao deletar: ${err.message}`);
    }

    return false;
};


async function removerCard(id) {
    const response = await fetch(`${JSON_SERVER_URL}/results/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Erro ao deletar o card");
    }
    atualizarSidebar();
    return true;
}








async function atualizarSidebar() {
    const response = await fetch(`${JSON_SERVER_URL}/results`);
    const filmes = await response.json();

    const sidebar = document.getElementById("sidebar");
    sidebar.innerHTML = "";

    filmes.forEach(filme => {
        const linha = document.createElement("div");
        linha.textContent = `id: ${filme.id} titulo: ${filme.title}`;
        sidebar.appendChild(linha);
    });
}

window.onload = () => {
    atualizarSidebar();
};

async function criarCard(data) {
    if (await existe(data.id)) {
        throw new Error("Filme já existe");
    } else {
        await adiciona(data);
        await atualizarSidebar();
        return true;
    }
}

async function removerCard(id) {
    const response = await fetch(`${JSON_SERVER_URL}/results/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Erro ao deletar o card");
    }
    await atualizarSidebar();
    return true;
}








const atualizar = document.getElementById("atualizar");
atualizar.onclick = async (e) => {
    e.preventDefault();

    const idInput = document.getElementById("id");
    const id = idInput?.value.trim();

    if (!id) {
        alert("Por favor, preencha o campo ID para atualizar.");
        return;
    }

    try {
        const response = await fetch(`${JSON_SERVER_URL}/results/${id}`);
        if (!response.ok) throw new Error("Card não encontrado");

        const cardAtual = await response.json();
        const cardExistente = Array.isArray(cardAtual) ? cardAtual[0] : cardAtual;

        if (!cardExistente || Object.keys(cardExistente).length === 0) {
            alert("Card com esse ID não existe.");
            return;
        }

        // Verifica se o id digitado é diferente do que foi retornado pelo servidor
        if (id !== String(cardExistente.id)) {
            alert("O ID não pode ser alterado.");
            return;
        }

        const cardAtualizado = { ...cardExistente };
        let houveAlteracao = false;

        for (const campo of inputs) {
            if (campo === "id") continue; // ignora id
            const input = document.getElementById(campo);
            const valorNovo = input?.value.trim();

            if (valorNovo) {
                if (["popularity", "vote_average", "vote_count"].includes(campo)) {
                    if (!validarNumeroFormatado(valorNovo)) {
                        alert(`Digite apenas números, ponto (.) e vírgula (,) no campo ${campo}`);
                        return;
                    }
                }

                if (valorNovo !== cardExistente[campo]) {
                    cardAtualizado[campo] = valorNovo;
                    houveAlteracao = true;
                }
            }
        }

        if (!houveAlteracao) {
            alert("Nenhuma alteração foi feita.");
            return;
        }

        await fetch(`${JSON_SERVER_URL}/results/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cardAtualizado)
        });

        alert("Card atualizado com sucesso!");
        limparCampos();
        atualizarSidebar();
    } catch (err) {
        alert(`Erro ao atualizar: ${err.message}`);
    }
};



function limparCampos() {
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = "";
    });
}


function validarNumeroFormatado(valor) {
    // Permite dígitos, ponto e vírgula
    const regex = /^[0-9.,]+$/;
    return regex.test(valor);
}
