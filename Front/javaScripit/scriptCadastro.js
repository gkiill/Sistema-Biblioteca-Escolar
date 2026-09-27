const API_URL = 'http://localhost:8000/api/v1';

let selectedRole = 'aluno';

function selectRole(role) {
  selectedRole = role;
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

    docLabel.textContent = 'RA do Aluno';
    docInput.placeholder = 'ex. 2024001';
    emailInput.placeholder = 'seu.nome@aluno.fatec.sp.gov.br';
  } else if (role === 'professor') {
    btnProfessor.classList.add('active');
    btnAluno.classList.remove('active');

    docLabel.textContent = 'CPF do Docente';
    docInput.placeholder = 'ex. 000.000.000-00';
    emailInput.placeholder = 'seu.nome@fatec.sp.gov.br';
  }
}

// Envio do formulário de cadastro com persistência real
document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const documento = document.getElementById('documento').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const submitBtn = this.querySelector('.btn-submit');

  if (!nome || !email || !password) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Criando conta...';

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        name: nome,
        email: email,
        password: password,
        role: selectedRole,
        documento: documento
      })
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMsg = 'Erro ao realizar cadastro.';
      if (data.errors) {
        errorMsg = Object.values(data.errors).flat().join('\n');
      } else if (data.mensagem || data.message) {
        errorMsg = data.mensagem || data.message;
      }
      throw new Error(errorMsg);
    }

    // Monta o objeto com os dados fornecidos pelo usuário
    const usuarioSalvo = {
      id: data.usuario?.id,
      name: nome,
      email: email,
      role: selectedRole,
      documento: documento,
      ra: selectedRole === 'aluno' ? documento : '',
      departamento: selectedRole === 'professor' ? 'Corpo Docente' : 'Análise e Desenvolvimento de Sistemas'
    };

    localStorage.setItem('usuario_logado', JSON.stringify(usuarioSalvo));

    alert(`Conta criada com sucesso! Bem-vindo(a), ${nome}!`);
    window.location.href = 'perfilAluno.html';

  } catch (err) {
    alert('Atenção: ' + err.message);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Finalizar o cadastro →';
  }
});