document.getElementById('btn-login').addEventListener('click', async function(event) {
    // Evita que o formulário recarregue a página
    event.preventDefault();

    // 1. Captura dos elementos do HTML pelos IDs que adicionamos
    const campoEmail = document.getElementById('email');
    const campoSenha = document.getElementById('senha');

    // Validação visual simples: verifica se os campos existem no HTML
    if (!campoEmail || !campoSenha) {
        console.error("Erro: Verifique se os IDs 'email' e 'senha' estão corretos no HTML.");
        return;
    }

    const email = campoEmail.value.trim();
    const senha = campoSenha.value.trim();

    // 2. Validação básica de preenchimento
    if (!email || !senha) {
        alert("Por favor, preencha o e-mail e a senha.");
        return;
    }

    // 3. Comunicação com o Backend (API)
    try {
        // Mostra um feedback visual simples no botão (opcional)
        const btnOriginalText = this.innerText;
        this.innerText = "Entrando...";
        this.disabled = true;

        const resposta = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            // SE O LOGIN DER CERTO:
            // Guardamos o Token de segurança e o nome do usuário
            localStorage.setItem('token', dados.token);
            localStorage.setItem('usuarioLogado', dados.usuario.nome);

            // Redireciona para o Dashboard
            window.location.href = "dashboard.html";
        } else {
            // SE O LOGIN FALHAR (Senha errada, usuário não existe, etc):
            alert(dados.mensagem || "Erro ao realizar login.");
            this.innerText = btnOriginalText;
            this.disabled = false;
        }

    } catch (error) {
        // SE O SERVIDOR ESTIVER OFF-LINE OU HOUVER ERRO DE REDE:
        console.error('Erro na conexão:', error);
        alert('Não foi possível conectar ao servidor. Verifique se o node server.js está rodando!');
        
        // Volta o botão ao estado normal
        this.innerText = "Entrar";
        this.disabled = false;
    }
});