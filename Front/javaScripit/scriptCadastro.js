const API_URL = 'http://localhost:8000/api/v1';

let selectedRole = 'aluno';

function exibirFeedback(mensagem, tipo = 'erro') {
  const feedback = document.getElementById('registerFeedback');
  if (!feedback) return;
  feedback.style.display = 'block';
  if (tipo === 'sucesso') {
    feedback.style.backgroundColor = '#dcfce7';
    feedback.style.color = '#166534';
    feedback.style.border = '1px solid #86efac';
  } else {
    feedback.style.backgroundColor = '#fee2e2';
    feedback.style.color = '#991b1b';
    feedback.style.border = '1px solid #fca5a5';
  }
  feedback.textContent = mensagem;
}

function selectRole(role) {
  selectedRole = role;
  const btnAluno = document.getElementById('btnAluno');
  const btnProfessor = document.getElementById('btnProfessor');
  const registerForm = document.getElementById('registerForm');
  
  const docLabel = document.getElementById('docLabel');
  const docInput = document.getElementById('documento');
  const emailInput = document.getElementById('email');
  const feedback = document.getElementById('registerFeedback');

  if (feedback) feedback.style.display = 'none';

  // Exibe o formulário caso esteja oculto
  registerForm.classList.remove('hidden');

  docInput.value = '';

  if (role === 'aluno') {
    btnAluno.classList.add('active');
    btnProfessor.classList.remove('active');

    docLabel.textContent = 'RA do Aluno';
    docInput.placeholder = 'ex. 2024001';
    docInput.maxLength = 12;
    emailInput.placeholder = 'seu.nome@aluno.fatec.sp.gov.br';
  } else if (role === 'professor') {
    btnProfessor.classList.add('active');
    btnAluno.classList.remove('active');

    docLabel.textContent = 'CPF do Docente';
    docInput.placeholder = '000.000.000-00';
    docInput.maxLength = 14;
    emailInput.placeholder = 'seu.nome@fatec.sp.gov.br';
  }
}

// Máscara e formatação dinâmica do campo de documento
const docInputField = document.getElementById('documento');
if (docInputField) {
  docInputField.addEventListener('input', function(e) {
    // Permite apenas dígitos numéricos
    let valor = e.target.value.replace(/\D/g, '');

    if (selectedRole === 'professor') {
      // Limita a 11 dígitos numéricos e aplica máscara 000.000.000-00
      valor = valor.slice(0, 11);
      if (valor.length > 9) {
        valor = valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
      } else if (valor.length > 6) {
        valor = valor.replace(/^(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3');
      } else if (valor.length > 3) {
        valor = valor.replace(/^(\d{3})(\d{1,3})$/, '$1.$2');
      }
      e.target.value = valor;
    } else {
      // Aluno: Apenas números até 12 dígitos
      e.target.value = valor.slice(0, 12);
    }
  });
}

// Algoritmo oficial de validação de CPF (dígitos verificadores)
function validarCPF(cpf) {
  const limpo = (cpf || '').replace(/\D/g, '');
  if (limpo.length !== 11) return false;
  // Rejeita sequências repetidas como 111.111.111-11
  if (/^(\d)\1{10}$/.test(limpo)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(limpo.charAt(i), 10) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo.charAt(9), 10)) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(limpo.charAt(i), 10) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(limpo.charAt(10), 10);
}

// Envio do formulário de cadastro com validações completas
document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const nomeInput = document.getElementById('nome');
  const docInput = document.getElementById('documento');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitBtn = this.querySelector('.btn-submit');

  const nome = nomeInput.value.trim();
  const documento = docInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!nome || !email || !password || !documento) {
    exibirFeedback('Por favor, preencha todos os campos obrigatórios.', 'erro');
    return;
  }

  // Validação específica por perfil
  if (selectedRole === 'professor') {
    if (!validarCPF(documento)) {
      exibirFeedback('CPF inválido! Digite um CPF válido com 11 dígitos.', 'erro');
      docInput.focus();
      return;
    }
  } else {
    if (documento.length < 3) {
      exibirFeedback('RA inválido! Digite um RA válido com no mínimo 3 dígitos.', 'erro');
      docInput.focus();
      return;
    }
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
        errorMsg = Object.values(data.errors).flat().join(' ');
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
      documento: data.usuario?.documento || documento,
      ra: selectedRole === 'aluno' ? documento : '',
      departamento: selectedRole === 'professor' ? 'Corpo Docente' : 'Análise e Desenvolvimento de Sistemas'
    };

    localStorage.setItem('usuario_logado', JSON.stringify(usuarioSalvo));

    exibirFeedback(`Cadastro realizado com sucesso! Bem-vindo(a), ${nome}! Redirecionando...`, 'sucesso');

    setTimeout(() => {
      window.location.href = 'perfilAluno.html';
    }, 800);

  } catch (err) {
    exibirFeedback(err.message, 'erro');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Finalizar o cadastro →';
  }
});

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
  selectRole('aluno');
});