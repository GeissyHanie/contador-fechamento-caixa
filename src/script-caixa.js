const itensCaixa = [
    { valor: 200.00, texto: "R$ 200", img: "../assets/nota200.jpg", tipo: "nota" },
    { valor: 100.00, texto: "R$ 100", img: "../assets/nota100.jpeg", tipo: "nota" },
    { valor: 50.00,  texto: "R$ 50",  img: "../assets/nota50.jpeg", tipo: "nota" },
    { valor: 20.00,  texto: "R$ 20",  img: "../assets/nota20.jpeg", tipo: "nota" },
    { valor: 10.00,  texto: "R$ 10",  img: "../assets/nota10.jpeg", tipo: "nota" },
    { valor: 5.00,   texto: "R$ 5",   img: "../assets/nota5.jpeg", tipo: "nota" },
    { valor: 2.00,   texto: "R$ 2",   img: "../assets/nota2.jpeg", tipo: "nota" },
    { valor: 1.00,   texto: "R$ 1",   img: "../assets/moeda1.png", tipo: "moeda" },
    { valor: 0.50,   texto: "R$ 0,50", img: "../assets/moeda50.png", tipo: "moeda" },
    { valor: 0.25,   texto: "R$ 0,25", img: "../assets/moeda25.png", tipo: "moeda" },
    { valor: 0.10,   texto: "R$ 0,10", img: "../assets/moeda10.png", tipo: "moeda" },
    { valor: 0.05,   texto: "R$ 0,05", img: "../assets/moeda5.png", tipo: "moeda" }
];

let etapaAtual = 0;
const SALDO_ESPERADO = 1248.50;

function calcularTotalParcial() {
    let memoria = JSON.parse(localStorage.getItem('dadosContagem')) || {};
    let total = 0;

    const qtdAtual = parseInt(document.getElementById('contador').value) || 0;
    const valorAtual = itensCaixa[etapaAtual].valor;
    
    // Para o cálculo, usamos o que está na tela no momento
    memoria[valorAtual] = qtdAtual;

    for (const valorNota in memoria) {
        total += parseFloat(valorNota) * memoria[valorNota];
    }

    const displayTotal = document.getElementById('total-parcial');
    if (displayTotal) {
        displayTotal.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    const diferenca = total - SALDO_ESPERADO;
    const displayDiff = document.getElementById('valor-diferenca'); 
    if (displayDiff) {
        displayDiff.innerText = (diferenca >= 0 ? "+ " : "- ") + Math.abs(diferenca).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        displayDiff.style.color = diferenca >= 0 ? "#2ecc71" : "#e74c3c";
    }
}

function atualizarTela() {
    const item = itensCaixa[etapaAtual];
    document.getElementById('img-nota').src = item.img;
    document.getElementById('valor-nota-display').innerText = `R$ ${item.valor.toFixed(2).replace('.', ',')}`;
    
    let memoria = JSON.parse(localStorage.getItem('dadosContagem')) || {};
    document.getElementById('contador').value = memoria[item.valor] || 0;

    document.getElementById('pergunta-nota').style.display = item.tipo === "nota" ? "inline" : "none";
    document.getElementById('pergunta-moeda').style.display = item.tipo === "moeda" ? "inline" : "none";
    
    if (item.tipo === "nota") {
        document.getElementById('texto-nota-pergunta').innerText = item.texto;
    } else {
        document.getElementById('texto-moeda-pergunta').innerText = item.texto;
    }

    const porcentagem = ((etapaAtual + 1) / itensCaixa.length) * 100;
    document.querySelector('.step-indicator').innerText = `📋 Etapa ${etapaAtual + 1} de ${itensCaixa.length}`;
    document.querySelector('.progress-bar').style.width = porcentagem + "%";
    document.querySelector('.progress-knob').style.left = porcentagem + "%";

    calcularTotalParcial();
}

function alterarValor(delta) {
    const input = document.getElementById('contador');
    let valor = parseInt(input.value) || 0;
    valor = Math.max(0, valor + delta);
    input.value = valor;
    calcularTotalParcial();
}

function proximaEtapa() {
    const qtd = parseInt(document.getElementById('contador').value) || 0;
    let memoria = JSON.parse(localStorage.getItem('dadosContagem')) || {};
    memoria[itensCaixa[etapaAtual].valor] = qtd;
    localStorage.setItem('dadosContagem', JSON.stringify(memoria));

    if (etapaAtual < itensCaixa.length - 1) {
        etapaAtual++;
        atualizarTela();
    } else {
        window.location.href = 'revisao.html'; 
    }
}

function voltarEtapa() {
    const qtd = parseInt(document.getElementById('contador').value) || 0;
    let memoria = JSON.parse(localStorage.getItem('dadosContagem')) || {};
    memoria[itensCaixa[etapaAtual].valor] = qtd;
    localStorage.setItem('dadosContagem', JSON.stringify(memoria));

    if (etapaAtual > 0) {
        etapaAtual--;
        atualizarTela();
    } else {
        window.location.href = 'dashboard.html';
    }
}

window.onload = function() {
    localStorage.removeItem('dadosContagem');
    atualizarTela();
};