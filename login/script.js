document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const mensagemDiv = document.getElementById('mensagem');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Impedir o envio do formulário padrão

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        // Enviar dados para o servidor para autenticação
        fetch('http://localhost:3000/login', { // Rota de login no servidor
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha }) // Envia o email e senha
        })
        .then(response => response.json())
        .then(data => {
            if (data.autenticado) {
                // Login bem-sucedido, redirecionar ou exibir uma mensagem de sucesso
                mensagemDiv.innerHTML = '<p>Login bem-sucedido!</p>';
                window.location.href = 'http://127.0.0.1:5500/home/index.html';
            } else {
                // Login falhou, exibir mensagem de erro
                mensagemDiv.innerHTML = '<p>Credenciais inválidas. Tente novamente.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao fazer login: ' + error);
            mensagemDiv.innerHTML = '<p>Erro ao fazer login. Tente novamente.</p>';
        });
    });
});

