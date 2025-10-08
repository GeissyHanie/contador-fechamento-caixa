document.addEventListener('DOMContentLoaded', () => {
    // 1. Definições de Elementos e Variáveis de Estado
    const steps = document.querySelectorAll('.step');
    const btnProximo = document.getElementById('confirmar-proximo');
    const resumoFinalDiv = document.getElementById('resumo-final');
    const saldoTotalSpan = document.getElementById('saldo-total');
    const msgErro = document.getElementById('mensagem-erro');
    const tituloPrincipal = document.getElementById('titulo-principal');
    
    let currentIndex = 0;
    // Objeto onde salvaremos todas as contagens e o total
    const resultadoContagem = {
        totalDinheiro: 0,
        detalhes: {}
    };

    // Mapeamento das denominações (Complete esta lista com todas as suas notas/moedas)
    const DENOMINACOES = [
        { id: 'nota_100', valor: 100.00 },
        { id: 'nota_50', valor: 50.00 },
        { id: 'nota_20', valor: 20.00 },
        { id: 'nota_10', valor: 10.00 },
        { id: 'nota_5', valor: 5.00 },
        { id: 'nota_2', valor: 2.00 },
        { id: 'moeda_1', valor: 1.00 },
        { id: 'moeda_050', valor: 0.50 },
        { id: 'moeda_025', valor: 0.25 },
        { id: 'moeda_010', valor: 0.10 },
        { id: 'moeda_005', valor: 0.05 },
        // Garanta que esta lista corresponde aos data-id no seu HTML!
    ];

    // 2. Função de Formatação e Atualização do Total
function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function atualizarSaldoTotal() {
    // Mude de resumoFinalDiv para saldoTotalSpan!
    saldoTotalSpan.textContent = formatarMoeda(resultadoContagem.totalDinheiro);
}

    // 3. Função de Navegação e Cálculo Principal
function avancarEtapa(event) {
    if (event) event.preventDefault();
    
    // 1. DECLARA A ETAPA ANTERIOR (a que está sendo contada AGORA)
    const etapaAnterior = DENOMINACOES[currentIndex];
    
    // 2. Pega o elemento e input atuais
    const currentStepElement = steps[currentIndex];
    const input = currentStepElement.querySelector('.quantidade');
    
    // --- Validação ---
    const quantidade = parseInt(input.value);
    if (isNaN(quantidade) || quantidade < 0) {
         msgErro.textContent = 'Por favor, digite um valor válido (0 ou mais).';
         msgErro.style.display = 'block';
         return;
    }
    msgErro.style.display = 'none';

    // --- Cálculo e Armazenamento (USANDO O ARRAY DENOMINACOES) ---
    // A condição 'currentIndex < DENOMINACOES.length' é redundante aqui se você
    // estiver garantindo que a última etapa sempre será o resultado final.
    // Mas vamos manter a checagem por segurança.
    if (currentIndex < DENOMINACOES.length) {
        // Agora etapaAnterior.valor e etapaAnterior.id EXISTEM!
        const valorTotalDaDenominacao = quantidade * etapaAnterior.valor;
        
        // Adiciona ao total geral
        resultadoContagem.totalDinheiro += valorTotalDaDenominacao;
        
        // Armazena o detalhe para o relatório final
        resultadoContagem.detalhes[etapaAnterior.id] = { 
            quantidade: quantidade, 
            valorUnitario: etapaAnterior.valor, // Boa prática para o relatório
            valorTotal: valorTotalDaDenominacao 
        };
    }
    
    // A chamada 'atualizarSaldoTotal()' ainda está comentada, o que é OK
    // se você só quiser ver o total no final (conforme o nosso último plano).
    
    // --- Transição de Etapas ---
    
    // 1. Oculta a etapa atual
    currentStepElement.style.display = 'none';

    // 2. Avança o índice
    currentIndex++;

    if (currentIndex < steps.length) {
        // Se houver próxima etapa, mostra e foca no input
        const nextStepElement = steps[currentIndex];
        nextStepElement.style.display = 'block';
        
        // Foca automaticamente no campo
        const nextInput = nextStepElement.querySelector('.quantidade');
        if (nextInput) {
            nextInput.focus();
            nextInput.value = 0;
        }
   } else {
    // Fim da Contagem

    // 1. ESCONDE o título principal (conforme o pedido anterior)
    if (tituloPrincipal) {
        tituloPrincipal.style.display = 'none';
    }
    
    // 2. ESCONDE o container de contagem (para limpar a tela)
    document.getElementById('contagem-container').style.display = 'none'; 

    // 3. Executa o Resumo Final (onde o botão é reconfigurado e o total aparece)
    exibirResultadoFinal(); 
} 
    }
    // 4. Função para Exibir o Resumo Final (Próximo Passo Lógico)
function exibirResultadoFinal() {
    // REMOVEMOS O ALERT! A função agora gerencia a exibição na tela.
    
    // 1. Torna visível o NOVO DIV de resumo (#resumo-final)
    // OBS: Você deve ter o #resumo-final no seu HTML, e ele deve estar com display: none no CSS.
    if (resumoFinalDiv) {
        resumoFinalDiv.style.display = 'block'; 
    }
        
    // 3. Atualiza o texto do SPAN com o valor calculado
    if (saldoTotalSpan) {
        saldoTotalSpan.textContent = formatarMoeda(resultadoContagem.totalDinheiro);
    }
    
    // 4. Reconfigura o botão final (para o próximo passo lógico: Envio)
    btnProximo.disabled = false;
    btnProximo.textContent = 'ENVIAR FECHAMENTO AO SERVIDOR';
    
    // 5. Inicia os Confetes (se você adicionou o script no HTML)
    if (typeof iniciarConfetes === 'function') {
        iniciarConfetes();
    }
}

    // 5. Listener do Botão
    btnProximo.addEventListener('click', avancarEtapa);

    // Foca no primeiro input ao carregar a página
    if (steps.length > 0) {
        const primeiroInput = steps[0].querySelector('.quantidade');
        if (primeiroInput) primeiroInput.focus();
    }
});