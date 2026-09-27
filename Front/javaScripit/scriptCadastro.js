function selectRole(role) {
  const btnAluno = document.getElementById('btnAluno');
  const btnProfessor = document.getElementById('btnProfessor');
  const registerForm = document.getElementById('registerForm');
  
  const docLabel = document.getElementById('docLabel');
  const docInput = document.getElementById('documento');
  const emailInput = document.getElementById('email');

  // Exibe o formulário caso esteja oculto
  registerForm.classList.remove('hidden');

  if (role === 'aluno') {
    btnAluno.classList.add('active');
    btnProfessor.classList.remove('active');

    docLabel.textContent = 'RA';
    docInput.placeholder = 'ex. 2024001';
    emailInput.placeholder = 'jane.doe@aluno.edu.com.br';
  } else if (role === 'professor') {
    btnProfessor.classList.add('active');
    btnAluno.classList.remove('active');

    docLabel.textContent = 'CPF';
    docInput.placeholder = 'ex. 001.002.003-04';
    emailInput.placeholder = 'jane.doe@profe.edu.com.br';
  }
}

//mensagem de que o cadastro foi realizado
document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Cadastro realizado com sucesso!');

  //vai para a página home
  if (email && password) {
    window.location.href = 'home.html';
  }
});