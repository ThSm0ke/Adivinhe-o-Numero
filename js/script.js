const nivelSelect = document.getElementById("nivelSelect");
let maximo = 10; // valor padrão
let numeroCorreto;
let tentativas;
let pontuacao = 0;
let recorde = localStorage.getItem("recorde") || 0;
let timer;

const painel = document.querySelector(".game-card");
const mensagem = document.getElementById("mensagem"); // dicas
const timerMsg = document.getElementById("timerMsg"); // tempo
const tentativasDiv = document.getElementById("tentativas");
const entrada = document.getElementById("entrada");
const mascote = document.querySelector(".mascote");

const pontuacaoDiv = document.createElement("p");
pontuacaoDiv.id = "pontuacao";
painel.appendChild(pontuacaoDiv);

// ===== DIFICULDADES ==== //
function iniciarJogo() {
    const nivel = nivelSelect.value;

    if (nivel === "facil") {
        maximo = 10;
    } else if (nivel === "medio") {
        maximo = 50;
    } else if (nivel === "dificil") {
        maximo = 100;
    }

    // ===== QUANTIDADES DE TENTATIVAS ==== //
    numeroCorreto = Math.floor(Math.random() * maximo) + 1;
    tentativas = 3;

    // ===== MENSAGEM DE INFO. DAS TENTATIVAS ==== //
    mensagem.textContent = `Você tem 3 tentativas! Digite um Nº de 1 a ${maximo}`;
    timerMsg.textContent = "";
    entrada.value = "";

    // ===== ATUALIZADOR ==== //
    atualizarTentativas();
    atualizarPontuacao();
    painel.classList.remove("acerto", "erro");
    mascote.src = "img/lupin-dir.png"; // LUPINO NEUTRO

    const nivelHUD = document.getElementById("nivel");
    if (nivelHUD) {
        nivelHUD.textContent = `Dificuldade: ${nivel.charAt(0).toUpperCase() + nivel.slice(1)}`;
    }

    iniciarTimer();
}

// ===== "VIDAS" ==== //
function atualizarTentativas() {
    let coracoes = "";
    for (let i = 0; i < tentativas; i++) {
        coracoes += "❤️ ";
    }
    tentativasDiv.innerHTML = coracoes.trim();
}

// ===== RECORDES E PONTUAÇÕES ==== //
function atualizarPontuacao() {
    pontuacaoDiv.textContent = `Pontuação: ${pontuacao} | Recorde: ${recorde}`;
    document.getElementById("headerPontuacao").textContent = `Pontuação: ${pontuacao}`;
    document.getElementById("headerRecorde").textContent = `Recorde: ${recorde}`;
    localStorage.setItem("pontuacaoAtual", pontuacao);
}

// ===== TEMPO ==== //
function iniciarTimer() {
    clearInterval(timer);
    let tempo = 10;
    timerMsg.textContent = `Tempo: ${tempo}s`;
    timer = setInterval(() => {
        tempo--;
        timerMsg.textContent = `Tempo: ${tempo}s`;
        if (tempo <= 0) {
            clearInterval(timer);
            tentativas--;
            mensagem.textContent = "⏰ Tempo esgotado! Você perdeu uma tentativa.";
            atualizarTentativas();
            mascote.src = "img/lupin-angry.png"; // LUPINO BRAVO
            setTimeout(() => mascote.src = "img/lupin-dir.png", 1000); // VOLTA AO NEUTRO (LUPINO)
            if (tentativas <= 0) {
                mensagem.textContent = "😢 Fim de jogo! O número era " + numeroCorreto;
                timerMsg.textContent = "";
            } else {
                iniciarTimer();
            }
        }
    }, 1000);
}

// ===== CHUTE ==== //
function verificarChute() {
    clearInterval(timer);
    const valor = parseInt(entrada.value);

    if (isNaN(valor)) {
        mensagem.textContent = "Digite um número válido!";
        iniciarTimer();
        return;
    }

    tentativas--;

    // ===== N° CORRETO ==== //
    if (valor === numeroCorreto) {
        mensagem.textContent = "Acertou! O número era " + numeroCorreto + "!";
        painel.classList.add("acerto");
        mascote.src = "img/lupin-dir.png"; // LUPINO NEUTRO (-> por enquanto sem feliz <-)
        pontuacao += 10;

        // ===== RECORDE ==== //
        if (pontuacao > recorde) {
            recorde = pontuacao;
            localStorage.setItem("recorde", recorde);
            mensagem.textContent += " 🏆 Novo recorde!";
        }

        // ===== ERROS ==== //
        atualizarPontuacao();
        timerMsg.textContent = "";
    } else if (tentativas > 0) {
        painel.classList.add("erro");
        setTimeout(() => painel.classList.remove("erro"), 500);
        mascote.src = "img/lupin-angry.png"; // LUPINO BRAVO
        if (valor < numeroCorreto) {
            mensagem.textContent = "O número correto é MAIOR. Tentativas restantes: " + tentativas;
        } else {
            mensagem.textContent = "O número correto é MENOR. Tentativas restantes: " + tentativas;
        }
        setTimeout(() => mascote.src = "img/lupin-dir.png", 1000); // VOLTA AO NEUTRO (LUPINO)
        iniciarTimer();
    } else {
        mensagem.textContent = "😢 Fim de jogo! O número era " + numeroCorreto;
        mascote.src = "img/lupin-angry.png"; // LUPINO BRAVO
        timerMsg.textContent = "";
    }

    atualizarTentativas();
    atualizarPontuacao();
}

// ===== BOTÕES ==== //
document.getElementById("btnChutar").addEventListener("click", verificarChute);
document.getElementById("btnNovo").addEventListener("click", iniciarJogo);
entrada.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        verificarChute();
    }
});

// ===== PRINCIPAL... ==== //
iniciarJogo();
