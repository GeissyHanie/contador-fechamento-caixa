document.addEventListener('DOMContentLoaded', () => {
    // 1. Definições de Elementos e Variáveis de Estado
    const steps = document.querySelectorAll('.step');
    const btnProximo = document.getElementById('confirmar-proximo');
    const resumoFinalDiv = document.getElementById('resumo-final');
    // CORREÇÃO: Usando o ID 'saldo-total' do seu HTML
    const saldoTotalSpan = document.getElementById('saldo-total'); 
    const msgErro = document.getElementById('mensagem-erro');
    const tituloPrincipal = document.getElementById('titulo-principal');
    
    let currentIndex = 0;
    // Objeto onde salvaremos todas as contagens e o total
    const resultadoContagem = {
        totalDinheiro: 0,
        detalhes: {}
    };

    // Mapeamento das denominações
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
    ];

    // 2. Função de Formatação
    function formatarMoeda(valor) {
        return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    }

    // Função de atualização do total (só para referência, o principal é no exibirResultadoFinal)
    function atualizarSaldoTotal() {
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

        // --- Cálculo e Armazenamento ---
        if (currentIndex < DENOMINACOES.length) {
            const valorTotalDaDenominacao = quantidade * etapaAnterior.valor;
            
            // Adiciona ao total geral
            resultadoContagem.totalDinheiro += valorTotalDaDenominacao;
            
            // Armazena o detalhe para o relatório final
            resultadoContagem.detalhes[etapaAnterior.id] = { 
                quantidade: quantidade, 
                valorUnitario: etapaAnterior.valor,
                valorTotal: valorTotalDaDenominacao 
            };
        }
        
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
            if (tituloPrincipal) {
                tituloPrincipal.style.display = 'none';
            }
            document.getElementById('contagem-container').style.display = 'none'; 

            // Executa o Resumo Final (onde o total aparece)
            exibirResultadoFinal(); 
        } 
    }
    
    // 4. Função para Exibir o Resumo Final (tela de resumo)
    function exibirResultadoFinal() {
        
        // 1. Torna visível o DIV de resumo (#resumo-final)
        if (resumoFinalDiv) {
            resumoFinalDiv.style.display = 'block'; 
        }
        
        // 2. Atualiza o texto do SPAN com o valor calculado
        if (saldoTotalSpan) {
            saldoTotalSpan.textContent = formatarMoeda(resultadoContagem.totalDinheiro);
        }
        
        // 3. Reconfigura o botão de envio
        btnProximo.disabled = false;
        btnProximo.textContent = 'ENVIAR FECHAMENTO AO SERVIDOR';

        // 4. Inicia os Confetes (Se a função existir)
        if (typeof iniciarConfetes === 'function') {
            iniciarConfetes();
        }
        
        // 5. CONECTA O BOTÃO DE REVISÃO
        const btnRevisar = document.getElementById('btn-revisar-contagem');
        if (btnRevisar) {
            btnRevisar.removeEventListener('click', montarTelaRevisao); 
            btnRevisar.addEventListener('click', montarTelaRevisao);
        }
        
        // 6. Configura o botão principal para o próximo passo (Backend)
        btnProximo.removeEventListener('click', avancarEtapa);
        // Descomente e adicione 'enviarParaBackend' quando essa função estiver pronta
        // btnProximo.addEventListener('click', enviarParaBackend); 
        
        //console.log("Dados prontos para envio:", resultadoContagem);
    }
    
    // ========================================================
    // FUNÇÕES DE REVISÃO E RECÁLCULO (DENTRO DO ESCOPO CORRETO)
    // ========================================================

    // 7. Função para montar a tela de revisão e edição
    function montarTelaRevisao() {
        const listaRevisaoDiv = document.getElementById('lista-revisao');
        listaRevisaoDiv.innerHTML = ''; 
        
        // Mostra o container de revisão e esconde o de resumo
        document.getElementById('revisao-container').style.display = 'block';
        document.getElementById('resumo-final').style.display = 'none';

        let htmlRevisao = '<div class="revisao-grid">';
        
        // Itera sobre o objeto de detalhes para criar campos editáveis
        for (const idDenominacao in resultadoContagem.detalhes) {
            const detalhe = resultadoContagem.detalhes[idDenominacao];
            
            // Pega o nome da denominação (ex: R$ 100.00)
            const valorVisual = idDenominacao.replace(/nota_|moeda_/, 'R$ ').replace(/_/, '.');

            htmlRevisao += `
                <div class="item-revisao">
                    <label for="rev_${idDenominacao}" title="Valor unitário: R$ ${detalhe.valorUnitario.toFixed(2).replace('.', ',')}">
                        ${valorVisual}:
                    </label>
                    <input 
                        type="number" 
                        id="rev_${idDenominacao}" 
                        min="0" 
                        value="${detalhe.quantidade}" 
                        data-valor-unitario="${detalhe.valorUnitario}"
                        class="quantidade-revisao"
                    >
                </div>
            `;
        }
        
        htmlRevisao += '</div>'; // Fecha o grid (se você usar um CSS de grid)
        listaRevisaoDiv.innerHTML = htmlRevisao;

        // Adiciona o listener para o botão Recalcular
        document.getElementById('btn-recalcular-total').addEventListener('click', recalcularTotal);
    }

    // 8. Função para recalcular o total após a edição
    function recalcularTotal() {
        // 1. Zera o total geral e os detalhes
        resultadoContagem.totalDinheiro = 0;
        resultadoContagem.detalhes = {};

        // 2. Itera sobre todos os campos de revisão
        const camposRevisao = document.querySelectorAll('.quantidade-revisao');
        
        camposRevisao.forEach(input => {
            const idDenominacao = input.id.replace('rev_', '');
            // O || 0 garante que se o input for NaN (vazio), ele usa 0
            const quantidade = parseInt(input.value) || 0; 
            const valorUnitario = parseFloat(input.getAttribute('data-valor-unitario'));
            const valorTotalDaDenominacao = quantidade * valorUnitario;

            // Recalcula e salva no objeto global
            resultadoContagem.totalDinheiro += valorTotalDaDenominacao;
            resultadoContagem.detalhes[idDenominacao] = { 
                quantidade: quantidade, 
                valorUnitario: valorUnitario,
                valorTotal: valorTotalDaDenominacao 
            };
        });

        // 3. Volta para a tela de resumo com o NOVO valor
        document.getElementById('revisao-container').style.display = 'none';
        exibirResultadoFinal(); // Reexibe a tela de resumo com o valor atualizado
    }
    
    // 5. Listener do Botão Inicial
    btnProximo.addEventListener('click', avancarEtapa);

    // Foca no primeiro input ao carregar a página
    if (steps.length > 0) {
        const primeiroInput = steps[0].querySelector('.quantidade');
        if (primeiroInput) primeiroInput.focus();
    }
});