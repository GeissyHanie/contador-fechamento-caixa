document.getElementById('btn-login').addEventListener('click', function() {
    const loginDigitado = document.querySelector('input[type="text"]').value;
    const nomeSalvo = localStorage.getItem('usuarioCadastrado');

    // Se o que ele digitou no login for parte do e-mail cadastrado, 
    // ou se você apenas quer que o nome apareça:
    if (nomeSalvo) {
        localStorage.setItem('usuarioLogado', nomeSalvo);
    } else {
        // Fallback caso não tenha passado pelo cadastro
        localStorage.setItem('usuarioLogado', loginDigitado.split('@')[0]);
    }

    window.location.href = "dashboard.html"; 
});