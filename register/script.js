document.addEventListener('DOMContentLoaded', function () {
    const registroForm = document.getElementById('registro-form');
    const mensagemDiv = document.getElementById('mensagem');

    registroForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Impedir o envio do formulário padrão

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        // Enviar dados para o servidor
        fetch('http://localhost:3000/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha })
        })
        .then(response => response.json())
        .then(data => {
            if (data.mensagem === 'Registro bem-sucedido') {
                // Registro bem-sucedido, redirecionar ou exibir uma mensagem de sucesso
                mensagemDiv.innerHTML = '<p>Registro bem-sucedido!</p>';
                window.location.href = 'http://127.0.0.1:5500/login/index.html';
            } else {
                // Registro falhou, exibir mensagem de erro
                mensagemDiv.innerHTML = '<p>Erro no registro. Tente novamente.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao registrar: ' + error);
            mensagemDiv.innerHTML = '<p>Erro no registro. Tente novamente.</p>';
        });
    });
});