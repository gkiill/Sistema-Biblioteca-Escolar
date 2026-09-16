//INICIO TELA LOGIN
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o recarregamento padrão da página
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Redireciona para a página home ao submeter os dados
  if (email && password) {
    window.location.href = 'home.html';
  }
});
//FIM DA TELA LOGIN