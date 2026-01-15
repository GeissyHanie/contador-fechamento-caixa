const itensCaixa = [
            { valor: "200,00", texto: "R$ 200", img: "../assets/nota200.jpg", tipo: "nota" },
            { valor: "100,00", texto: "R$ 100", img: "../assets/nota100.jpeg", tipo: "nota" },
            { valor: "50,00",  texto: "R$ 50",  img: "../assets/nota50.jpeg", tipo: "nota" },
            { valor: "20,00",  texto: "R$ 20",  img: "../assets/nota20.jpeg", tipo: "nota" },
            { valor: "10,00",  texto: "R$ 10",  img: "../assets/nota10.jpeg", tipo: "nota" },
            { valor: "5,00",   texto: "R$ 5",   img: "../assets/nota5.jpeg", tipo: "nota" },
            { valor: "2,00",   texto: "R$ 2",   img: "../assets/nota2.jpeg", tipo: "nota" },
            { valor: "1,00",   texto: "R$ 1",   img: "../assets/moeda1.png", tipo: "moeda" },
            { valor: "0,50",   texto: "R$ 0,50",   img: "../assets/moeda50.png", tipo: "moeda" },
            { valor: "0,25",   texto: "R$ 0,25",   img: "../assets/moeda25.png", tipo: "moeda" },
            { valor: "0,10",   texto: "R$ 0,10",   img: "../assets/moeda10.png", tipo: "moeda" },
            { valor: "0,05",   texto: "R$ 0,05",   img: "../assets/moeda5.png", tipo: "moeda" }
        ];

let etapaAtual = 0;

function atualizarTela() {
    const item = itensCaixa[etapaAtual];

    // Atualiza imagem e valor
    document.getElementById('img-nota').src = item.img;
    document.getElementById('valor-nota-display').innerText = `R$ ${item.valor}`;
    document.getElementById('contador').value = 0;

    const areaNota = document.getElementById('pergunta-nota');
    const areaMoeda = document.getElementById('pergunta-moeda');

    // 🔥 AQUI está a lógica que faltava
    if (item.tipo === "moeda") {
        areaNota.style.display = "none";
        areaMoeda.style.display = "inline";
        document.getElementById('texto-moeda-pergunta').innerText = item.texto;
    } else {
        areaNota.style.display = "inline";
        areaMoeda.style.display = "none";
        document.getElementById('texto-nota-pergunta').innerText = item.texto;
    }

    // Progresso
    const porcentagem = ((etapaAtual + 1) / itensCaixa.length) * 100;
    document.querySelector('.step-indicator').innerText =
        `📋 Etapa ${etapaAtual + 1} de ${itensCaixa.length}`;
    document.querySelector('.progress-bar').style.width = porcentagem + "%";
    document.querySelector('.progress-knob').style.left = porcentagem + "%";
}

function proximaEtapa() {
    const inputContador = document.getElementById('contador');
    const qtd = parseInt(inputContador.value) || 0;
    const itemAtual = itensCaixa[etapaAtual];
    
    // 1. Salva na memória temporária
    // Criamos um objeto se ele não existir
    let memoria = JSON.parse(localStorage.getItem('dadosContagem')) || {};
    memoria[itemAtual.valor] = qtd;
    localStorage.setItem('dadosContagem', JSON.stringify(memoria));

    // 2. Verifica se vai para a próxima nota ou para a revisão
    if (etapaAtual < itensCaixa.length - 1) {
        etapaAtual++;
        atualizarTela();
    } else {
        // MUITO IMPORTANTE: O nome do arquivo aqui deve ser igual ao que você salvou
        window.location.href = 'revisao.html'; 
    }
}

function voltarEtapa() {
    if (etapaAtual > 0) {
        etapaAtual--;
        atualizarTela();
    }
}

function alterarValor(delta) {
    const input = document.getElementById('contador');
    let valor = parseInt(input.value);
    valor = Math.max(0, valor + delta);
    input.value = valor;
}

window.onload = atualizarTela;