function login(credential) {
    if (credential === 'mestre') {
        window.location.href = '../pages/mestre/index.html';
    } else if (credential === 'almoxarife') {
        window.location.href = '../pages/almoxarife/index.html';
    } else {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (fazerLogin(username, password)) {
            // Redireciona para a página principal após login bem-sucedido
            window.location.href = 'index.html';
        }
    }
}
function sair() {
    window.location.href = '../../public/login.html';
}