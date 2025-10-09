document.addEventListener('DOMContentLoaded', () => {
    // 1. Definições de Elementos e Variáveis de Estado - GERAIS
    const steps = document.querySelectorAll('.step');
    const btnProximo = document.getElementById('confirmar-proximo');
    const resumoFinalDiv = document.getElementById('resumo-final');
    const saldoTotalSpan = document.getElementById('saldo-total');
    const msgErro = document.getElementById('mensagem-erro');
    const tituloPrincipal = document.getElementById('titulo-principal');
    
    let currentIndex = 0;
    
    // Objeto para a Contagem Principal
    const resultadoContagem = {
        totalDinheiro: 0,
        detalhes: {}
    };

    // Objeto para a Contagem da SANGRIA
    const resultadoSangria = {
        totalDinheiro: 0,
        detalhes: {}
    };

    // Variáveis de Estado - SANGRIA
    let currentSangriaIndex = 0;
    const sangriaContainer = document.getElementById('sangria-container');
    const resumoSangriaFinalDiv = document.getElementById('resumo-sangria-final');
    const stepsSangria = document.querySelectorAll('.step-sangria'); 
    
    // Spans de resultado pós-sangria
    const saldoAntesSpan = document.getElementById('saldo-antes-sangria');
    const valorSangriaSpan = document.getElementById('valor-sangria');
    const saldoPosSpan = document.getElementById('saldo-pos-sangria');
    
    // Mapeamento das denominações (completo)
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

    // --- 3. LÓGICA DE CONTAGEM PRINCIPAL (avancarEtapa) ---
    function avancarEtapa(event) {
        if (event) event.preventDefault();
        
        const etapaAnterior = DENOMINACOES[currentIndex];
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
        if (currentIndex < steps.length) { 
            const valorTotalDaDenominacao = quantidade * etapaAnterior.valor;
            resultadoContagem.totalDinheiro += valorTotalDaDenominacao;
            // Só salva no objeto detalhes se a quantidade for maior que zero para otimização
            if (quantidade > 0) {
                 resultadoContagem.detalhes[etapaAnterior.id] = { 
                    quantidade: quantidade, 
                    valorUnitario: etapaAnterior.valor,
                    valorTotal: valorTotalDaDenominacao 
                };
            } else {
                 // Garante que o item é removido se a quantidade for zerada na volta
                 delete resultadoContagem.detalhes[etapaAnterior.id];
            }
        }
        
        // --- Transição de Etapas ---
        currentStepElement.style.display = 'none';
        currentIndex++;

        if (currentIndex < steps.length) {
            const nextStepElement = steps[currentIndex];
            nextStepElement.style.display = 'block';
            
            const nextInput = nextStepElement.querySelector('.quantidade');
            if (nextInput) {
                nextInput.focus();
                nextInput.value = 0;
            }
        } else {
            // Fim da Contagem Principal
            if (tituloPrincipal) {
                tituloPrincipal.style.display = 'none';
            }
            document.getElementById('contagem-container').style.display = 'none'; 

            exibirResultadoFinal(); 
        } 
    }
    
    // 4. Função para Exibir o Resumo Final (Pós-Contagem Principal)
    function exibirResultadoFinal() {
        
        document.getElementById('revisao-container').style.display = 'none'; 
        
        // 1. Torna visível o DIV de resumo (#resumo-final)
        if (resumoFinalDiv) {
            resumoFinalDiv.style.display = 'block'; 
        }
        
        // 2. Atualiza o texto do SPAN com o valor calculado
        if (saldoTotalSpan) {
            saldoTotalSpan.textContent = formatarMoeda(resultadoContagem.totalDinheiro);
        }
        
        // 3. Reconfigura o botão de fluxo principal
        btnProximo.disabled = false;
        btnProximo.textContent = 'Aguardando Sangria...'; 
        btnProximo.style.display = 'none'; // Esconde temporariamente para forçar o clique em 'Fazer Sangria'
        
        // 4. Conecta os botões
        const btnRevisar = document.getElementById('btn-revisar-contagem');
        if (btnRevisar) {
            btnRevisar.removeEventListener('click', montarTelaRevisao); 
            btnRevisar.addEventListener('click', montarTelaRevisao);
        }
        
        const btnIniciarSangria = document.getElementById('btn-iniciar-sangria');
        if (btnIniciarSangria) {
            btnIniciarSangria.removeEventListener('click', iniciarSangria); 
            btnIniciarSangria.addEventListener('click', iniciarSangria);
            btnIniciarSangria.style.display = 'inline-block'; 
        }
        
        // 5. Remove todos os listeners do botão principal
        btnProximo.removeEventListener('click', avancarEtapa);
        btnProximo.removeEventListener('click', avancarEtapaSangria);
    }

    // --- LÓGICA DE REVISÃO PRINCIPAL ---
    function montarTelaRevisao() {
        const listaRevisaoDiv = document.getElementById('lista-revisao');
        listaRevisaoDiv.innerHTML = ''; 
        
        document.getElementById('revisao-container').style.display = 'block';
        document.getElementById('resumo-final').style.display = 'none';
        btnProximo.style.display = 'none'; // Esconde o botão de fluxo na revisão

        let htmlRevisao = '<div class="revisao-grid">';
        
        // CORREÇÃO: Itera sobre a lista completa de DENOMINACOES
        DENOMINACOES.forEach(denominacao => {
            const idDenominacao = denominacao.id;
            const detalheSalvo = resultadoContagem.detalhes[idDenominacao];
            // Pega a quantidade salva ou usa 0 como padrão
            const quantidade = detalheSalvo ? detalheSalvo.quantidade : 0; 
            
            const valorVisual = idDenominacao.replace(/nota_|moeda_/, 'R$ ').replace(/_/, ',');

            htmlRevisao += `
                <div class="item-revisao">
                    <label for="rev_${idDenominacao}">
                        ${valorVisual}:
                    </label>
                    <input 
                        type="number" 
                        id="rev_${idDenominacao}" 
                        min="0" 
                        value="${quantidade}" 
                        data-valor-unitario="${denominacao.valor}"
                        class="quantidade-revisao"
                    >
                </div>
            `;
        });
        
        htmlRevisao += '</div>'; 
        listaRevisaoDiv.innerHTML = htmlRevisao;

        document.getElementById('btn-recalcular-total').removeEventListener('click', recalcularTotal);
        document.getElementById('btn-recalcular-total').addEventListener('click', recalcularTotal);
    }

    function recalcularTotal() {
        resultadoContagem.totalDinheiro = 0;
        resultadoContagem.detalhes = {};

        const camposRevisao = document.querySelectorAll('.quantidade-revisao');
        
        camposRevisao.forEach(input => {
            const idDenominacao = input.id.replace('rev_', '');
            const quantidade = parseInt(input.value) || 0; 
            const valorUnitario = parseFloat(input.getAttribute('data-valor-unitario'));

            const valorTotalDaDenominacao = quantidade * valorUnitario;
            resultadoContagem.totalDinheiro += valorTotalDaDenominacao;

            if (quantidade > 0) {
                 resultadoContagem.detalhes[idDenominacao] = { 
                    quantidade: quantidade, 
                    valorUnitario: valorUnitario,
                    valorTotal: valorTotalDaDenominacao
                };
            }
        });

        document.getElementById('revisao-container').style.display = 'none';
        exibirResultadoFinal(); 
    }
    
    // =========================================================
    // LÓGICA DE SANGRIA
    // =========================================================

    function iniciarSangria() {
        // Esconde o resumo final
        document.getElementById('resumo-final').style.display = 'none';
        
        // Esconde o botão de iniciar sangria no resumo
        const btnIniciarSangria = document.getElementById('btn-iniciar-sangria');
        if (btnIniciarSangria) btnIniciarSangria.style.display = 'none';

        // Reseta o estado da Sangria
        resultadoSangria.totalDinheiro = 0;
        resultadoSangria.detalhes = {};
        currentSangriaIndex = 0;

        // Mostra a contagem da Sangria 
        if (sangriaContainer) {
            sangriaContainer.style.display = 'block';
        }
        
        // Reexibe o título do cabeçalho
        if (tituloPrincipal) {
             tituloPrincipal.style.display = 'block';
        }
        
        // Configura o primeiro passo da Sangria (e esconde os demais)
        if (stepsSangria.length > 0) {
            stepsSangria.forEach((step, index) => {
                step.style.display = index === 0 ? 'block' : 'none';
                if (index === 0) {
                    const firstInput = step.querySelector('.quantidade-sangria');
                    if (firstInput) {
                        firstInput.focus();
                        firstInput.value = 0;
                    }
                }
            });
        }
        
        // Reconfigura o botão principal para AVANÇAR A SANGRIA
        btnProximo.textContent = 'CONFIRMAR E PRÓXIMO';
        btnProximo.style.display = 'block'; 
        btnProximo.removeEventListener('click', avancarEtapa);
        btnProximo.removeEventListener('click', avancarEtapaSangria);
        btnProximo.addEventListener('click', avancarEtapaSangria);
    }

    function avancarEtapaSangria(event) {
        if (event) event.preventDefault();
        
        const etapaSangria = DENOMINACOES[currentSangriaIndex];
        const currentStepElement = stepsSangria[currentSangriaIndex];
        const input = currentStepElement.querySelector('.quantidade-sangria'); 
        
        // --- Validação ---
        const quantidade = parseInt(input.value);
        if (isNaN(quantidade) || quantidade < 0) {
            msgErro.textContent = 'Por favor, digite um valor válido (0 ou mais).';
            msgErro.style.display = 'block';
            return;
        }
        msgErro.style.display = 'none';

        // --- Cálculo e Armazenamento (Sangria) ---
        if (currentSangriaIndex < stepsSangria.length) {
            const valorTotalDaDenominacao = quantidade * etapaSangria.valor;
            resultadoSangria.totalDinheiro += valorTotalDaDenominacao;
            
            if (quantidade > 0) {
                 resultadoSangria.detalhes[etapaSangria.id] = { 
                    quantidade: quantidade, 
                    valorUnitario: etapaSangria.valor,
                    valorTotal: valorTotalDaDenominacao 
                };
            } else {
                 delete resultadoSangria.detalhes[etapaSangria.id];
            }
        }
        
        // --- Transição de Etapas ---
        currentStepElement.style.display = 'none';
        currentSangriaIndex++;

        if (currentSangriaIndex < stepsSangria.length) {
            const nextStepElement = stepsSangria[currentSangriaIndex];
            nextStepElement.style.display = 'block';
            
            const nextInput = nextStepElement.querySelector('.quantidade-sangria');
            if (nextInput) {
                nextInput.focus();
                nextInput.value = 0;
            }
        } else {
            // Fim da Contagem da Sangria
            if (tituloPrincipal) {
                tituloPrincipal.style.display = 'none';
            }
            if (sangriaContainer) {
                sangriaContainer.style.display = 'none';
            }

            exibirResultadoFinalSangria(); 
        } 
    }

    function exibirResultadoFinalSangria() {
        
        const totalAntes = resultadoContagem.totalDinheiro;
        const valorSangria = resultadoSangria.totalDinheiro;
        const totalPos = totalAntes - valorSangria;
        
        document.getElementById('revisao-container-sangria').style.display = 'none';
        document.getElementById('resumo-final').style.display = 'none'; // Garante que o resumo anterior está escondido

        // 1. Torna visível o DIV de resumo da Sangria
        if (resumoSangriaFinalDiv) {
            resumoSangriaFinalDiv.style.display = 'block'; 
        }
        
        // 2. Atualiza os novos SPANs com os 3 valores
        if (saldoAntesSpan) saldoAntesSpan.textContent = formatarMoeda(totalAntes);
        if (valorSangriaSpan) valorSangriaSpan.textContent = formatarMoeda(valorSangria);
        if (saldoPosSpan) saldoPosSpan.textContent = formatarMoeda(totalPos);
        
        // 3. Reconfigura o botão de envio final
        btnProximo.textContent = 'FINALIZAR FECHAMENTO (Enviar Dados)';
        btnProximo.style.display = 'block'; 
        btnProximo.removeEventListener('click', avancarEtapaSangria);
        // btnProximo.addEventListener('click', enviarParaBackend); // Ligar a função de envio final aqui
        
        // 4. CONECTA O BOTÃO DE REVISÃO DA SANGRIA
        const btnRevisarSangria = document.getElementById('btn-revisar-sangria');
        if (btnRevisarSangria) {
            btnRevisarSangria.removeEventListener('click', montarTelaRevisaoSangria); 
            btnRevisarSangria.addEventListener('click', montarTelaRevisaoSangria);
        }
    }
    
    // --- LÓGICA DE REVISÃO DA SANGRIA ---
    function montarTelaRevisaoSangria() {
        const listaRevisaoDiv = document.getElementById('lista-revisao-sangria');
        listaRevisaoDiv.innerHTML = ''; 
        
        document.getElementById('revisao-container-sangria').style.display = 'block';
        document.getElementById('resumo-sangria-final').style.display = 'none';
        btnProximo.style.display = 'none'; // Esconde o botão de fluxo na revisão

        let htmlRevisao = '<div class="revisao-grid">';
        
        // CORREÇÃO: Itera sobre a lista completa de DENOMINACOES
        DENOMINACOES.forEach(denominacao => {
            const idDenominacao = denominacao.id;
            const detalheSalvo = resultadoSangria.detalhes[idDenominacao];
            // Pega a quantidade salva ou usa 0 como padrão
            const quantidade = detalheSalvo ? detalheSalvo.quantidade : 0; 

            const valorVisual = idDenominacao.replace(/nota_|moeda_/, 'R$ ').replace(/_/, ',');

            htmlRevisao += `
                <div class="item-revisao-sangria">
                    <label for="rev_sangria_${idDenominacao}">
                        ${valorVisual}:
                    </label>
                    <input 
                        type="number" 
                        id="rev_sangria_${idDenominacao}" 
                        min="0" 
                        value="${quantidade}" 
                        data-valor-unitario="${denominacao.valor}"
                        class="quantidade-revisao-sangria"
                    >
                </div>
            `;
        });
        
        htmlRevisao += '</div>'; 
        listaRevisaoDiv.innerHTML = htmlRevisao;

        const btnRecalcular = document.getElementById('btn-recalcular-sangria');
        btnRecalcular.removeEventListener('click', recalcularTotalSangria);
        btnRecalcular.addEventListener('click', recalcularTotalSangria);
    }

    function recalcularTotalSangria() {
        resultadoSangria.totalDinheiro = 0;
        resultadoSangria.detalhes = {};

        const camposRevisao = document.querySelectorAll('.quantidade-revisao-sangria');
        
        camposRevisao.forEach(input => {
            const idDenominacao = input.id.replace('rev_sangria_', '');
            const quantidade = parseInt(input.value) || 0; 
            const valorUnitario = parseFloat(input.getAttribute('data-valor-unitario'));

            const valorTotalDaDenominacao = quantidade * valorUnitario;
            resultadoSangria.totalDinheiro += valorTotalDaDenominacao;

            if (quantidade > 0) {
                 resultadoSangria.detalhes[idDenominacao] = { 
                    quantidade: quantidade, 
                    valorUnitario: valorUnitario,
                    valorTotal: valorTotalDaDenominacao
                };
            }
        });

        document.getElementById('revisao-container-sangria').style.display = 'none';
        exibirResultadoFinalSangria(); 
    }


    // 5. Listener do Botão Inicial
    btnProximo.addEventListener('click', avancarEtapa);
    btnProximo.style.display = 'block'; // Garante que o botão esteja visível no início

    // Foca no primeiro input ao carregar a página
    if (steps.length > 0) {
        // Exibe apenas o primeiro passo da contagem
        steps.forEach((step, index) => {
            step.style.display = index === 0 ? 'block' : 'none';
        });

        const primeiroInput = steps[0].querySelector('.quantidade');
        if (primeiroInput) primeiroInput.focus();
    }
});