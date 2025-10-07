document.addEventListener('DOMContentLoaded', () => {
    // 1. Definições de Elementos e Variáveis de Estado
    const steps = document.querySelectorAll('.step');
    console.log("Total de etapas encontradas:", steps.length); 
    const btnProximo = document.getElementById('confirmar-proximo');
    const saldoTotalSpan = document.getElementById('saldo-parcial-total');
    const msgErro = document.getElementById('mensagem-erro');
    
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
        saldoTotalSpan.textContent = formatarMoeda(resultadoContagem.totalDinheiro);
    }

    // 3. Função de Navegação e Cálculo Principal
    function avancarEtapa(event) {
        // Pega a etapa ATUAL
        if (event) event.preventDefault();
        console.log("Botão clicado! Tentando avançar para a etapa:", currentIndex + 1);
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

        // --- Cálculo e Armazenamento ---
        const valorUnitario = parseFloat(currentStepElement.getAttribute('data-valor'));
        const id = currentStepElement.getAttribute('data-id');
        
        const valorTotalDaDenominacao = quantidade * valorUnitario;
        
        // Adiciona ao total geral
        resultadoContagem.totalDinheiro += valorTotalDaDenominacao;
        
        // Armazena o detalhe para o relatório final
        resultadoContagem.detalhes[id] = { quantidade: quantidade, valor: valorTotalDaDenominacao };

        // Atualiza a exibição na parte inferior da tela
        atualizarSaldoTotal();
        
        // --- Transição de Etapas ---
        
        // 1. Oculta a etapa atual
        currentStepElement.style.display = 'none';
        //currentStepElement.classList.remove('active');

        // 2. Avança o índice
        currentIndex++;

        if (currentIndex < steps.length) {
            // Se houver próxima etapa, mostra e foca no input
            const nextStepElement = steps[currentIndex];
            nextStepElement.style.display = 'block';
            //nextStepElement.classList.add('active');
            
            // Foca automaticamente no campo para facilitar a digitação
            const nextInput = nextStepElement.querySelector('.quantidade');
            if (nextInput) nextInput.focus();
                nextInput.focus();
                 nextInput.value = 0;
                 
        } else {
            // Fim da Contagem
            btnProximo.textContent = 'CONTAGEM FINALIZADA!';
            btnProximo.disabled = true;
            
            // Aqui você deve iniciar a próxima fase: a exibição do relatório final e o envio para o servidor (Backend)
            exibirResultadoFinal(); 
        }
    }

    // 4. Função para Exibir o Resumo Final (Próximo Passo Lógico)
    function exibirResultadoFinal() {
        alert(`Contagem Concluída! Total em Dinheiro: ${formatarMoeda(resultadoContagem.totalDinheiro)}`);
        
        // A próxima funcionalidade seria:
        // 1. Mostrar o Saldo Esperado (que viria do Backend ou de outro lugar)
        // 2. Calcular a Diferença (Saldo Físico - Saldo Esperado)
        // 3. Mostrar o formulário de Observações e o botão ENVIAR para o servidor.
        
        console.log("Dados prontos para envio:", resultadoContagem);
    }

    // 5. Listener do Botão
    btnProximo.addEventListener('click', avancarEtapa);

    // Foca no primeiro input ao carregar a página
    if (steps.length > 0) {
        const primeiroInput = steps[0].querySelector('.quantidade');
        if (primeiroInput) primeiroInput.focus();
    }
});